import { useDev } from '@/contexts/DevContext';
import ErrorModal from '@/pages/ErrorModal';
import React, { useEffect, useState } from 'react';
import { MajorTypes } from '@/types/type';
import Head from 'next/head';

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

    const colorsSmooth = "transition-colors duration-75";
    const devBorder = "border border-black dark:border-white";
    const yearSelectionEl = "px-1.5 md:px-3 md:py-1 rounded-sm md:rounded-md cursor-pointer bg-gray-200 dark:bg-gray-700 text-black dark:text-white";
    const interStyles = "hover:scale-105 active:scale-95 transition-all duration-75"
    const majorYears = ["1", "2", "3"];
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
                <div className={`flex items-center flex-col bg-slate-700`}>
                    <span className='w-40 text-center'>
                        {chosenScheduleData.name} {chosenScheduleData.groups[0]}
                    </span>
                    <span>
                        {chosenScheduleData.type}
                    </span>
                </div>
                <div className='h-full overflow-y-auto custom-scrollbar'>
                    <ul>
                        {
                            chosenScheduleData.plan.map((day, index) => {
                                if (typeof day == "string") return
                                return (
                                    <li key={index} className='flex flex-col'>
                                        <b className='bg-gray-900 text-xl py-1'>
                                            {daysOfWeek[index]}
                                        </b>
                                        {
                                            day.map((lesson, index) => {
                                                console.log(lesson);
                                                return (
                                                    <div key={index} className='flex items-center flex-col bg-gray-700 py-2 border-b-2'>
                                                        <p className='w-52 text-center'>
                                                            {lesson.type} {lesson.name}
                                                        </p>
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
            if (major.name && major.year && major.type && (selectedYear === null || major.year == selectedYear)) {
                return (
                    <li onClick={() => showChosenSchedule(major)} className={`h-[8.5rem] min-w-48 max-w-80 flex items-center justify-center flex-col gap-0.5 text-center px-2 py-1 mx-2 text-black dark:text-white rounded-md shadow-[0px_2px_5px_2px_rgb(200,200,200)] dark:shadow-[0px_2px_10px_2px_rgb(5,5,5)] ${isDev && devBorder} transition-colors duration-75`}
                        key={index}>
                        <span className='w-40'>
                            {major.name}
                        </span>
                        <span>
                            {major.groups[0]}
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
        <>
            <Head>
                <title>Plany zajęć</title>
            </Head>
            <div className={`relative h-[91vh] md:h-screen flex items-center flex-col overflow-hidden ${isDev && devBorder}`}>
                <div className='relative w-screen flex items-center py-3 px-2'>
                    {!chosenScheduleData ? (
                        <button
                            onClick={returnToMenu}
                            className={`text-2xl md:text-3xl lg:text-4xl border-2 border-gray-400 text-black dark:text-white dark:shadow-gray-600 py-1 px-5 rounded-lg hover:scale-105 active:scale-95 focus:scale-105 transition-transform duration-150 ${colorsSmooth}`}>
                            Cofnij
                        </button>
                    ) : (
                        <button
                            onClick={() => setChosenScheduleData(null)}
                            className={`text-2xl md:text-3xl lg:text-4xl border-2 border-gray-400 text-black dark:text-white dark:shadow-gray-600 py-1 px-5 rounded-lg hover:scale-105 active:scale-95 focus:scale-105 transition-transform duration-150 ${colorsSmooth}`}>
                            Wróć
                        </button>
                    )}
                </div>
                {!chosenScheduleData &&
                    <div className='w-full flex items-center justify-end flex-col overflow-y-hidden sm:px-3'>
                        <div className={`relative top-0 sm:-top-9 w-full sm:w-fit h-[120vh] min-[480px]:h-[85%] flex items-center justify-center flex-col rounded-lg overflow-hidden mb-1 ${isDev && devBorder}`}>
                            <div className='w-full flex flex-col items-center justify-between text-base pb-0.5 shadow-lg px-3'>
                                <div className='w-full flex flex-col-reverse min-[480px]:flex-row items-center justify-between py-1'>
                                    <input className='w-52 pl-2 py-1 mt-2 mb-1.5 md:text-2xl text-black dark:text-white bg-transparent border-2 border-gray-700 rounded-3xl outline-none focus:border-gray-200 dark:focus:border-gray-400 shadow-[inset_1px_1px_6px_1px_rgb(225,225,225)] dark:shadow-[inset_1px_1px_6px_1px_rgb(10,10,10)]' type="text" placeholder='Wpisz kierunek' />
                                    <div className='flex items-center gap-2 md:text-xl pt-1 sm:pt-0'>
                                        <span className={`text-black dark:text-white ${colorsSmooth}`}>Rok:</span>
                                        <ul className='flex gap-2'>
                                            <li
                                                onClick={() => setSelectedYear(null)}
                                                className={`${yearSelectionEl} ${interStyles}`}>
                                                Wszysktie
                                            </li>
                                            {majorYears.map((year, index) => (
                                                <li
                                                    onClick={() => setSelectedYear(year)}
                                                    key={index}
                                                    className={`${yearSelectionEl} ${interStyles}`}>
                                                    {year}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <ul className='w-full h-full grid grid-cols-1 min-[480px]:grid-cols-2 sm:grid-cols-3 place-items-center gap-3 md:gap-x-0.5 md:gap-y-3 mt-1 pb-12 custom-scrollbar overflow-y-auto px-3'>
                                {showMajors()}
                            </ul>
                        </div>
                        {errorMessage && (
                            <ErrorModal message={errorMessage} onClose={closeErrorModal} />
                        )}
                    </div>
                }
                {isDev && chosenScheduleData && (
                    <div className={`h-[75%] overflow-y-hidden ${devBorder}`}>
                        {renderChosenSchedule()}
                    </div>
                )}
            </div>
        </>

    );
};

export default MajorSchedule;