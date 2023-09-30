
module.exports = mongoose => {
    const UserImage = mongoose.model(
      "user-image",
      mongoose.Schema(
        {
            id: Number,
            name: String,
            data: Buffer,
            contentType: String,
            username: String

        },
        { timestamps: true }
      )
    );
    return UserImage;
  };

