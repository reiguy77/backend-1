const db = require("../models");
const User = db.user;
const fs = require('fs');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');
const generateTokens  = require("../utils/generateTokens.js");
const emailController = require("./email.controller");
// Generate a salt and hash the password
function saltAndHashPassword(password){
  return new Promise((resolve, reject) => {
    const saltWorkFactor = parseInt(process.env.SALT_WORK_FACTOR, 10);
    bcrypt.genSalt(saltWorkFactor, (err, salt) => {
      if (err) {
        console.error(err);
        return reject(err); 
      }

      bcrypt.hash(password, salt, (err, hash) => { 
        if (err) {
          console.error(err);
          return reject(err);
        }
        resolve({ passwordSalt:salt, passwordHash:hash }); // Return salt and hash as an object
      });
    });
  });
}

exports.addFirstUser = () => {
  let email = process.env.ADMIN_EMAIL;
  let password = process.env.ADMIN_PASSWORD;
  let appId = process.env.APP_ID;
  User.findOne({email:email, appId:appId}).then(async (result)=>{
    if(!result){
      let user = await createUser(email, password, appId);
      user
        .save(user)
        .then(data => {
          console.log('email sent to admin!');
          sendEmailToAdmin();
        })
        .catch(err => {
          console.log(err);
        });
    }
    else{
      console.log('Admin user exists...');
    }
  })
}

function sendEmailToAdmin(){
  let to =  process.env.ADMIN_EMAIL;
  let subject = 'Newly created account';
  let text = `Please go to ${process.env.SITE_ADDRESS}/login to
    login to your new account. Your credentials are:\n\n
    email:${process.env.ADMIN_EMAIL}\n
    password:${process.env.ADMIN_PASSWORD}.
    \n\n
    Please contact Reilly McLaren with any questions.\n`;
    emailController.sendEmail(to, subject, text);
}

function checkPassword(passwordToCheck, salt, storedHashedPassword){
  return new Promise((resolve, reject) => {
      bcrypt.hash(passwordToCheck, salt, function(err, hashedPassword) {
      if (err) {
        return reject(err);
      }
      // Compare the generated hash with the stored hashed password
      if (hashedPassword === storedHashedPassword) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}


// Create and Save a new User
exports.create = async (req, res) => {
  console.log(req.body);
    if (!req.body.email || !req.body.password) {
        res.status(400).send({ message: "Email or Password cannot be empty!" });
        return;
      }
      if (!req.body.appId) {
        res.status(400).send({ message: "App Id cannot be empty!" });
        return;
      }
      const {email, password, appId} = req.body;

      let existingUser = await User.findOne({email:email, appId:appId});
      if(existingUser){
        res.status(400).send({
          message: "This account already exists!",
          errors: true });
        return;
      }

      // Create a User
      let user = await createUser(email, password, appId);
      
      // Save User in the database
      user
        .save(user)
        .then(data => {
          res.send({
            message: "User created successfully!",
            errors: false
          });
        })
        .catch(err => {
          console.log(err);
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the User."
          });
        });
};

async function createUser(email, password, appId){
  const { passwordSalt, passwordHash } = await saltAndHashPassword(password);
  const user = new User({email, password, appId});
  user.passwordHash = passwordHash;
  user.passwordSalt = passwordSalt;
  return user;
}


// Find a single User with an id
exports.find = (req, res) => {
    const appId = req.body.appId;
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email:email, appId:appId})
    .then((user) => {
      if (!user) {
        res.status(404).json({
          errors: true,
          message: "Login failed.",
      });
      } else {
         // Extract the salt and hash
      let salt = user.passwordSalt;
      let hash = user.passwordHash;


      // Check if the password matches
      checkPassword(password, salt, hash).then(async (passwordMatch)=>{
        if(passwordMatch){
          const payload = {
            sub: email, // Subject (user identifier)
            iat: Math.floor(Date.now() / 1000), // Issued at time (in seconds)
            exp: Math.floor(Date.now() / 1000) + 3600, // Expiration time (1 hour from now)
          };

          const { accessToken, refreshToken } = await generateTokens(user);

        res.status(200).json({
            errors: false,
            accessToken,
            refreshToken,
            userId: user._id,
            message: "Logged in sucessfully",
        });

          const jwtToken = jwt.sign(payload, process.env.ACCESS_TOKEN_PRIVATE_KEY);
          // res.send({
          //   token: jwtToken
          // })
        }
        else{
          res.status(400).json({
            error: true,
            message: "Login Failed",
        });
        }
      });
    }})
    .catch(err => {
      res.status(500).send({
        message: "Could not find User with email:" + email
      });
    });

        
  
};

// Update a User by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
          message: "Data to update can not be empty!"
        });
      }
    
      const id = req.params.id;
    
      User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
          if (!data) {
            res.status(404).send({
              message: `Cannot update User with id=${id}. Maybe User was not found!`
            });
          } else res.send({ message: "User was updated successfully." });
        })
        .catch(err => {
          res.status(500).send({
            message: "Error updating User with id=" + id
          });
        });
  
};