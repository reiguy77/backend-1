
const fs = require('fs');
fileHelper = {}
fileHelper.checkDirectoryExists = (directory) => {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, {recursive:true});
      }
}

module.exports = fileHelper;