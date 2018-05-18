
const appRouter = (app) => {
  app.get("/getData", (req, res) => {
    const apiData = {
      name: 'Home',
      path: 'path/to/user/folder',
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
    };
    res.status(200).send(apiData);
  });
}

module.exports = appRouter;