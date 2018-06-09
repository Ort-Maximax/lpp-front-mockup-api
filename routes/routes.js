
'use strict';

const fs = require('fs');
const fileUpload = require('express-fileupload');
const PythonShell = require('python-shell');

const OktaJwtVerifier = require('@okta/jwt-verifier');

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: 'https://dev-438691.oktapreview.com/oauth2/default',
});

const appRouter = (app) => {
  app.use(fileUpload());

  const sendSeekable = require('send-seekable');
  app.get('/getData', (req, res) => {
    oktaJwtVerifier.verifyAccessToken(req.token)
      .then(jwt => {
        // the token is valid
        console.log('getData');

        PythonShell.run('Tree.py',
          { args: ['datas/user1'] },
          (err, results) => {
            if (err) throw err;
            res.status(200).send(results[0]);
          });
        console.log(jwt.claims);
      })
      .catch(err => {
        console.log(err);
      });
  });

  app.get('/streamFile', sendSeekable, (req, res) => {

    /* oktaJwtVerifier.verifyAccessToken(req.token)
      .then(jwt => {*/
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
    /* })
      .catch(err => {
        console.log(err);
      });*/


  });

  app.get('/removeFile', (req, res) => {

    oktaJwtVerifier.verifyAccessToken(req.token)
      .then(jwt => {
        const pathPrefix = `${process.cwd()}/datas`;
        const path = `${pathPrefix}/${req.query.path}`;
        if (fs.existsSync(path)){
          fs.unlinkSync(path);
        }
      })
      .catch(err => {
        console.log(err);
      });

  });

  app.get('/downloadFile', (req, res) => {
    console.log(req.roken);

    oktaJwtVerifier.verifyAccessToken(req.token)
      .then(jwt => {
        const pathPrefix = `${process.cwd()}/datas`;
        const path = `${pathPrefix}/${req.query.path}`;
        if (fs.existsSync(path)){
          res.download(path);
        }
      })
      .catch(err => {
        console.log(err);
      });

  });

  app.put('/uploadFile', (req, res) => {

    oktaJwtVerifier.verifyAccessToken(req.token)
      .then(jwt => {
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
      })
      .catch(err => {
        console.log(err);
      });

    if (!req.files || !req.body.path) {
      return res.status(400).send('Missing file data');
    }
  });
};

module.exports = appRouter;
