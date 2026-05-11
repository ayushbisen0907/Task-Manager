import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import ActivityLog from "../models/activityLog.model";
import prisma from "../config/prisma";

// Handles GET /activity-logs: returns a paginated list of activity logs (admins see all; users see only their own).
export const getActivityLogsController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = req.user.role === "admin" ? {} : { userId: req.user.userId };

    const [logs, total] = await Promise.all([
      ActivityLog.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ActivityLog.countDocuments(filter),
    ]);

    const userIds = Array.from(new Set(logs.map((l) => l.userId)));
    const users = userIds.length
      ? await prisma.user.findMany({
          where: { id: { in: userIds } },
          select: { id: true, name: true, email: true },
        })
      : [];
    const userMap = new Map(users.map((u) => [u.id, u]));

    const enriched = logs.map((l) => ({
      id: String(l._id),
      action: l.action,
      userId: l.userId,
      user: userMap.get(l.userId) ?? null,
      taskId: l.taskId ?? null,
      details: l.details ?? null,
      createdAt: l.createdAt,
    }));

    res.json({
      logs: enriched,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
