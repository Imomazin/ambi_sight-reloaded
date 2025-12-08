import './globals.css';
import type { Metadata } from 'next';
import { ToastProvider } from '@/components/Toast';

export const metadata: Metadata = {
  title: 'AmbiSight Reloaded',
  description: 'AI-Driven Strategic Decision Intelligence Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-navy-900 text-gray-100 antialiased">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
