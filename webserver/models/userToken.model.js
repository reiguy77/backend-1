module.exports = mongoose => {
    const UserToken = mongoose.model(
      "user-token",
      mongoose.Schema(
        {
            userId: { type: String, required: true },
            token: { type: String, required: true },
            createdAt: { type: Date, default: Date.now, expires: 30 * 86400 }, // 30 days

        },
        { timestamps: true }
      )
    );
    return UserToken;
  };