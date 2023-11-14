
const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./models');
const path = require('path');
const userController = require('./controllers/user.controller');
const leetCodeRoutes = require("./routes/leetCodeRoutes");
const emailRoutes = require("./routes/emailRoutes");
const fileRoutes = require("./routes/fileRoutes");
const goalRoutes = require("./routes/goalRoutes");
const goalCategoryRoutes = require("./routes/goalCategoryRoutes");
const goalResponseRoutes = require('./routes/goalResponseRoutes');
const userRoutes = require('./routes/userRoutes');
const tokenRoutes = require('./routes/tokenRoutes');
const pageRoutes = require('./routes/pageRoutes');

// const allRoutes = require('./routes');
var multer = require('multer'); 

// Create new instance of the express server 
var app = express();

app.use(express.static(path.join(__dirname, 'assets')));



  const envFilePath = path.resolve(__dirname, '.env');

// Load environment variables from the specified file
dotenv.config({ path: envFilePath });

var corsOptions = { 
  origin: 'http://localhost:4201',  
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

if(process.env.ENVIRONMENT == 'Development'){
  app.use(cors(corsOptions));
}
// Define the way 
// to consume and produce data through the 
// exposed APIs
app.use(bodyParser.json({limit:'900mb'})); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// General error handler middleware
app.use(function(err, req, res, next) {
  if(err){
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size limit exceeded.' });
      }
      // Handle other multer errors if needed
    }
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
    
  
});

// userController.addFirstUser();

// Create link to Angular build directory
// The `ng build` command will save the result
// under the `dist` folder.
var distDir = __dirname + "/dist/";
// app.use(express.static(distDir));
let port = 3000;
var server = app.listen( port, function () {
    console.log("App now running on port", port);
});


process.on('SIGINT', async () => {
    await db.closeConnection();
    process.exit(0);
});



/*  "/api/status" 
 *   GET: Get server status
 *   PS: it's just an example, not mandatory
 */
app.get("/api/status", function (req, res) {
    res.status(200).json({ status: "UP" });
});

hobby = require("./controllers/hobby.controller.js");
app.post("/api/hobby/", hobby.create);
app.get("/api/hobby/", hobby.findAll);
app.get("/api/hobby/:id", hobby.findOne);
app.delete("/api/hobby/:id", hobby.delete);
app.delete("/api/hobby/", hobby.deleteAll);
app.put("/api/hobby/:id", hobby.update);



// Errors handler.
function manageError(res, reason, message, code) {
    console.log("Error: " + reason);
    res.status(code || 500).json({ "error": message });
}



// Define API endpoint for image uploads
upload = require("./controllers/userImage.controller.js");
app.post('/api/imageUpload', upload.create);
app.get('/api/imageUpload/:username', upload.findImagesByUsername);
app.post('/api/imageUpload/findImagesByIds', upload.findImagesByIds);


app.use("/api/leetCode", leetCodeRoutes);


app.use("/api/email", emailRoutes);
app.use("/api/file", fileRoutes);
app.use("/api/goal", goalRoutes);
app.use("/api/goalResponse", goalResponseRoutes);
app.use("/api/goalCategory", goalCategoryRoutes);
app.use("/api/user", userRoutes)
app.use("/api/token", tokenRoutes);
app.use('/api/page', pageRoutes);
// app.use("/api", allRoutes);
