const express = require("express");
let multer = require('multer');
const router = express.Router();
const fileController = require("../controllers/file.controller");
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
// const upload = multer();



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      console.log(req.body);
        let destination = path.join(__dirname,'../assets/');
        if (req.body.subfolder) {
          destination = path.join(destination, req.body.appId, req.body.user, req.body.subfolder);
          // Create subfolders if they don't exist
          checkDirectoryExists(destination);
        }
      cb(null, destination); // Set the upload directory here
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      const originalname = `${uuid.v4()}${ext}`;
      cb(null, originalname); 
    },
  });
  const fileSizeLimit = 100 * 1024 * 1024; // 100 MB

  const fileFilter = (req, file, done) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        done(null, true);
    } else {
      console.log('error with file type');
        done(new Error('file type not supported'), false);
    }
};

  const imageUpload = multer({ 
    storage: storage,
    limits: {
        fileSize: fileSizeLimit,
      },
    fileFilter
    });

    const upload = 
    multer({ 
      storage: storage,
      limits: {
          fileSize: fileSizeLimit,
        }, 
      });


router.post("/", upload.array('files'), fileController.addFiles);
router.post("/addImages", imageUpload.array('images'), fileController.addImages);
router.post("/getImages", fileController.getImages);
router.post("/clearImages", fileController.clearImages)
router.post("/fileNames/", fileController.retrieveFileNames);
router.post("/retrieveFile/", fileController.retrieveFile);
router.post("/clearImageCategories", fileController.clearImageCategories)
router.post("/retrieveCategoryNames", fileController.retrieveCategoryNames);
router.post("/clearSubfolder", fileController.clearSubfolder);
module.exports = router;

function checkDirectoryExists(directory){
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, {recursive:true});
      }
}