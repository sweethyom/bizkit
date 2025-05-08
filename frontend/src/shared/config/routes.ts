export const ROUTES_MAP = {
  main: {
    path: '/',
    name: 'Main',
  },
  signin: {
    path: '/signin',
    name: 'SignIn',
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
};
