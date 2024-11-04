import { useDev } from '@/contexts/DevContext';
import ErrorModal from '@/pages/ErrorModal';
import React, { useCallback, useEffect, useState } from 'react';
import { MajorTypes } from '@/types/type';
import Head from 'next/head';
import { FaAngleDown } from "react-icons/fa6";
import { FaAngleUp } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa6";
// My
import { HiCommandLine } from "react-icons/hi2";
// Fizjoterapia
import { FaDumbbell } from "react-icons/fa6";
// Pielegniarstwo
import { GiAngelOutfit } from "react-icons/gi";
// import { FaBriefcaseMedical } from "react-icons/fa6";
// Położnictwo
import { FaUserNurse } from "react-icons/fa6";
// import { FaBaby } from "react-icons/fa6";
// Fir
import { FaCoins } from "react-icons/fa";
// Pedagogika
import { FaChalkboardTeacher } from "react-icons/fa";
// Prawo
import { GoLaw } from "react-icons/go";
// Bezpieczeństwo narodowe
import { FaShieldAlt } from "react-icons/fa";
// Rynek sztuki 
import { FaImages } from "react-icons/fa";
// Ratownictwo medyczne
import { FaAmbulance } from "react-icons/fa";
// Mechanika i budowa maszyn
import { MdEngineering } from "react-icons/md";
// Turystyka i rekreacja
import { FaMapMarkedAlt } from "react-icons/fa";
// Logistycy
import { FaToilet } from "react-icons/fa6";

interface MajorScheduleProps {
    firstTryFetchingData: MajorTypes[] | null | undefined;
    returnToMenu: () => void
}

const MajorSchedule: React.FC<MajorScheduleProps> = ({ firstTryFetchingData, returnToMenu }) => {
    const [data, setData] = useState<MajorTypes[]>();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [searchedMajor, setSearchedMajor] = useState<string>("");
    const [chosenScheduleData, setChosenScheduleData] = useState<MajorTypes | null>(null);
    const [filteredMajors, setFilteredMajors] = useState<MajorTypes[] | undefined>(data);
    const { isDev } = useDev();

    const daysOfWeek = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', "Sobota", "Niedziela"];
    const [showDays, setShowDays] = useState<boolean[]>(Array(daysOfWeek.length).fill(false));

    const colorsSmooth = "transition-colors duration-75";
    const shadowSmooth = "transition-shadow duration-[1.5s] delay-700 dark:duration-1000 dark:delay-100"
    const devBorder = "border border-black dark:border-white";
    const yearSelectionEl = "px-3 py-0.5 text-lg min-[480px]:px-3 min-[480px]:py-0.5 min-[480px]:text-base 2xl:text-2xl rounded-md cursor-pointer bg-gray-300 dark:bg-gray-700 transition-colors duration-100";
    const interStyles = "md:hover:scale-105 md:active:scale-95 transition-all duration-75"
    const majorYears = ["1", "2", "3"];


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

    function renderChosenSchedule() {
        function formatTime(time: number) {
            return `${Math.floor(time / 60)}:${time % 60 === 0 ? '00' : time % 60 < 10 ? '0' + (time % 60) : time % 60}`;
        }

        if (!chosenScheduleData) return null;

        return (
            <div className='w-screen h-screen'>
                <div className={`flex items-center flex-col bg-slate-800`}>
                    <span className='w-40 text-center'>
                        {chosenScheduleData.name} {chosenScheduleData.groups[0]}
                    </span>
                    <span>
                        {chosenScheduleData.type}
                    </span>
                </div>
                <ul className='w-full h-full grid content-start grid-cols-1 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-1 pb-44 md:pb-0 overflow-y-auto custom-scrollbar'>
                    {
                        chosenScheduleData.plan.map((day, index) => {
                            if (typeof day == "string" || day.length == 0) return
                            if (isDev) console.log(daysOfWeek[index], day)
                            return (
                                <li key={index} className='w-full flex flex-col bg-gray-900'>
                                    <div className='flex px-2 border'>
                                        <label htmlFor={String(index)} className='w-full text-xl py-1 cursor-pointer'>
                                            {daysOfWeek[index]}
                                        </label>
                                        <button id={String(index)} onClick={() => {
                                            const newShowDays = [...showDays];
                                            newShowDays[index] = !newShowDays[index];
                                            setShowDays(newShowDays);
                                        }}>
                                            {showDays[index] ? <FaAngleUp className='text-4xl' /> : <FaAngleDown className='text-4xl' />}
                                        </button>
                                    </div>
                                    {showDays[index] && (
                                        day.map((lesson, index) => {
                                            if (isDev) console.log(lesson);
                                            return (
                                                <div key={index} className='h-40 flex items-center justify-center flex-col bg-gray-700 py-2 border-b-2 px-2'>
                                                    <p className='w-52 text-center'>
                                                        {lesson.type} {lesson.name}
                                                    </p>
                                                    <p>{lesson.teacher}</p>
                                                    <span>{lesson.subject}</span>
                                                    <div className='w-full flex justify-between'>
                                                        <span>{lesson.place}</span>
                                                        <span>{formatTime(lesson.start_minute)}-{formatTime(lesson.end_minute)}</span>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    )}
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        );
    }

    function fetchSearchedMajor(searchedMajor: string) {
        setSearchedMajor(searchedMajor);
        if (searchedMajor.length >= 2) {
            const resultMajors = new Set<MajorTypes>();
            console.log(searchedMajor);

            data?.forEach(major => {
                if (major.name && major.name.toLowerCase().includes(searchedMajor.toLowerCase())) {
                    resultMajors.add(major);
                }
            });
            setFilteredMajors(Array.from(resultMajors));
        } else {
            setFilteredMajors([]);
        }
    }

    function getMajorIcon(majorName: string) {
        switch (majorName) {
            case "Pielęgniarstwo":
                return <GiAngelOutfit className='text-black dark:text-yellow-100' />
            case "Rynek sztuki i zarządzanie w kulturze":
                return <FaImages />
            case "Fizjoterapia":
                return <FaDumbbell />
            case "Ratownictwo medyczne":
                return <FaAmbulance />
            case "Turystyka i rekreacja":
                return <FaMapMarkedAlt />
            case "Informatyka":
                return <HiCommandLine />
            case "Mechanika i budowa maszyn":
                return <MdEngineering />
            case "Położnictwo":
                return <FaUserNurse />
            case "Pedagogika":
                return <FaChalkboardTeacher />
            case "Finanse i rachunkowość":
                return <FaCoins />
            case "Prawo":
                return <GoLaw />
            case "Bezpieczeństwo narodowe":
                return <FaShieldAlt />
            case "Logistyka":
                return <FaToilet />
            default:
                break;
        }
    }

    function getMajors(majors: MajorTypes[]) {
        // Todo: Sortowanie, czyli na początku wyświetlą się 1 roki
        return majors.map((major, index) => {
            if (major.name && major.year && major.type && (selectedYear === null || major.year == selectedYear)) {
                return (
                    <button onClick={() => setChosenScheduleData(major)} className={`relative h-36 w-full min-[1300px]:h-44 flex items-center justify-center flex-col gap-0.5 text-center px-2 py-1 text-black dark:text-white rounded-md shadow-[0px_2px_5px_2px_rgb(200,200,200)] dark:shadow-[0px_2px_10px_2px_rgb(5,5,5)] ${shadowSmooth} ${isDev && devBorder} transition-colors duration-500 ${interStyles}`}
                        key={index}>
                        <div className='absolute top-1 right-1 text-2xl md:text-4xl'>
                            {getMajorIcon(major.name)}
                        </div>
                        <span className='absolute top-1 left-1'>
                            {major.groups[0]}
                        </span>
                        <span className='w-[90%] min-[1300px]:w-full'>
                            {major.name}
                        </span>
                        <span>
                            {major.type}
                        </span>
                    </button>
                );
            }
            return null;
        });
    }

    const showMajors = useCallback(() => {
        if (filteredMajors && searchedMajor.length >= 2) {
            if (isDev) console.log("To się wywoła potem");
            return getMajors(filteredMajors);
        } else {
            if (isDev) console.log("To się wywoła kiedy zmienimy selectedYear:", selectedYear);
            if (data) return getMajors(data);
        }
    }, [filteredMajors, selectedYear, data]);

    return (
        <>
            <Head>
                <title>Plany zajęć</title>
            </Head>
            <div className={`relative h-[93vh] md:h-screen flex items-center flex-col overflow-hidden ${isDev && devBorder}`}>
                <div className={`relative w-screen flex items-center py-3 px-2 shadow-[0px_1px_10px_1px_rgb(225,225,225)] dark:shadow-[0px_1px_10px_1px_rgb(10,10,10)] ${shadowSmooth}`}>
                    {!chosenScheduleData ? (
                        <button
                            onClick={returnToMenu}
                            className={`text-2xl md:text-3xl lg:text-4xl text-black dark:text-white dark:shadow-gray-600 hover:scale-105 active:scale-95 focus:scale-105 transition-transform duration-150 ${colorsSmooth}`}>
                            <FaAngleLeft />
                        </button>
                    ) : (
                        <button
                            onClick={() => setChosenScheduleData(null)}
                            className={`text-2xl md:text-3xl lg:text-4xl text-black dark:text-white  hover:scale-105 active:scale-95 focus:scale-105 transition-transform duration-150 ${colorsSmooth}`}>
                            <FaAngleLeft />
                        </button>
                    )}
                </div>
                {!chosenScheduleData &&
                    <div className='w-full sm:h-full flex items-center sm:justify-center flex-col overflow-y-hidden sm:px-3'>
                        <div className={`w-full h-full sm:w-fit min-[1300px]:w-[90vw] flex items-center justify-center flex-col sm:rounded-lg overflow-hidden sm:mb-1 px-2 ${isDev && devBorder}`}>
                            <div className={`w-screen sm:w-full flex flex-col-reverse sm:flex-row items-center justify-between py-1 px-2 shadow-[0px_5px_5px_1px_rgb(200,200,200)] sm:shadow-[0px_2px_5px_1px_rgb(200,200,200)] dark:shadow-[0px_4px_5px_1px_rgb(10,10,10)] ${shadowSmooth} sm:rounded-md`}>
                                {/* Todo: Dodaj liste proponowanych */}
                                <input value={searchedMajor} onChange={(e) => fetchSearchedMajor(e.target.value)} className={`w-[19rem] md:w-72 pl-2 py-1.5 mt-2 mb-1.5 text-xl md:text-lg 2xl:text-2xl bg-transparent border-2 border-gray-700 rounded-lg outline-none focus:border-gray-200 dark:focus:border-gray-400 shadow-[inset_1px_1px_6px_1px_rgb(225,225,225)] dark:shadow-[inset_1px_1px_6px_1px_rgb(10,10,10)] text-black dark:text-white ${shadowSmooth}`} type="text" placeholder='Wpisz kierunek' />
                                <div className='flex items-center gap-2 md:text-xl pt-1 sm:pt-0'>
                                    <span className={`text-2xl min-[480px]:text-xl xl:text-2xl text-black dark:text-white transition-colors duration-200`}>Rok:</span>
                                    <ul className='flex gap-2'>
                                        <li
                                            onClick={() => setSelectedYear(null)}
                                            className={`${yearSelectionEl} ${interStyles} 
                                                ${selectedYear == null ? "bg-gray-600 dark:bg-white text-white dark:text-black" : "text-black dark:text-white"} ${colorsSmooth}`}>
                                            Wszysktie
                                        </li>
                                        {majorYears.map((year, index) => (
                                            <li
                                                onClick={() => setSelectedYear(year)}
                                                key={index}
                                                className={`${yearSelectionEl} ${interStyles} 
                                                    ${selectedYear == year ? "bg-gray-600 dark:bg-white text-white dark:text-black" : "text-black dark:text-white"} ${colorsSmooth}`}>
                                                {year}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            {/* min-[1893px]:w-fit */}
                            <ul className={`w-full h-screen grid grid-cols-2 min-[430px]:grid-cols-2 sm:grid-cols-3 min-[886px]:grid-cols-4 min-[1060px]:grid-cols-5 place-items-center content-start gap-2 md:gap-4 px-2 mt-1 md:px-2 lg:px-3 py-2 custom-scrollbar overflow-y-auto overflow-x-hidden text-sm xl:text-base min-[1300px]:text-xl ${isDev && devBorder}`}>
                                {showMajors()}
                            </ul>
                        </div>
                        {errorMessage && (
                            <ErrorModal message={errorMessage} onClose={() => setErrorMessage(null)} />
                        )}
                    </div>
                }
                {isDev && chosenScheduleData && (
                    renderChosenSchedule()
                )}
            </div>
        </>
    );
};

export default MajorSchedule;