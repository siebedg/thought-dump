export const metadata = { title: 'ThoughtDump' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif', background: '#fff', color: '#111' }}>
        {children}
      </body>
    </html>
  );
}


