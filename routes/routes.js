
'use strict';

const fs = require('fs');
const fileUpload = require('express-fileupload');
const PythonShell = require('python-shell');

const appRouter = (app) => {
  app.use(fileUpload());

  const sendSeekable = require('send-seekable');
  app.get('/getData', (req, res) => {
    console.log('getData');

    PythonShell.run('Tree.py', { args: ['datas/user1'] }, (err, results) => {
      if (err) throw err;
      res.status(200).send(results[0]);
    });

  });

  app.get('/streamFile', sendSeekable, (req, res) => {
    const pathPrefix = `${process.cwd()}/datas`;
    const path = `${pathPrefix}/${req.query.path}`;
    if (fs.existsSync(path)){
      fs.stat(path, function(error, stat) {
        if (error) { throw error; }
        console.log(path);
        const stream = fs.createReadStream(path);
        res.sendSeekable(stream, { length: stat.size});
      });
    }
  });

  app.get('/removeFile', (req, res) => {
    const pathPrefix = `${process.cwd()}/datas`;
    const path = `${pathPrefix}/${req.query.path}`;
    if (fs.existsSync(path)){
      fs.unlinkSync(path);
    }
  });

  app.get('/downloadFile', (req, res) => {
    const pathPrefix = `${process.cwd()}/datas`;
    const path = `${pathPrefix}/${req.query.path}`;
    if (fs.existsSync(path)){
      res.download(path);
    }
  });

  app.put('/uploadFile', (req, res) => {
    if (!req.files || !req.body.path) {
      return res.status(400).send('Missing file data');
    }

    // The name of the input field (i.e. "sampleFile")
    // is used to retrieve the uploaded file
    const file = req.files.data;
    const path = req.body.path;
    // Use the mv() method to place the file somewhere on your server
    file.mv(`./datas/${path}`, function(err) {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      res.send('File uploaded!');
    });
  });
};

module.exports = appRouter;
