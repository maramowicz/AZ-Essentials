import { useDev } from '@/contexts/DevContext';
import ErrorModal from '@/pages/ErrorModal';
import React, { useEffect, useState } from 'react';
import { MajorTypes } from '@/types/type';


interface MajorScheduleProps {
    firstTryFetchingData: MajorTypes[] | undefined;
    returnToMenu: () => void
}

const MajorSchedule: React.FC<MajorScheduleProps> = ({ firstTryFetchingData, returnToMenu }) => {
    const [data, setData] = useState<MajorTypes[]>();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { isDev } = useDev();

    const colorsSmooth = "transition-colors duration-150"

    function closeErrorModal() {
        setErrorMessage(null);
    }

    useEffect(() => {
        if (firstTryFetchingData) {
            if (isDev) console.log("Dane istnieją, nie trzeba ich pobierać");
            setData(firstTryFetchingData);
        } else {
            const fetchData = async () => {
                try {
                    const response = await fetch('https://maramowicz.dev/azapi/database.json');
                    if (!response.ok) throw new Error("Failed to fetch data");
                    const jsonData: MajorTypes[] = await response.json();
                    const filteredData = jsonData.filter((major: MajorTypes) => {
                        return major.doc_type !== -1 && major.doc_type !== -2;
                    });
                    if (isDev) console.log(filteredData);

                    setData(filteredData);
                } catch (error) {
                    console.error(error);
                    setErrorMessage("Błąd przy pobieraniu danych.");
                    setTimeout(() => {
                        returnToMenu()
                    }, 2000)
                }
            };
            console.clear();
            fetchData();
        }
    }, []);

    function showMajors() {
        if (!data) return null;

        return data.map((major, index) => {
            if (major.name && major.year) {
                return (
                    <li className='max-w-72 w-fit flex items-center justify-center flex-col text-center px-2 py-1 border' key={index}>
                        <span>
                            {major.name}
                        </span>
                        <span>
                            {major.year}
                        </span>
                        <span>
                            {major.type}
                        </span>
                    </li>
                );
            }
            return null;
        });
    }

    return (
        <div className={`h-screen flex items-center justify-center overflow-y-hidden ${isDev && "border"}`}>
            {isDev && (
                <>
                    <button
                        onClick={returnToMenu}
                        className={`absolute -top-1 left-2 text-2xl md:text-3xl lg:text-4xl mt-4 border-2 border-gray-400 text-black dark:text-white dark:shadow-gray-600 py-1 px-5 rounded-lg hover:scale-105 active:scale-95 focus:scale-105 transition-transform duration-150 ${colorsSmooth}`}>
                        Cofnij
                    </button>
                    <ul className={`relative top-3 md:top-9 h-[85%] md:h-[85%] grid grid-cols-1 md:grid-cols-2 place-items-center md:gap-2 gap-1 overflow-y-auto ${isDev && "border"}`}>
                        {showMajors()}
                    </ul>
                    {errorMessage && (
                        <ErrorModal message={errorMessage} onClose={closeErrorModal} />
                    )}
                </>
            )}
        </div>
    );
};

export default MajorSchedule;
