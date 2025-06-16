
const express = require("express");
const path = require("path");
const router = express.Router();
const fs = require('fs');
const archiver = require('archiver');


// download mp3 Route  - - - - -

/*
router.get('/download', (req, res) => {
    const filePath = path.join(__dirname, '..', 'public_html','downy');
    res.download(filePath, 'downloaded-song.mp3', (err) => {
      if (err) {
        console.error('Error during download:', err);
        res.status(500).send('File download failed.');
      }
    });
  });
*/

// download zip package route
router.get('/download', (req, res) => {
  const dirPath = path.join(__dirname, '..', 'public_html', 'downy');
  const zipName = 'download.zip';

  res.setHeader('Content-Disposition', `attachment; filename=${zipName}`);
  res.setHeader('Content-Type', 'application/zip');

  const archive = archiver('zip', { zlib: { level: 9 } });

  archive.directory(dirPath, false); // false means don't include the directory itself, just contents
  archive.pipe(res);

  archive.on('error', (err) => {
    console.error('Archiving error:', err);
    res.status(500).send('Error creating zip file.');
  });

  archive.finalize();
});

module.exports = router;
