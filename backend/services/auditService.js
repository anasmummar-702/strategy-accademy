/**
 * System Audit Logging Service
 * Records all admin mutations with before/after state diffs, IP, and user agent.
 */

export const recordAuditLog = async ({
  adminUserId,
  adminEmail,
  action,
  module,
  objectId = null,
  beforeState = null,
  afterState = null,
  req = null
}) => {
  const ipAddress = req ? (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1') : '127.0.0.1';
  const userAgent = req ? (req.headers['user-agent'] || 'Unknown') : 'System';

  const logEntry = {
    admin_user_id: adminUserId,
    admin_email: adminEmail,
    action,
    module,
    object_id: objectId,
    before_state: beforeState,
    after_state: afterState,
    ip_address: ipAddress,
    user_agent: userAgent,
    timestamp: new Date().toISOString()
  };

  console.log(`[AUDIT LOG] ${module.toUpperCase()} | ${action} by ${adminEmail || 'System'} (Object ID: ${objectId || 'N/A'})`);
  
  // Return formatted audit payload ready for DB insertion
  return logEntry;
};
