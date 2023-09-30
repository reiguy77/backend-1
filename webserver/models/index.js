const db = require("./db.js");

db.hobby = require("./hobby.model.js")(db.mongoose);
db.goal = require("./goal.model.js")(db.mongoose);
db.goalResponse = require("./goalResponse.model.js")(db.mongoose);
db.goalCategory = require("./goalCategory.model.js")(db.mongoose);
db.userImage = require('./userImage.model.js')(db.mongoose);
db.file = require('./file.js')(db.mongoose);
db.image = require('./image.model.js')(db.mongoose);
db.imageCategory = require('./imageCategory.model.js')(db.mongoose);
db.user = require('./user.model.js')(db.mongoose);
db.page = require('./page.model.js')(db.mongoose);
db.userToken = require('./userToken.model.js')(db.mongoose);
module.exports = db;