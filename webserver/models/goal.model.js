module.exports = mongoose => {
    const Goal = mongoose.model(
      "goal",
      mongoose.Schema(
        {
          title: String,
          task: String,
          why: String, 
          active: Boolean,
          goodGoal: Boolean,
          dateCreated:Date,
          //if it will have children goals - 
          //i.e. something longer than 3 weeks
          isLongTermGoal: Boolean,
          goalCategoryId: String,
          longerTermGoalId: String,
          dateCompleted: Date,
          //these are specific to short term goals
          desiredFrequency: Number,
          where: String,
          when: String,
          deadline: Date,
          parentGoalId: String,
          childGoalId: String
        },
        { timestamps: true }
      )
    );
    return Goal;
  };