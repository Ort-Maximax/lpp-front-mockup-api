
const fs = require('fs');
const fileUpload = require('express-fileupload');

const appRouter = (app) => {
  app.use(fileUpload());
  
  const sendSeekable = require('send-seekable');  
  app.get("/getData", (req, res) => {
    console.log('getData')
    /*const apiData = {
      path: 'user1',
      children: [
        {
          name: 'Folder 1',
          children: [
            {
              name: 'Folder 11',
              children: [
                { name: 'test1.tar.gz' },
                { name: 'file1.rar' },
              ],
            },
            {
              name: 'Folder $^3ç#?&',
              children: [
                { name: 'test2.tar.gz' },
                { name: 'file2.rar' },
              ],
            },
            {
              name: 'Folder qui a un nom qui, il se trouve, est très long et prend beaucoup d\'espace OMG ce nom est interminable',
              children: [
                { name: 'test3.tar.gz' },
                { name: 'file3.rar' },
              ],
            },
            { name: 'file.js', lastUpdated: '01/01/2001' },
            { name: 'file.html', lastUpdated: '02/02/2002' },
            { name: 'file.json', lastUpdated: '03/03/2003' },
    
            { name: 'file.avi', lastUpdated: '04/04/2004' },
            { name: 'file.mkv', lastUpdated: '05/05/2005' },
            { name: 'file.mp4', lastUpdated: '06/06/2006' },
    
            { name: 'file.mp3', lastUpdated: '07/07/2007' },
            { name: 'file.ogg', lastUpdated: '08/08/2008' },
            { name: 'file.flac', lastUpdated: '09/09/2009' },
    
            { name: 'file.jpg', lastUpdated: '10/10/2010' },
            { name: 'file.jpeg', lastUpdated: '11/11/2011' },
            { name: 'file.png', lastUpdated: '12/12/2012' },
    
          ],
        },
        {
          name: 'Folder 2',
          children: [
            {
              name: 'Folder 21',
              children: [
                { name: 'test4.tar.gz' },
                { name: 'file4.rar' },
              ],
            },
            { name: 'LoneFile.js' },
          ],
        },
        {
          name: 'Empty Folder',
          children: [],
        },
      ],
    };*/
    const apiData= {
      path: 'user1',
      children: [
        {
          name: 'Folder 1',
          children: [
            {
              name: 'Folder 11',
              children: [],
            },
            {
              name: 'Folder $^3ç#?&',
              children: [
                { name: 'test2.tar.gz' },
                { name: 'file2.rar' },
              ],
            },
            { name: 'test.JPEG'},
            { name: 'test.mp4'},
            { name: 'bunny.mp4'},
            { name: 'test.txt'},
            { name: 'rien2rien.mp3'},
            { name: 'test1.tar.gz'},
            { name: 'smells.mp3'},
            { name: 'test2.tar.bz2'},
    
          ],
        },
        {
          name: 'Empty Folder',
          children: [],
        },
      ],

    }
    res.status(200).send(apiData);
  });

  app.get("/getFile", sendSeekable, (req, res) => {
    const pathPrefix  = `${process.cwd()}/datas`;
    const path = `${pathPrefix}/${req.query.path}`
    if(fs.existsSync(path)){
      fs.stat(path, function(error, stat) {
        if (error) { throw error; }
        console.log(path);
        const stream = fs.createReadStream(path);
        res.sendSeekable(stream, { length : stat.size});
      }); 
    }
  })
  app.put("/uploadFile", (req, res) => {
    if (!req.files || !req.body.path) {
      return res.status(400).send('Missing file data');
    }
 
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    const file = req.files.data
    const path = req.body.path
        // Use the mv() method to place the file somewhere on your server
    file.mv(`./datas/${path}`, function(err) {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }  
      res.send('File uploaded!');
    });
  })
}

module.exports = appRouter;