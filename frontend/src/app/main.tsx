import { createRoot } from 'react-dom/client';

import { AppRouter } from '@/app/router/AppRouter';
import '@/app/styles/global.css';

const root = createRoot(document.getElementById('root')!);

root.render(
  // <StrictMode>
  <AppRouter />,
  // </StrictMode>,
);
