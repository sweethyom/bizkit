import { HomePage } from '@/pages/home';
import { ROUTES_MAP } from '@/shared/config';
import { BrowserRouter, Route, Routes } from 'react-router';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES_MAP.main.path} element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
};
