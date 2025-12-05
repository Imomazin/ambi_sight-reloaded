import './globals.css';

export const metadata = {
  title: 'Ambi-Sight',
  description: 'Organizational Ambidexterity Intelligence',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
