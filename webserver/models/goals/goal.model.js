module.exports = mongoose => {
    const Goal = mongoose.model(
      "goal",
      mongoose.Schema(
        {
          userId: String,
          title: String,
          task: String,
          why: String,
          active: Boolean,
          dateCreated:Date,
          isLongTermGoal: Boolean,
          longerTermGoalId: String,
          dateCompleted: Date,
          desiredFrequency: Number,
          where: String,
          when: String,
          deadline: Date,
          parentGoalId: String,
          childGoalId: String,
          goodGoal: Boolean,
          wasSuccessful: Boolean,
          reflection: String,
          goalResponseIds: [String],
          relatedGoalIds: [String],
          childGoalIds: [String],
          goalTagIds: [String]
        },
        { timestamps: true }
      )
    );
    return Goal;
  };
