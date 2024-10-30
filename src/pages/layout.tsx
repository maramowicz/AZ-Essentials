import { useTheme } from 'next-themes';
import { GoMoon, GoSun } from 'react-icons/go';
import { useDev } from '@/contexts/DevContext';
import { useEffect } from 'react';
import { motion } from 'framer-motion'
import { useAnimation } from '@/contexts/AnimationContext';
import Head from 'next/head';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { isDev, setIsDev } = useDev();
    const { systemTheme, theme, setTheme } = useTheme();
    const currentTheme = theme === 'system' ? systemTheme : theme;
    const { animationOn, setAnimationOn } = useAnimation()

    useEffect(() => {
        const storedPreference = localStorage.getItem("az-essentials");
        if (storedPreference !== null) {
            setAnimationOn(storedPreference === 'true');
        }
    }, []);

    function updateAnimationPreference() {
        const newAnimationPreference = !animationOn;
        setAnimationOn(newAnimationPreference);
        localStorage.setItem("az-essentials", String(newAnimationPreference));
    }

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
            <div>
                <label className="absolute top-3 right-5 inline-block h-6 w-14 md:border-2 md:border-gray-200 md:dark:border-gray-700 rounded-full" htmlFor="checkbox">
                    <input
                        className='hidden'
                        type="checkbox"
                        id="checkbox"
                        onChange={() => updateAnimationPreference()}
                    />
                    <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 rounded-full transition-colors duration-300 group">
                        <span className='absolute -left-[5.5rem] -top-1 md:top-7 md:-left-7 w-20 md:w-24 text-xs md:text-sm leading-3 md:leading-4 text-center dark:text-gray-500 md:opacity-0 md:group-hover:opacity-100 md:-translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-500 bg-gray-800/75 px-1 py-1 rounded-md'>
                            Wyłącz/włącz animacje
                        </span>
                        <motion.div
                            className="absolute bottom-1/2 translate-y-1/2 h-4 w-4 bg-white dark:bg-slate-900 rounded-full shadow-md dark:shadow-sm dark:shadow-black"
                            initial={{ left: '4px' }}
                            animate={{ left: animationOn === true ? 'calc(100% - 20px)' : '4px' }}
                            transition={{ type: 'spring', stiffness: 150 }}
                        />
                    </div>
                </label>
                <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="absolute bottom-2 right-3"
                >
                    {currentTheme === 'dark' ? (
                        <GoSun className="h-12 md:h-14 lg:h-16 xl:h-20 w-auto px-1 py-1 hover:text-yellow-200 transition-colors duration-500" />
                    ) : (
                        <GoMoon className="h-12 md:h-14 lg:h-16 xl:h-20 w-auto px-1 py-1 text-black hover:text-blue-800 transition-colors duration-500" />
                    )}
                </button>
                <span
                    onDoubleClick={() => {
                        setIsDev(true); console.log("Uruchomiono tryb developera, miłego debugowania");
                    }}
                    className="absolute bottom-5 md:bottom-3 left-2 text-gray-400 dark:text-gray-700 lg:text-xl leading-3"
                >
                    Beta
                </span>
                {isDev && (
                    <div className='absolute top-2 left-2 w-2 h-2 md:w-4 md:h-4 bg-red-500/25 rounded-full' />
                )}
            </div>

        </section>
    );
}
