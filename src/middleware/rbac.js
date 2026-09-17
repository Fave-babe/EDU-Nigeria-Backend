const { can } = require('../lib/permissions');

// Usage: router.post('/', requirePermission('student', 'create'), controller.create)
function requirePermission(resource, action) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!can(req.user.role, resource, action)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

module.exports = { requirePermission };