import { HomePage } from '@/pages/home';
import { SprintPage } from '@/pages/sprint';
import { ComponentSettingPage, SettingPage, TeamSettingPage } from '@/pages/settings';
import { ROUTES_MAP } from '@/shared/config';
import { BrowserRouter, Route, Routes } from 'react-router';
import { ProfilePage } from '@/pages/profile';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES_MAP.main.path} element={<HomePage />} />
        <Route path={ROUTES_MAP.projectSettings.path} element={<SettingPage />} />
        <Route path={ROUTES_MAP.teamSettings.path} element={<TeamSettingPage />} />
        <Route path={ROUTES_MAP.componentSettings.path} element={<ComponentSettingPage />} />
        <Route path={ROUTES_MAP.sprint.path} element={<SprintPage />} />
        <Route path={ROUTES_MAP.profile.path} element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
};
