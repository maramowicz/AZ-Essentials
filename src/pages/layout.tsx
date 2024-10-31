import { useTheme } from 'next-themes';
import { GoMoon, GoSun } from 'react-icons/go';
import { useDev } from '@/contexts/DevContext';
import Head from 'next/head';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { isDev, setIsDev } = useDev();
    const { systemTheme, theme, setTheme } = useTheme();
    const currentTheme = theme === 'system' ? systemTheme : theme;
    return (
        <section>
            <Head>
                <link rel="icon" type="image/png" href="/favicon/favicon-96x96.png" sizes="96x96" />
                <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
                <link rel="shortcut icon" href="/favicon/favicon.ico" />
                <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
                <meta name="apple-mobile-web-app-title" content="MyWebSite" />
                <link rel="manifest" href="/favicon/site.webmanifest" />
            </Head>
            {children}
            <div className='w-screen h-fit flex items-center justify-between border '>
                <span
                    onDoubleClick={() => {
                        setIsDev(true); console.log("Uruchomiono tryb developera, miłego debugowania");
                    }}
                    className="text-gray-400 dark:text-gray-700 lg:text-xl leading-3">
                    Beta
                </span>
                <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                    {currentTheme === 'dark' ? (
                        <GoSun className="h-12 w-auto px-1 py-1 hover:text-yellow-200 transition-colors duration-500" />
                    ) : (
                        <GoMoon className="h-12 w-auto px-1 py-1 text-black hover:text-blue-800 transition-colors duration-500" />
                    )}
                </button>
                {isDev && (
                    <div className='absolute top-2 right-2 w-2 h-2 md:w-4 md:h-4 bg-red-500/25 rounded-full' />
                )}
            </div>

        </section>
    );
}