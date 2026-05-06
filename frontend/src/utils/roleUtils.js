export const canManageProject = (user) => user?.role === 'Admin';
export const canAssignTask = (user) => user?.role === 'Admin';