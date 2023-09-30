const db = require("../models");
// Configure multer to handle file uploads
const multer = require('multer');
const storage = multer.memoryStorage();
const validMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
const sanitizeFilename = require('sanitize-filename');


const UserImage = db.userImage;


// Create and Save a new User Image
exports.create = (req, res) => {
    const upload = multer({ storage: storage, limits: { fileSize: 5242880 }, fileFilter: (req, file, cb) => {
        if (validMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'), false);
        }
    }});
    upload.single('image')(req, res, (err) => {
        if (err) {
        res.status(400).json({ error: err.message });
        return;
        }
        console.log(req);
        // get the sanitized filename
        const sanitizedFilename = sanitizeFilename(req.file.originalname);

        // create a new user image with the uploaded file data
        const userImage = new UserImage({
        name: sanitizedFilename,
        data: req.file.buffer,
        contentType: req.file.mimetype,
        username: req.body.username
        });

        userImage.save()
        .then((image) => {
            res.status(201).json(image);
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
    });
}


exports.findImagesByUsername = (req, res) => {
    const username = req.params.username;
    UserImage.find({ username: username })
        .then((images) => {
        res.status(200).json(images);
        })
        .catch((err) => {
        res.status(500).json({ error: err.message });
        });
    };

    exports.findImagesByIds = (req, res) => {
        const imageIds = req.params.imageIds;
        UserImage.find({ id: { $in: imageIds } })
            .then((images) => {
            res.status(200).json(images);
            })
            .catch((err) => {
            res.status(500).json({ error: err.message });
            });
        };

    exports.findImagesById = (req, res) => {
        const imageId = req.params.imageIds;
        UserImage.find({ id: imageId })
            .then((images) => {
            res.status(200).json(images);
            })
            .catch((err) => {
            res.status(500).json({ error: err.message });
            });
        };

