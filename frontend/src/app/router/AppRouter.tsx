import { BacklogPage } from '@/pages/backlog';
import { HomePage } from '@/pages/home';
import { InvitationPage } from '@/pages/invitation';
import { MyWorksPage } from '@/pages/my-works';
import { ProfilePage } from '@/pages/profile';
import { ComponentSettingPage, SettingPage, TeamSettingPage } from '@/pages/settings';
import { default as SignInPage } from '@/pages/signin';
import { SignUpPage } from '@/pages/signup';
import { SprintPage } from '@/pages/sprint';
import { ROUTES_MAP } from '@/shared/config';
import { BrowserRouter, Route, Routes } from 'react-router';
import DefaultLayout from '../layouts/DefaultLayout';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES_MAP.main.path} element={<HomePage />} />
        <Route path={ROUTES_MAP.signin.path} element={<SignInPage />} />
        <Route path={ROUTES_MAP.signup.path} element={<SignUpPage />} />
        <Route path={ROUTES_MAP.invitation.path} element={<InvitationPage />} />

        <Route element={<DefaultLayout />}>
          <Route path={ROUTES_MAP.myWorks.path} element={<MyWorksPage />} />
          <Route path={ROUTES_MAP.backlog.path} element={<BacklogPage />} />
          <Route path={ROUTES_MAP.projectSettings.path} element={<SettingPage />} />
          <Route path={ROUTES_MAP.teamSettings.path} element={<TeamSettingPage />} />
          <Route path={ROUTES_MAP.componentSettings.path} element={<ComponentSettingPage />} />
          <Route path={ROUTES_MAP.profile.path} element={<ProfilePage />} />
          <Route path={ROUTES_MAP.sprint.path} element={<SprintPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
