// Todo: animacje tylko przy 1 otworzeniu strony
import DynamicSearch from "@/components/DynamicSearch";
import { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import MajorSchedule from "@/components/MajorSchedule";
import { MajorTypes } from '@/types/type';
import { FaPersonCircleQuestion, FaCalendarDays, FaDoorOpen } from '@/assets/icons'
import { IconType } from "react-icons";

function Index() {
  const [chosenAction, setChosenAction] = useState<number | null>(null);
  const [firstTryFetchingData, setFirstTryFetchingData] = useState<MajorTypes[] | null>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [animationOn, setAnimationOn] = useState<boolean>(true)

  const handleAnimationEnd = () => {
    setAnimationOn(false);
    sessionStorage.setItem("azAnim", 'false');
  };

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

  function ListEl({ icon: Icon, mainTask, taskDesc, index }: { icon: IconType, mainTask: string, taskDesc: string, index: number }) {
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
            onAnimationComplete={() => index == 2 && handleAnimationEnd()}
            onClick={() => setChosenAction(index)}
            title={taskDesc}
            className={`relative md:w-52 lg:w-72 flex items-center flex-row md:flex-col gap-2 text-center px-4 py-1.5 md:py-5 rounded-full md:rounded-xl transition-shadow duration-1000 delay-500 dark:duration-1000 dark:delay-100 shadow-[0px_3px_3px_1px_rgb(225,225,225)] dark:shadow-[0px_3px_3px_1px_rgb(10,10,10)] hover:bg-gray-200/75 dark:hover:bg-gray-800/50 cursor-pointer ${colorsSmooth}`}
          >
            <Icon className={`text-2xl md:text-3xl text-black dark:text-white ${colorsSmooth}`} />
            <span className="font-bold md:text-xl text-black dark:text-white">{mainTask}</span>
            {index === 2 && (
              <span className="absolute -translate-y-1/2 top-1/2 left-1/2 -translate-x-1/2 pointer-events-none text-yellow-500 md:text-4xl font-bold rotate-12 rounded-sm bg-gray-900 px-3">
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
            className={`relative md:w-52 lg:w-72 flex items-center flex-row md:flex-col gap-2 text-center px-4 py-1.5 md:py-5 rounded-full md:rounded-xl transition-shadow duration-1000 delay-500 dark:duration-1000 dark:delay-100 shadow-[0px_3px_3px_1px_rgb(225,225,225)] dark:shadow-[0px_3px_3px_1px_rgb(10,10,10)] hover:bg-gray-200/75 dark:hover:bg-gray-800/50 cursor-pointer ${colorsSmooth}`}
          >
            <Icon className={`text-2xl md:text-3xl text-black dark:text-white ${colorsSmooth}`} />
            <span className="font-bold md:text-xl text-black dark:text-white">{mainTask}</span>
            {index === 2 && (
              <span className="absolute -translate-y-1/2 top-1/2 left-1/2 -translate-x-1/2 pointer-events-none text-yellow-500 md:text-4xl font-bold rotate-12 rounded-sm bg-gray-900 px-3">
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
          {/* Todo: Pokaż za pomocą procentów poprawność danych */}
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
              className={`text-2xl md:text-3xl lg:text-5xl text-center text-black dark:text-white ${colorsSmooth}`}>
              Witam w
              <br />
              <b>AZ Essentials</b>
            </motion.div>
          ) : (
            <div
              className={`text-2xl md:text-3xl lg:text-5xl text-center text-black dark:text-white`}
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
              <ListEl icon={FaDoorOpen} mainTask="Wyświetl info o sali" taskDesc="Podaj numer sali, dzień i godzinę, aby sprawdzić, jakie zajęcia się odbędą." index={0} />
              <ListEl icon={FaPersonCircleQuestion} mainTask="Znajdź wykładowcę" taskDesc="Podaj imię, dzień i godzinę, aby zobaczyć, gdzie dany wykładowca ma zajęcia." index={1} />
              <ListEl icon={FaCalendarDays} mainTask="Sprawdź plan zajęć" taskDesc="Wybierz kierunek i dzień, aby zobaczyć listę przyszłych zajęć." index={2} />
            </ul>
          </div>
          {animationOn ? (
            <motion.span
              initial={{
                opacity: 0
              }}
              animate={{
                opacity: isLoading ? [0, 1, 0, 0.75] : 0.5
              }}
              transition={{
                duration: 2,
                ease: 'linear'
              }}
              className="absolute -bottom-0.5 md:bottom-1 text-gray-500 opacity-50">
              {isLoading && "Pobieranie danych..."}
              {!isLoading && firstTryFetchingData && "Dane pobrano pomyślnie."}
              {!isLoading && firstTryFetchingData === null && "Nie udało się pobrać danych."}
            </motion.span>
          ) : (
            <span
              className="absolute -bottom-0.5 md:bottom-1 text-gray-500 opacity-50">
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