export const ROUTES_MAP = {
  main: {
    path: '/',
    name: 'Main',
  },
  projectSettings: {
    path: '/projects/:projectId/settings',
    name: 'ProjectSettings',
  },
  teamSettings: {
    path: '/projects/:projectId/team',
    name: 'TeamSettings',
  },
  componentSettings: {
    path: '/projects/:projectId/components',
    name: 'ComponentSettings',
  },
  sprint: {
    path: '/projects/:projectId/sprint',
    name: 'Sprint',
  },
  profile: {
    path: '/profile/:userId',
    name: 'Profile',
  },
};
