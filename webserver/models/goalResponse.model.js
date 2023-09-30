
module.exports = mongoose => {
    const GoalResponse = mongoose.model(
      "goal-response",
      mongoose.Schema(
        {
            goalId: String,
            timeComplete: Date,
            timeStart: Date,
            //duration can be time spent. 
            //But what if I want to measure how many of something I did? For now stick with time
            duration: Number,
            unit: String,
            focus: Number,
            mood: Number,
            madeTaskEasyText: String,
            madeTaskHardText: String,
            accomplishmentText: String,
            associatedFileIds: [String],
        },
        { timestamps: true }
      )
    );
    return GoalResponse;
  };

