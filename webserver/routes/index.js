
const router = express.Router();

// router.


router.leetCodeRoutes = require("./routes/leetCodeRoutes");
router.emailRoutes = require("./routes/emailRoutes");
router.fileRoutes = require("./routes/fileRoutes");
router.goalRoutes = require("./routes/goalRoutes");
router.goalResponseRoutes = require('./routes/goalResponseRoutes');
router.userRoutes = require('./routes/userRoutes');

module.exports = router;