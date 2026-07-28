import './globals.css';
import QueryProvider from '../providers/QueryProvider.jsx';
import Header from '../components/common/Header.jsx';
import Footer from '../components/common/Footer.jsx';

export const metadata = {
  title: 'Maaza Printwala — India ki Apni Online Printing Press [Demo]',
  description: 'Custom business cards, banners, and t-shirts with dynamic schema configurators and transparent volume discounts.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[var(--color-bg-neutral)] text-[var(--color-charcoal)] antialiased font-sans min-h-screen flex flex-col">
        <QueryProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
