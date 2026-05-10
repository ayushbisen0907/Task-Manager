import ActivityLog from "../models/activityLog.model";

interface LogData {
  action: string;
  userId: string;
  taskId?: string;
  details?: any;
}

const logActivity = async (
  data: LogData
) => {
  await ActivityLog.create(data);
};

export default logActivity;