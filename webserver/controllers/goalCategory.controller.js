const db = require("../models");
const GoalCategory = db.goalCategory;

exports.createCategory = async (req, res) => {
  console.log(req.body);
    const existingDocument = await GoalCategory.findOne({ title:req.body.title });

    if (existingDocument) {
        res.status(400).send({ message: "Item already exists", statusCode: 400 });
        return;
    }
      if (!req.body.title) {
        //   res.status(400).send({ message: "Content can not be empty!" });
          res.status(400).send({ message: "Can't add empty title", statusCode: 400 });
          return;
        }
        // Create a Goal
        const goalCategory = new GoalCategory(req.body);
        console.log(goalCategory);
        // Save Goal in the database
        goalCategory
          .save(goalCategory)
          .then(data => {
            res.send(data);
          })
          .catch(err => {
            console.log('WHAT', err);
            res.status(500).send({
              message:
                err.message || "Some error occurred while creating the Goal Category."
            });
          });
    };
  
  
  exports.getAllCategories = async (req, res) => {
    
      GoalCategory.find({})
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        console.log(err);
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving goals."
        });
      });
  }
  
  
  exports.deleteCategory = (req, res) => {
    const id = req.params.id;
      GoalCategory.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete GoalCategory with id=${id}. Maybe GoalCategory was not found!`
          });
        } else {
          res.send({
            message: "Goal was deleted successfully!"
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Goal with id=" + id
        });
      });
  }
  
  // Update a Goal Category by the id in the request
  exports.updateCategory = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
          message: "Data to update can not be empty!"
        });
      }
    
      const id = req.params.id;
    
      GoalCategory.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
          if (!data) {
            res.status(404).send({
              message: `Cannot update Goal with id=${id}. Maybe Goal was not found!`
            });
          } else res.send({ message: "Goal was updated successfully." });
        })
        .catch(err => {
          res.status(500).send({
            message: "Error updating Goal with id=" + id
          });
        });
  
  };