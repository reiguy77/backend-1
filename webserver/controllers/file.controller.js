const db = require("../models");
const uuid =  require('uuid');
const path = require('path');
const fs = require('fs/promises');
const File = db.file;
const Image = db.image;
const ImageCategory = db.imageCategory;
const fileHelper = require("../lib/fileHelper")
 

const baseDirectory = path.join(__dirname,'../assets/');

exports.clearSubfolder = (req, res) =>{
    const {subfolder, user} = req.body;
    File.deleteMany({subfolder:subfolder, user:user}).then(data=>{
        res.send(data);
        })
        .catch(err => {
        res.status(500).send({
            message: "Some error occurred while deleting the files",
            error: err.message
        });
        }); 
}

exports.getImages = (req, res) => {
  console.log(req.body);  
  const {user, appId, categoryName} = req.body;
  if(!user || !appId || !categoryName){
    res.send({
      error:true,
      message: 'Improper arguments for getImages' 
    })
  }
  ImageCategory.findOne({categoryName, user}).then((category)=>{
    console.log(category)
    if(!category){
      res.send({
        error:true,
        message: 'No image category exists with this name'
      })
    }
    Image.find({user:user, appId: appId, categoryId:category._id}).then((data)=>{
      let ids = data.map(image => {
        return image.fileId;
      })
      File.find({_id:{$in: ids}}).then((data)=>{
        let fileUrls = data.map((item)=>{
          return `${appId}/${user}/${item.subfolder}/${item.systemFileName}`;
        })
        res.send({data:fileUrls})
        })
        .catch(err => {
          res.status(500).send({
            error: true,
            message:
              err.message || "Some error occurred while fetching the image urls"
          });
        });
    });   
  })
 
}  


exports.clearImages = (req, res) => {
    const {user} = req.body;
    Image.deleteMany({user:user}).then(data=>{
        res.send(data);
        })
        .catch(err => {
        res.status(500).send({
            message: "Some error occurred while deleting the files",
            error: err.message
        });
    });
} 

exports.addFiles = (req,res) => {
    const {user, subfolder, appId} = req.body;
    const files = req.files;     
    const fileObjects = files.map((newFile)=>{
        let id = uuid.v4();
        return {
            subfolder:subfolder,
            fileName: newFile.originalname,
            user: user,
            systemFileName: newFile.filename,
            id,
            appId
        }
    });
    File.insertMany(fileObjects).then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message: "Some error occurred while creating the new Files",
          error: err.message
        });
      });
}



exports.addImages = async (req, res) => {
  const { user, subfolder, appId} = req.body; 
  const imageFiles = req.files;
  let categoryId = await addOrUpdateImageCategory(subfolder, subfolder, user, appId);

  try {
    const imagePromises = imageFiles.map(async (file) => {
      let imageProperties = {};
      const directory = `${baseDirectory}/${user}/${subfolder}`
      fileHelper.checkDirectoryExists(directory);
      // Save file details in the files collection
      const fileData = {
        subfolder: subfolder,
        fileName: file.originalname,
        user: user,
        systemFileName: file.filename
      };

      const savedFile = await File.create(fileData);
      // Save the image properties linked to the file
      const image = {
        fileId: savedFile._id,
        categoryId,
        user,
        appId,
        ...imageProperties
      };

      await Image.create(image);
    });

    await Promise.all(imagePromises);

    res.status(200).json({ message: 'Images and files saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving images and files' });
  }
};


exports.retrieveCategoryNames = (req, res) => {
    const {user} = req.body;
    ImageCategory.find({user:user})
    .then(data => {
      console.log(data);
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving file names."
      });
    });
}



exports.retrieveFileNames = (req, res) => {
    const {subfolder, user} = req.body;
    let condition =  subfolder
    ? { subfolder: { $regex: new RegExp(subfolder), $options: "i" }, user: { $exists: true, $in: [user] }}
    : { user: { $exists: true, $eq: user } };
    File.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving file names."
      });
    });
}

exports.retrieveFile = (req, res) => {
   const {id} = req.body;
    File.find({id:id})
    .then(data => {
        if (!data || data.length == 0) {
            res.status(404).send({
            message: `Cannot find File with id=${id}.`
            });
        }
        else{
            let file = data[0];
            let filePath = path.join(__dirname, '../assets/', file.subfolder, file.systemFileName);
            res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
            res.setHeader('Content-Disposition', `attachment; filename="${file.fileName}"`);
            res.status(200).sendFile(filePath);
        }
      })
    .catch(err => {
        console.log(err.message);
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving goals."
      });
    });
}


exports.retrieveFiles = (req, res) => {
  const { ids, user } = req.body;
  sendFiles(req, res, ids, user);
};

function sendFiles(req, res, ids, user, appId) {
  File.find({ _id: { $in: ids } })
  .then(files => {
      if (!files || files.length === 0) {
          res.status(404).send({
              message: `Cannot find Files with the provided IDs.`
          });
      } else {
          const filePromises = files.map(file => {
              return new Promise((resolve, reject) => {
                  const filePath = path.join(__dirname, `../assets/${appId}/${user}/`, file.subfolder, file.systemFileName);
                  res.attachment(file.fileName);
                  res.sendFile(filePath, (err) => {
                      if (err) {
                          reject(err);
                      } else {
                          resolve();
                      }
                  });
              });
          });

          Promise.all(filePromises)
              .then(() => {
                  res.status(200).end();
              })
              .catch(err => {
                  console.log(err.message);
                  res.status(500).send({
                      message: "An error occurred while sending files."
                  });
              });
      }
  })
  .catch(err => {
      console.log(err.message);
      res.status(500).send({
          message: "An error occurred while retrieving files."
      });
  });
}


exports.clearImageCategories = (req,res) => {
    const {user} = req.body;
    ImageCategory.deleteMany({user:user}).then(data=>{
        res.send(data);
        })
        .catch(err => {
        res.status(500).send({
            message: "Some error occurred while deleting the files",
            error: err.message
        });
        });
}
async function addOrUpdateImageCategory(categoryName, subfolder,  user, appId){
    const query = { categoryName: categoryName, user:user, appId}; // Define the query to find the item
    const update = { categoryName: categoryName, user:user, subfolder:subfolder, appId }; // Data for the new or existing item
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };

// Find the item and update it if found, or create it if not found
    const result = await ImageCategory.findOneAndUpdate(query, update, options)
    return result._id;
}
// What do I want to do right now?

/**
 * I want to be able to save all the images I have into the database, 
 * all with an empty imageDescription. Maybe just save that as a json so that it's flexible
 * 
 */