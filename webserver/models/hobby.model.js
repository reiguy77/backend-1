module.exports = mongoose => {
    const Hobby = mongoose.model(
      "hobby",
      mongoose.Schema(
        {
          title: String,
          description: String,
          startDate: Date,
          influences: [String],
          tags: [String],
        },
        { timestamps: true }
      )
    );
    return Hobby;
  };