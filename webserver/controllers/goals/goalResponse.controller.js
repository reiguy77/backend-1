const db = require("../../models");
const GoalResponse = db.goalResponse;


// Create and Save a new goalResponse
exports.create = async (req, res) => {
  try {
      const {goalId, userId } = req.body;
      // Validate request body
      if (!goalId || !userId) {
          return res.status(400).json({
            errors: true,
            message: "Related ids are required." });
      }
      
      // Create a new goalResponse instance
      const goalResponse = new GoalResponse(req.body);

      // Save the goalResponse to the database
      const savedResponse = await goalResponse.save();
      console.log(savedResponse);
      // Return the saved response
      res.status(201).json({
        errors: false,
        data:savedResponse
      });
  } catch (error) {
      console.error("Error creating goal response:", error);
      res.status(500).json({ message: "An error occurred while creating the goal response." });
  }
};

// Retrieve all goalResponses from the database.
exports.findAll = (req, res) => {
    GoalResponse.find({})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving goalResponses."
      });
    });
}; 

exports.findByGoalId = (req, res) => { 
  const goalId = req.params.goalId;
  var condition = goalId ? { goalId: { $regex: new RegExp(goalId), $options: "i" } } : {};
  GoalResponse.find(condition)
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving goalResponses."
    });
  });
};

// Find a single goalResponse with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    GoalResponse.findById(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot find goalResponse with id=${id}.`
        });
      } else {
        res.send({
          message: data
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not find goalResponse with id=" + id
      });
    });
  
};

// Update a goalResponse by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
          message: "Data to update can not be empty!"
        });
      }
    
      const id = req.params.id;
    
      GoalResponse.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
          if (!data) {
            res.status(404).send({
              message: `Cannot update goalResponse with id=${id}. Maybe goalResponse was not found!`
            });
          } else res.send({ message: "goalResponse was updated successfully." });
        })
        .catch(err => {
          res.status(500).send({
            message: "Error updating goalResponse with id=" + id
          });
        });
  
};

exports.delete = (req, res) => {
    const id = req.params.id;
    GoalResponse.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete goalResponse with id=${id}. Maybe goalResponse was not found!`
        });
      } else {
        res.send({
          message: "goalResponse was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete goalResponse with id=" + id
      });
    });
}

exports.deleteAll = (req, res) => {
    GoalResponse.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} goalResponses were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all goalResponses."
      });
    });
}