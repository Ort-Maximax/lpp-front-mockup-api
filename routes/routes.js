
'use strict';

const fs = require('fs');
const rimraf = require('rimraf');
const fileUpload = require('express-fileupload');
const PythonShell = require('python-shell');
const { generateToken, sendToken } = require('../utils/token.utils');
const passport = require('passport');
const middlewares = require('./middlewares');

require('../db/passport')();
require('dotenv').config();

const appRouter = (app) => {
  app.use(fileUpload());

  const updateClient = (req) => {
    if (req.app.socket) {
      req.app.socket.emit(`dataChange${req.clientId}`);
    }
  };

  const sendSeekable = require('send-seekable');

  app.get('/time', (req, res) => {
    return res.status(200).send(Date.now().toString());
  });

  app.post('/auth/google', passport.authenticate('google-token', {session: false}), (req, res, next) => {
    if (!req.user) {
      return res.send(401, 'User Not Authenticated');
    }
    req.auth = {
      id: req.user.id,
    };

    next();
  }, generateToken, sendToken);


  app.get('/getData', middlewares.authRequired, (req, res) => {
    PythonShell.run('./core/Tree.py',
      { // args: [`datas/${req.clientId}`] },
        args: ['datas/user1'] },
      (err, results) => {
        if (err) throw err;
        return res.status(200).send(results[0]);
      });
  });

  app.get('/streamFile', sendSeekable, (req, res) => {
    const pathPrefix = `${process.cwd()}/datas`;
    const path = `${pathPrefix}/${req.query.path}`;
    if (fs.existsSync(path)){
      fs.stat(path, function(error, stat) {
        if (error) { throw error; }
        const stream = fs.createReadStream(path);
        res.sendSeekable(stream, { length: stat.size});
      });
    } else {
      return res.status(400).send('File not found');
    }
  });

  app.post('/removeElement', middlewares.authRequired, (req, res) => {
    const pathPrefix = `${process.cwd()}/datas`;
    req.body.forEach((path) => {
      path = `${pathPrefix}/${path}`;
      if (fs.existsSync(path)) {

        fs.stat(path, (error, stat) => {
          if (error) { throw error; }
          if (stat.isDirectory()){
            rimraf(path, () => {});
          } else {
            fs.unlinkSync(path);
          }
        });
      }
    });
    updateClient(req);
    return res.status(200).send('File deleted');
  });

  app.get('/downloadFile', middlewares.authRequired, (req, res) => {
    const pathPrefix = `${process.cwd()}/datas`;
    const path = `${pathPrefix}/${req.query.path}`;
    if (fs.existsSync(path)){
      res.download(path);
      return res.status(200);
    }
    return res.status(400).send('File not found');

  });

  app.put('/uploadFile', middlewares.authRequired, (req, res) => {
    if (!req.files || !req.body.path) {
      return res.status(400).send('Missing file data');
    }
    const file = req.files.data;
    let path = req.body.path;
    let i = 1;
    while (fs.existsSync(`./datas/${path}`)){
      path = `${req.body.path} (${i})`;
    }
    file.mv(`./datas/${path}`, function(err) {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      updateClient(req);
      return res.status(200).send('File uploaded!');
    });
  });

  app.post('/createDirectory', middlewares.authRequired, (req, res) => {
    let dirPath = `./datas/${req.body.path}/Nouveau dossier`;
    if (!fs.existsSync(dirPath)){
      fs.mkdirSync(dirPath);
    } else {
      let i = 1;
      while (fs.existsSync(dirPath)){
        dirPath = `./datas/${req.body.path}/Nouveau dossier (${i})`;
        i++;
      }
      fs.mkdirSync(dirPath);
    }
    updateClient(req);
    return res.status(200).send('New directory created');
  });

  app.post('/renameElement', middlewares.authRequired, (req, res) => {
    const elPath = `./datas/${req.body.path}`;
    if (fs.existsSync(elPath)){
      const arrPath = elPath.split('/');
      arrPath[arrPath.length - 1] = req.body.newName;
      const newPath = arrPath.join('/');

      fs.rename(`./datas/${req.body.path}`,
        `${newPath}`, function(err) {
          if (err){
            console.log('ERROR: ' + err);
            return res.status(501).send('Error renaming element');
          }
          updateClient(req);
          return res.status(200).send('Element renamed successfully');
        });

    } else {
      return res.status(500).send('Error renaming element');
    }
  });
};

module.exports = appRouter;
