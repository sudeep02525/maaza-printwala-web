export default function RootNotFound() {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', margin: 0, padding: 0 }}>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAFCFF', color: '#1e293b', padding: '1rem' }}>
          <div style={{ textAlign: 'center', maxWidth: '28rem' }}>
            <h1 style={{ fontSize: '4rem', fontWeight: 900, color: '#e2e8f0', margin: '0 0 1.5rem 0' }}>404</h1>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', margin: '0 0 1rem 0' }}>Page Not Found</h2>
            <p style={{ color: '#64748b', marginBottom: '2rem', fontWeight: 500 }}>
              The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
            </p>
            <a
              href="/"
              style={{
                display: 'inline-flex',
                padding: '0.75rem 2rem',
                backgroundColor: '#0082CA',
                color: '#ffffff',
                fontWeight: 700,
                borderRadius: '0.5rem',
                textDecoration: 'none',
                boxShadow: '0 4px 6px -1px rgba(0, 130, 202, 0.2)'
              }}
            >
              Return to Homepage
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
