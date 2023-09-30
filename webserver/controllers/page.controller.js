const db = require("../models");
const Page = db.page;


// Create and Save a new Page
function create(pageName, pageJson, appId, res) {
      // Create a Page
      const page = new Page({
        pageName,
        pageJson,
        appId
      });

      // Save Page in the database
      page
        .save(page)
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the Page."
          });
        });
};

// Retrieve all Pages from the database.
exports.get = (req, res) => {
    const {pageName, appId} = req.params;
    let condition = {pageName:pageName, appId:appId};
    Page.findOne(condition)
    .then(data => {
      res.send({
        error:false,
        page:data
        });
    })
    .catch(err => {
      res.status(500).send({
        error: true,
        message: err.message || "Some error occurred while retrieving pages."
      });
    });
};





// Update a Page by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
          message: "Data to update can not be empty!"
        });
      }

      const {pageName, appId, pageJson} = req.body;
      Page.findOne({pageName: pageName, appId: appId})
        .then(data => {
            if (!data) {
                create(pageName, pageJson, appId, res)
              } else {
                Page.findByIdAndUpdate(data._id, req.body, { useFindAndModify: false })
                    .then(data => {
                    if (!data) {
                        res.status(404).send({
                        message: `Cannot update Page with id=${id}. Maybe Page was not found!`
                        });
                    } else {
                        res.send({ message: "Page was updated successfully." });
                    }
                })
              }
        })     
        .catch(err => {
          console.log(err);
          res.status(500).send({
            message: "Error updating Page with name="+pageName+" and appId="+appId
          });
        });
  
};

exports.delete = (req, res) => {
    const id = req.params.id;
    Page.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Page with id=${id}. Maybe Page was not found!`
        });
      } else {
        res.send({
          message: "Page was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Page with id=" + id
      });
    });
}

exports.deleteAll = (req, res) => {
    Page.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Pages were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all pages."
      });
    });
}
