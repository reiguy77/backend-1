const db = require("../../models");
const Goal = db.goal;
const GoalResponse = db.goalResponse;
const User = db.User;
const GoalCategory = db.GoalCategory;
const util = require("../util");
var ObjectId = require('mongoose').Types.ObjectId;

// Create and Save a new Goal
exports.create = (req, res) => {
  const { title, userId, test } = req.body;
  if (!title || !userId) {
    util.MissingParameters(res, "Create goal", {title, userId});
    return;
  }
  console.log(req.body);
  const goal = new Goal(req.body);
  goal.save(goal)
    .then(data => {
      res.status(201).send({
        errors:false,
        data
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || `Some error occurred while creating the Goal "${title}"`
      });
    });
};

// Retrieve all Goals from the database.
exports.findAll = (req, res) => {
  const userId = req.params.id;
  if(!userId){
    util.MissingParameters(res, "Find all goals", {userId});
    return;
  }
  Goal.find({userId: userId})
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving goals."
    });
  });
};



// Update a Goal by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
          message: "Data to update can not be empty!"
        });
      }
    
      const id = req.params.id;
      Goal.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
          if (!data) {
            res.status(404).send({
              message: `Cannot update Goal with id=${id}. Maybe Goal was not found!`
            });
          } else res.send({ message: "Goal was updated successfully." });
        })
        .catch(err => {
          console.log(err);
          res.status(500).send({
            message: "Error updating Goal with id=" + id
          });
        });
  
};

exports.delete = (req, res) => {
    const id = req.params.id;
    if(!ObjectId.isValid(id)){
      res.status(400).send({message:"Id is not a valid ObjectID", errors:true});
      return;
    }
    if(!id){
      util.MissingParameters(res, "Delete goals", {id});
      return;
    }
    GoalResponse.deleteMany({goalId: id}).then(
      Goal.findByIdAndRemove(id)
        .then(data => {
          if (!data) {
            res.status(404).send({
              message: `Cannot delete Goal with id=${id}. Maybe Goal was not found!`
            });
          } else {
            res.send({
              message: "Goal was deleted successfully!"
            });
          }
        })
    )
    .catch(err => {
      res.status(400).send({
        message: "Could not delete Goal Responses with id=" + id
      });
    });
}

exports.deleteAll = (req, res) => {
    Goal.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Goals were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all goals."
      });
    });
}
