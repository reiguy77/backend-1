
const GoalResponseSchema =  {
  goalId: String,
  userId: String,
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
  notes: String,
  associatedFileIds: [String]
};


module.exports = mongoose => {
    const GoalResponse = mongoose.model(
      "goal-response",
      mongoose.Schema(
        GoalResponseSchema,
        { timestamps: true }
      )
    );
    return GoalResponse;
  };


