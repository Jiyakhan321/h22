import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import Navigation from '../components/Navigation';
import '../styles/globals.css';

export const metadata = {
  title: 'TodoPro - Modern Task Management',
  description: 'A professional todo application with authentication and task management',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <ThemeProvider>
          <AuthProvider>
            <Navigation />
            <main className="container mx-auto py-6">
              {children}
            </main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}