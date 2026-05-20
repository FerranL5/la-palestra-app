import { AppProvider } from '@/context/AppContext';
import '@/styles/globals.css';

export const metadata = {
  title: 'Concerts Catalans - Agenda de concerts i festivals',
  description: 'Descobreix els millors concerts i festivals de música en català',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ca">
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}