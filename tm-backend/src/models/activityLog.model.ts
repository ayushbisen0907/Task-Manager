import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
    },

    userId: {
      type: String,
      required: true,
    },

    taskId: {
      type: String,
    },

    details: {
      type: Object,
    },
  },
  {
    timestamps: true,
  },
);

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);

export default ActivityLog;
