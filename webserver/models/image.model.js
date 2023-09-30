
module.exports = mongoose => {
    const UserImage = mongoose.model(
      "image",
      mongoose.Schema(
        {
            id: Number,
            name: String,
            description: String,
            cssConfiguration: Object,
            user: String,
            category: String,
            tags: [String],
            fileId: String,
            categoryId: String,
            appId:Number
        },
        { timestamps: true }
      )
    );
    return UserImage;
  };

