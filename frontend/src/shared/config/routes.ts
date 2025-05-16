export const ROUTES_MAP = {
  main: {
    path: '/',
    name: 'Main',
  },
  signin: {
    path: '/signin',
    name: 'SignIn',
  },
  signup: {
    path: '/signup',
    name: 'SignUp',
  },
  myWorks: {
    path: '/my-works',
    name: 'MyWorks',
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
    path: '/profile',
    name: 'Profile',
  },
};
