// components/DashboardLayout.tsx
import { useTheme } from 'next-themes';
import { GoMoon, GoSun } from 'react-icons/go';
import { useDev } from '@/contexts/DevContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { isDev, setIsDev } = useDev();
    const { systemTheme, theme, setTheme } = useTheme();
    const currentTheme = theme === 'system' ? systemTheme : theme;
    
    return (
        <section>
            {children}
            <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="absolute bottom-1 right-3"
            >
                {currentTheme === 'dark' ? (
                    <GoSun className="h-12 md:h-14 w-auto px-1 py-1" />
                ) : (
                    <GoMoon className="h-12 md:h-14 w-auto px-1 py-1 text-black" />
                )}
            </button>
            <span
                onClick={() => setIsDev(true)}
                className="absolute bottom-0.5 sm:bottom-1 left-2 text-gray-400/60 dark:text-gray-700"
            >
                Beta
            </span>
            {isDev && (
                <div className='absolute top-2 right-2 w-2 h-2 bg-yellow-500/25 rounded-full'/>
            )}
        </section>
    );
}
