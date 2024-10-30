// Todo: pobieranie danych tutaj, jeśli się nie uda to spróbuj ponownie w dynamicSearch
// Trzeba scrollować, wybrać wydział, wybrać kierunek i wybrać rok
import Head from "next/head";
import DynamicSearch from "@/components/DynamicSearch";
import { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import MajorSchedule from "@/components/MajorSchedule";
import { MajorTypes } from '@/types/type';

function Index() {
  const [chosenAction, setChosenAction] = useState<number | null>(null);
  const [firstTryFetchingData, setFirstTryFetchingData] = useState<MajorTypes[] | null>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [animationOn, setAnimationOn] = useState(true)

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

  const colorsSmooth = "transition-colors duration-100";

  useEffect(() => {
    console.clear();
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://maramowicz.dev/azapi/database.json');
        if (!response.ok) throw new Error("Nie udało się pobrać danych");
        const jsonData: MajorTypes[] = await response.json();
        const filteredData = jsonData.filter((major: MajorTypes) => {
          return major.doc_type !== -1 && major.doc_type !== -2;
        });

        setFirstTryFetchingData(filteredData);
      } catch (error) {
        console.error(error);
        setFirstTryFetchingData(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  function returnToMenu() {
    setChosenAction(null);
  }

  function getAction() {
    if (chosenAction != null) {
      switch (chosenAction) {
        case 0:
          return (
            <DynamicSearch
              searchType="place"
              returnToMenu={returnToMenu}
              firstTryFetchingData={firstTryFetchingData}
            />
          );
        case 1:
          return (
            <DynamicSearch
              searchType="teacher"
              returnToMenu={returnToMenu}
              firstTryFetchingData={firstTryFetchingData}
            />
          );
        case 2:
          return (
            <MajorSchedule
              returnToMenu={returnToMenu}
              firstTryFetchingData={firstTryFetchingData}
            />
          );
      }
    }
  }

  function ListEl({ mainTask, taskDesc, index }: { mainTask: string, taskDesc: string, index: number }) {
    return (
      <>
        {animationOn ? (
          <motion.li
            initial={{ opacity: 0, translateY: 30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
              delay: index / 2 + 1.3
            }}
            onClick={() => setChosenAction(index)}
            title={taskDesc}
            className={`relative md:w-52 lg:w-72 flex items-center flex-col gap-2 text-center px-4 py-1.5 md:py-5 rounded-full md:rounded-xl shadow-[0px_2px_10px_2px_rgb(125,125,125)] dark:shadow-[0px_2px_10px_2px_rgb(10,10,10)] hover:bg-gray-200/75 dark:hover:bg-gray-800/50 cursor-pointer ${colorsSmooth}`}
          >
            <span className="font-bold md:text-xl text-black dark:text-white">{mainTask}</span>
            {index === 2 && (
              <span className="absolute top-2 md:top-10 pointer-events-none text-yellow-500 md:text-4xl font-bold rotate-12 rounded-sm bg-gray-900 px-3">
                Rozwijane
              </span>
            )}
            <p className="hidden md:block w-55 text-xs md:text-sm md:leading-[19px
            lg:text-lg lg:leading-[24px] text-gray-600 dark:text-gray-400">{taskDesc}</p>
          </motion.li>
        ) : (
          <li
            onClick={() => setChosenAction(index)}
            title={taskDesc}
            className={`relative md:w-52 lg:w-72 flex items-center flex-col gap-2 text-center px-4 py-1.5 md:py-5 rounded-full md:rounded-xl shadow-[0px_2px_10px_2px_rgb(125,125,125)] dark:shadow-[0px_2px_10px_2px_rgb(10,10,10)] hover:bg-gray-200/75 dark:hover:bg-gray-800/50 cursor-pointer ${colorsSmooth}`}
          >
            <span className="font-bold md:text-xl text-black dark:text-white">{mainTask}</span>
            {index === 2 && (
              <span className="absolute top-2 md:top-10 pointer-events-none text-yellow-500 md:text-4xl font-bold rotate-12 rounded-sm bg-gray-900 px-3">
                Rozwijane
              </span>
            )}
            <p className="hidden md:block w-55 text-xs md:text-sm md:leading-[19px
            lg:text-lg lg:leading-[24px] text-gray-600 dark:text-gray-400">{taskDesc}</p>
          </li>
        )}
      </>
    );
  }

  return (
    <>
      {chosenAction == null &&
        <div className="h-[92vh] sm:h-screen flex items-center justify-center flex-col gap-16 md:gap-24 lg:gap-32 overflow-hidden">
          <Head>
            <title>AZ Essentials</title>
          </Head>
          <label className="absolute top-3 right-5 inline-block h-6 w-14 md:border-2 md:border-gray-200 md:dark:border-gray-700 rounded-full" htmlFor="checkbox">
            <input
              className='hidden'
              type="checkbox"
              id="checkbox"
              onChange={() => updateAnimationPreference()}
            />
            <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 rounded-full transition-colors duration-300 group">
              <span className='absolute -left-[5.5rem] -top-1 md:top-7 md:-left-7 w-20 md:w-24 text-xs md:text-sm leading-3 md:leading-4 text-center text-gray-600 dark:text-gray-200 md:opacity-0 md:group-hover:opacity-100 md:-translate-y-4 group-hover:translate-y-0 transition-all duration-100 delay-500 bg-gray-200 dark:bg-gray-800/75 px-1 py-1 rounded-md'>
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
          {animationOn ? (
            <motion.div
              initial={{
                opacity: 0,
                translateY: 50,
              }}
              animate={{
                opacity: 1,
                translateY: 0,
              }}
              transition={{
                duration: 1,
                ease: "easeOut",
              }}
              className={`text-2xl md:text-3xl lg:text-5xl text-center shadow-[0px_2px_10px_2px_rgb(125,125,125)] dark:shadow-[0px_2px_10px_2px_rgb(10,10,10)] text-black dark:text-white bg-white dark:bg-slate-900 px-4 py-1.5 md:py-3 lg:py-5 rounded-xl z-10 ${colorsSmooth}`}>
              Witam w
              <br />
              <b>AZ Essentials</b>
            </motion.div>
          ) : (
            <div
              className={`text-2xl md:text-3xl lg:text-5xl text-center shadow-[0px_2px_10px_2px_rgb(125,125,125)] dark:shadow-[0px_2px_10px_2px_rgb(10,10,10)] text-black dark:text-white bg-white dark:bg-slate-900 px-4 py-1.5 md:py-3 lg:py-5 rounded-xl z-10`}
            >
              Witam w
              <br />
              <b>AZ Essentials</b>
            </div>
          )}
          <div className="flex items-center flex-col gap-1 lg:gap-5">
            {animationOn ? (
              <motion.span
                initial={{
                  opacity: -1,
                  translateY: 50,
                }}
                animate={{
                  opacity: 1,
                  translateY: 0
                }}
                transition={{
                  duration: 0.5,
                  ease: "linear",
                  delay: 0.75
                }}
                className={`text-black dark:text-white md:text-xl lg:text-2xl`}>
                Co chcesz zrobić?
              </motion.span>
            ) : (
              <span
                className={`text-black dark:text-white md:text-xl lg:text-2xl`}>
                Co chcesz zrobić?
              </span>
            )}
            <ul
              className={`flex flex-col md:flex-row gap-5 py-3 pr-1 ${colorsSmooth}`}>
              <ListEl mainTask="Wyświetl info o sali" taskDesc="Podaj numer sali, dzień i godzinę, aby sprawdzić, jakie zajęcia się odbędą." index={0} />
              <ListEl mainTask="Znajdź wykładowcę" taskDesc="Podaj imię, dzień i godzinę, aby zobaczyć, gdzie dany wykładowca ma zajęcia." index={1} />
              <ListEl mainTask="Sprawdź plan zajęć" taskDesc="Wybierz kierunek i dzień, aby zobaczyć listę przyszłych zajęć." index={2} />
            </ul>
          </div>
          {animationOn ? (

            <motion.span
              initial={{
                opacity: 0
              }}
              animate={{
                opacity: isLoading ? [0, 1, 0, 1] : 1
              }}
              transition={{
                duration: 2,
                ease: 'linear'
              }}
              className="absolute bottom-3 md:bottom-2 text-gray-500">
              {isLoading && "Pobieranie danych..."}
              {!isLoading && firstTryFetchingData && "Dane pobrano pomyślnie."}
              {!isLoading && firstTryFetchingData === null && "Nie udało się pobrać danych."}
            </motion.span>
          ) : (
            <span
              className="absolute bottom-3 md:bottom-2 text-gray-500">
              {isLoading && "Pobieranie danych..."}
              {!isLoading && firstTryFetchingData && "Dane pobrano pomyślnie."}
              {!isLoading && firstTryFetchingData === null && "Nie udało się pobrać danych."}
            </span>
          )}
        </div>
      }
      {getAction()}
    </>
  );
}

export default Index;
