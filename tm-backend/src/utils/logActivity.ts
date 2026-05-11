import ActivityLog from "../models/activityLog.model";

// Interface for activity log data
interface LogData {
  action: string;
  userId: string;
  taskId?: string;
  details?: any;
}

// Function to log activity
const logActivity = async (data: LogData) => {
  await ActivityLog.create(data);
};

// Export the logActivity function
export default logActivity;
