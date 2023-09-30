
module.exports = mongoose => {
    const User = mongoose.model(
      "user",
      mongoose.Schema(
        {
            firstName: String,
            lastName: String,
            email: {type: String, required: true, index: { unique: true }},
            phoneNumber: String,
            birthDate: Date,
            address: String,
            //make sure to hash/salt password, keep secure
            passwordSalt: { type: String, required: true },
            passwordHash:  { type: String, required: true },
            apiKey: String,
            appId:Number,
            userGroupIds: [String],
            userId: String,
        },
        { timestamps: true }
      )
    );
    return User;
  };

