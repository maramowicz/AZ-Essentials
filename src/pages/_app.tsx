import { ThemeProvider } from 'next-themes';
import { DevProvider } from '@/contexts/DevContext';
import DashboardLayout from '@/pages/layout';
import { AppProps } from 'next/app';
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider enableSystem={true} attribute="class" defaultTheme="system">
      <DevProvider>
        <DashboardLayout>
          <Component {...pageProps} />
        </DashboardLayout>
      </DevProvider>
    </ThemeProvider>
  );
}
