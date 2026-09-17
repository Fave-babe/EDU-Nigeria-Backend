// Central permissions matrix: resource -> action -> allowed roles
const PERMISSIONS = {
  student: {
    create: ['owner', 'admin'],
    read:   ['owner', 'admin', 'teacher', 'bursar', 'parent', 'counsellor'],
    update: ['owner', 'admin'],
    delete: ['owner', 'admin'],
  },
  classroom: {
    create: ['owner', 'admin'],
    read:   ['owner', 'admin', 'teacher'],
    update: ['owner', 'admin'],
    delete: ['owner', 'admin'],
  },
  
};

/**
 * @param {string} role 
 * @param {string} resource 
 * @param {string} action 
 * @returns {boolean}
 */
function can(role, resource, action) {
  const allowedRoles = PERMISSIONS[resource]?.[action];
  if (!allowedRoles) return false; 
  return allowedRoles.includes(role);
}

module.exports = { can, PERMISSIONS };