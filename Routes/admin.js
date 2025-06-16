const express = require("express");
const multer = require("multer");
const path = require("path");
const { Z_ASCII } = require("zlib");
const router = express.Router();
const fs = require('fs').promises;
const { saveVariable } = require('./utils');


const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public_html/downy');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const fileStorageEngine_forLicense = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public_html/downy');
    },
    filename: (req, file, cb) => {
        cb(null, 'LICENSE_AGREEMENT.txt');
    }
});

const upload = multer({storage: fileStorageEngine});

const licenseUpload = multer({storage: fileStorageEngine_forLicense});

async function clearDirectory(dirPath, dontdelete) {
  try {
    const files = await fs.readdir(dirPath);

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stat = await fs.lstat(filePath);

      if (stat.isFile() && file !== dontdelete && file !== 'LICENSE_AGREEMENT.txt') {
        await fs.unlink(filePath);
      } 
    }

    console.log(`Cleared all contents from: ${dirPath}`);
  } catch (err) {
    console.error(`Error clearing directory: ${err}`);
  }
}

// upload file route - - - - -
router.post('/upload/audio', upload.single('audio'), async (req, res) => {
  try{
    await clearDirectory('./public_html/downy', req.file.filename);
    saveVariable('current_audio', req.file.filename);
    res.send("upload successful");
  }
  catch(err){
    res.status(500).send('Failed to clear directory: ' + err.message);
  }
})

router.post('/upload/license', licenseUpload.single('license'), (req, res) => {
  try{
    res.send("upload successful");
  }
  catch(err){
    res.status(500).send('Failed to clear directory: ' + err.message);
  }
})


router.get('/admin', (req, res) => {
  if (req.session.authenticated) {
    // Already logged in? Redirect to protected page
    return res.redirect('/secret/admin-tools');
  }
  // Not logged in? Show login form
  res.sendFile(path.join(__dirname, '..', 'public_html', 'admin.html'));
});

router.post('/admin', (req, res) => {
  const { password } = req.body;
  if (password === 'poop') {
    req.session.authenticated = true;
    // Login success, redirect to protected page
    return res.redirect('/secret/admin-tools');
  } else {
    // Login failed — maybe send back an error or redirect to login with a message
    res.status(403).send('Access Denied: Invalid password.');
  }
});

router.get('/admin-tools', (req, res) => {
  if (!req.session.authenticated) {
    // Not logged in? Redirect back to login
    return res.redirect('/secret/admin');
  }
  res.sendFile(path.join(__dirname, '..', 'private_html', 'admin-tools.html'));
});

// Serve the CSS file manually
router.get('/admin-tools.css', (req, res) => {
  return res.sendFile(path.join(__dirname, '..', 'private_html', 'admin-tools.css'));
});



module.exports = router;