
module.exports = mongoose => {
    const UserImage = mongoose.model(
      "imageCategory",
      mongoose.Schema(
        {
            categoryName: String,
            user: String,
            subfolder: String,
            appId: Number
        },
        { timestamps: true }
      )
    );
    return UserImage;
  };

