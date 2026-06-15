import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    details: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }
);

const AuditLog = mongoose.model("auditlogs", auditLogSchema);

export default AuditLog;
