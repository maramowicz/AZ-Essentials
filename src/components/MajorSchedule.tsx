import { useDev } from '@/contexts/DevContext';
import ErrorModal from '@/pages/ErrorModal';
import React, { useEffect, useState } from 'react';
import { MajorTypes } from '@/types/type';
import { div } from 'framer-motion/client';

interface MajorScheduleProps {
    firstTryFetchingData: MajorTypes[] | null | undefined;
    returnToMenu: () => void
}

const MajorSchedule: React.FC<MajorScheduleProps> = ({ firstTryFetchingData, returnToMenu }) => {
    const [data, setData] = useState<MajorTypes[]>();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [chosenScheduleData, setChosenScheduleData] = useState<MajorTypes | null>(null);
    const { isDev } = useDev();

    const colorsSmooth = "transition-colors duration-150";
    const devBorder = "border border-black dark:border-white";
    const yearSelectionEl = "px-1.5 dark:bg-gray-700 rounded-sm";
    const majorYears = ["I", "II", "III"];
    const daysOfWeek = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', "Sobota", "Niedziela"];

    function closeErrorModal() {
        setErrorMessage(null);
    }

    useEffect(() => {
        console.clear();
        if (firstTryFetchingData) {
            if (isDev) console.log("Dane istnieją, nie trzeba ich pobierać");
            if (isDev) console.log(firstTryFetchingData);
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
                        returnToMenu();
                    }, 2000);
                }
            };
            console.clear();
            fetchData();
        }
    }, []);

    function showChosenSchedule(major: MajorTypes) {
        console.log(major);
        setChosenScheduleData(major);
    }

    function renderChosenSchedule() {
        if (!chosenScheduleData) return null;

        return (
            <>
                <button
                    onClick={() => setChosenScheduleData(null)}
                    className={`absolute -top-1 left-2 text-2xl md:text-3xl lg:text-4xl mt-4 border-2 border-gray-400 text-black dark:text-white dark:shadow-gray-600 py-1 px-5 rounded-lg hover:scale-105 active:scale-95 focus:scale-105 transition-transform duration-150 ${colorsSmooth}`}>
                    Wróć
                </button>
                <div className={`flex items-center flex-col`}>
                    <span className='w-40 text-center'>
                        {chosenScheduleData.name}
                    </span>
                    <b>
                        {chosenScheduleData.year}
                    </b>
                    {/* <span>
                        {chosenScheduleData.type}
                    </span> */}
                </div>
                <div className='h-full overflow-y-auto custom-scrollbar'>
                    <ul>
                        {
                            chosenScheduleData.plan.map((day, index) => {
                                return (
                                    <li className='flex flex-col gap-3 border-b-2'>
                                        <b>
                                            {daysOfWeek[index]}
                                        </b>
                                        {
                                            day.map(lesson => {
                                                console.log(lesson);
                                                return (
                                                    <div className='flex items-center flex-col'>
                                                        <p className='w-52 text-center'>{lesson.type} {lesson.name}</p>
                                                        <p>{lesson.teacher}</p>
                                                        <span>{lesson.subject}</span>
                                                        <span>{lesson.place}</span>
                                                    </div>

                                                )
                                            })
                                        }
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </>

        );
    }

    function showMajors() {
        if (!data) return null;
        return data.map((major, index) => {
            if (major.name && major.year && major.type && (selectedYear === null || major.year === selectedYear)) {
                return (
                    <li onClick={() => showChosenSchedule(major)} className={`h-32 min-w-44 max-w-80 flex items-center justify-center flex-col gap-1 text-center px-2 py-1 text-black dark:text-white rounded-md shadow-[0px_2px_5px_2px_rgb(200,200,200)] dark:shadow-[0px_2px_10px_2px_rgb(5,5,5)] ${isDev && devBorder}`}
                        key={index}>
                        <span className='w-40'>
                            {major.name}
                        </span>
                        <b>
                            {major.year}
                        </b>
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
        <div className={`relative h-[91vh] md:h-screen flex items-center justify-center flex-col overflow-y-hidden ${isDev && devBorder}`}>
            {!chosenScheduleData && isDev &&
                <>
                    <button
                        onClick={returnToMenu}
                        className={`absolute -top-1 left-2 text-2xl md:text-3xl lg:text-4xl mt-4 border-2 border-gray-400 text-black dark:text-white dark:shadow-gray-600 py-1 px-5 rounded-lg hover:scale-105 active:scale-95 focus:scale-105 transition-transform duration-150 ${colorsSmooth}`}>
                        Cofnij
                    </button>
                    <div className='flex items-end justify-end flex-col overflow-y-hidden'>
                        <div className='w-full flex justify-between text-base pb-0.5'>
                            <span>Rok:</span>
                            <ul className='flex gap-2'>
                                {majorYears.map((year, index) => (
                                    <li
                                        onClick={() => setSelectedYear("Rok " + year)}
                                        key={index}
                                        className={yearSelectionEl}>
                                        {year}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <ul className={`md:w-fit h-[85%] md:h-[85%] grid grid-cols-1 sm:grid-cols-3 place-items-center gap-3 md:gap-5 px-2 py-2 custom-scrollbar overflow-y-auto ${isDev && devBorder}`}>
                            {showMajors()}
                        </ul>
                        {errorMessage && (
                            <ErrorModal message={errorMessage} onClose={closeErrorModal} />
                        )}
                    </div>
                </>
            }
            <div className={`h-[75%] overflow-y-hidden ${devBorder}`}>
                {chosenScheduleData && renderChosenSchedule()}
            </div>
        </div>
    );
};

export default MajorSchedule;
