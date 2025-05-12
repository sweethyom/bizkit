import { HomePage } from '@/pages/home';
import { ComponentSettingPage, SettingPage, TeamSettingPage } from '@/pages/settings';
import { ROUTES_MAP } from '@/shared/config';
import { BrowserRouter, Route, Routes } from 'react-router';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES_MAP.main.path} element={<HomePage />} />
        <Route path={ROUTES_MAP.projectSettings.path} element={<SettingPage />} />
        <Route path={ROUTES_MAP.teamSettings.path} element={<TeamSettingPage />} />
        <Route path={ROUTES_MAP.componentSettings.path} element={<ComponentSettingPage />} />
      </Routes>
    </BrowserRouter>
  );
};
