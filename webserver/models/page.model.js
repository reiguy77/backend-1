
module.exports = mongoose => {
    const User = mongoose.model(
      "page",
      mongoose.Schema(
        {
            pageName:String,
            pageJson:Object,
            appId: Number
        },
        { timestamps: true }
      )
    );
    return User;
  };
