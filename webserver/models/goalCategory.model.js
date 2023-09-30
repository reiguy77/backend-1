
module.exports = mongoose => {
    const GoalCategory = mongoose.model(
      "goal-category",
      mongoose.Schema(
        {
            title: String,
            userId: String,
            color: String,
            tags: [String]
        },
        { timestamps: true }
      )
    );
    return GoalCategory;
  };

