import './globals.css';
import QueryProvider from '../providers/QueryProvider.jsx';
import Header from '../components/common/Header.jsx';
import Footer from '../components/common/Footer.jsx';

export const metadata = {
  title: 'Maaza Printwala — India ki Apni Online Printing Press | Commercial B2B & B2C Printing',
  description: 'India\'s premier online printing platform for Business Cards, Flex Banners, Letterheads, Brochures, Apparel, and Corporate Gift Packaging with instant pricing and custom design tools.',
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
