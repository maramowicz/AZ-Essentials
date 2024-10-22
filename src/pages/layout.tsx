import { useTheme } from "next-themes";
import Sun from '../../public/sun-regular.svg';
import Moon from '../../public/moon-regular.svg';
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { systemTheme, theme, setTheme } = useTheme();
    const currentTheme = theme === "system" ? systemTheme : theme;
    return <section>
        {children}
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="absolute bottom-0 sm:bottom-1 right-2.5 rounded-full bg-gray-100">
            {currentTheme === "dark" ? (
                <Sun className="h-12 md:h-14 w-auto px-1 py-1" />
            ) : (
                <Moon className="h-12 md:h-14 w-auto px-2 py-1" />
            )}
        </button>
        <span className='absolute bottom-0.5 sm:bottom-1 left-2 text-gray-400 dark:text-gray-700'>
            Beta
        </span>
    </section>
}