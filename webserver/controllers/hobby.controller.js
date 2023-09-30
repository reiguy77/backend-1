const db = require("../models");
const Hobby = db.hobby;


// Create and Save a new Hobby
exports.create = (req, res) => {
    if (!req.body.title) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
      }
      // Create a Hobby
      const hobby = new Hobby({
        title: req.body.title,
        description: req.body.description,
        startDate: Date.now(), 
        influences: req.body.influences
      });
    
      // Save Hobby in the database
      hobby
        .save(hobby)
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the Hobby."
          });
        });
};

// Retrieve all Hobbies from the database.
exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};
    Hobby.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving hobbies."
      });
    });
};

// Find a single Hobby with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Hobby.findById(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot find Hobby with id=${id}.`
        });
      } else {
        res.send({
          message: data
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not find Hobby with id=" + id
      });
    });
  
};

// Update a Hobby by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
          message: "Data to update can not be empty!"
        });
      }
    
      const id = req.params.id;
    
      Hobby.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
          if (!data) {
            res.status(404).send({
              message: `Cannot update Hobby with id=${id}. Maybe Hobby was not found!`
            });
          } else res.send({ message: "Hobby was updated successfully." });
        })
        .catch(err => {
          res.status(500).send({
            message: "Error updating Hobby with id=" + id
          });
        });
  
};

exports.delete = (req, res) => {
    const id = req.params.id;
    Hobby.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Hobby with id=${id}. Maybe Hobby was not found!`
        });
      } else {
        res.send({
          message: "Hobby was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Hobby with id=" + id
      });
    });
}

exports.deleteAll = (req, res) => {
    Hobby.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Hobbies were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all hobbys."
      });
    });
}