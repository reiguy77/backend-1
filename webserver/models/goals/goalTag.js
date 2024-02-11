module.exports = mongoose => {
    const GoalTag = mongoose.model(
      "goal-tag",
      mongoose.Schema(
        {
          title: String,
        },
        { timestamps: true }
      )
    );
    return GoalTag;
  };
