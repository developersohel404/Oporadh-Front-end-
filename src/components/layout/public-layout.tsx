import { Outlet } from 'react-router-dom';
import { PublicFooter } from './public-footer';
import { PublicHeader } from './public-header';

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}
