import Head from "next/head";
import DynamicSearch from "@/components/DynamicSearch";
import { useEffect, useState } from "react";
import { motion } from 'framer-motion';

function Index() {
  const [chosenAction, setChosenAction] = useState<number | null>(null);
  const [showAnimation, setShowAnimation] = useState<boolean>(false);
  const colorsSmooth = "trasition-colors duration-200";

  useEffect(() => {
    sessionStorage.removeItem('hasSeenAnimation');

    const hasSeenAnimation = sessionStorage.getItem('hasSeenAnimation');
    if (!hasSeenAnimation) {
      setShowAnimation(true);
    } else {
      setShowAnimation(false);
    }
  }, []);

  const handleAnimationComplete = () => {
    sessionStorage.setItem('hasSeenAnimation', 'true');
    setShowAnimation(false);
  };

  function returnToMenu() {
    setChosenAction(null);
  }

  // setTimeout(() => {
  //   location.reload()
  // }, 5000)

  function getAction() {
    if (chosenAction != null) {
      switch (chosenAction) {
        case 0:
          return (
            <DynamicSearch
              searchType="place"
              returnToMenu={returnToMenu}
            />
          );
        case 1:
          return (
            <DynamicSearch
              searchType="teacher"
              returnToMenu={returnToMenu}
            />
          );
        case 2:
          console.log("Lol 2");
          break;
      }
    }
  }

  function ListEl({ mainTask, taskDesc, index }: { mainTask: string, taskDesc: string, index: number | null }) {
    const interStyles = "hover:scale-105 active:scale-95 transition-transform duration-150";
    return (
      <li onClick={() => setChosenAction(index)} title={taskDesc} className={`relative md:h-32 md:w-52 lg:w-64 flex items-center flex-col gap-2 text-center px-4 py-1.5 md:py-5  rounded-xl shadow-[0px_2px_10px_2px_rgb(225,225,225)] dark:shadow-[0px_2px_10px_2px_rgb(10,10,10)] mx-2 lg:text-2xl ${index == 2 ? "cursor-not-allowed pointer-events-none" : "cursor-pointer"} ${interStyles} ${colorsSmooth}`}>
        <span className="font-bold">
          {mainTask}
        </span>
        {index == 2 && (
          <span className="absolute top-2 md:top-10 pointer-events-none text-red-500 md:text-4xl font-bold rotate-12  rounded-md">
            Niedostępne
          </span>
        )}
        <p className="hidden md:block w-55 text-xs text-gray-600 dark:text-gray-400">
          {taskDesc}
        </p>
      </li>
    );
  }

  return (
    <>
      {chosenAction == null &&
        <div className="h-[92vh] sm:h-screen flex items-center justify-center flex-col gap-10">
          <Head>
            <title>AZ Essentials</title>
          </Head>

          {showAnimation ? (
            <motion.div
              initial={{
                opacity: -1,
                translateY: "275%",
                scale: 1.75
              }}
              animate={{
                opacity: [0, 1],
                translateY: ["275%", "201%", "200%", "200%", "0%"],
                scale: [1.75, 1.9, 1.9, 1]
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                times: [0, 1]
              }}
              onAnimationComplete={handleAnimationComplete}
              className={`text-2xl md:text-3xl text-center shadow-[0px_2px_10px_2px_rgb(225,225,225)] dark:shadow-[0px_2px_10px_2px_rgb(10,10,10)] text-black dark:text-white bg-white dark:bg-slate-900 px-4 py-1.5 rounded-lg z-10 ${colorsSmooth}`}
            >
              Witam w
              <br />
              <b>AZ Essentials</b>
            </motion.div>
          ) : (
            <motion.div
              initial={{
                opacity: 0
              }}
              animate={{
                opacity: 1
              }}
              className={`text-2xl md:text-3xl text-center shadow-[0px_2px_10px_2px_rgb(225,225,225)] dark:shadow-[0px_2px_10px_2px_rgb(10,10,10)] text-black dark:text-white bg-white dark:bg-slate-900 px-4 py-1.5 rounded-lg z-10 ${colorsSmooth}`}>
              Witam w
              <br />
              <b>AZ Essentials</b>
            </motion.div>
          )}
          {!showAnimation ? (
            <motion.div
              initial={{
                opacity: -1,
                translateY: 25,
              }}
              animate={{
                opacity: 1,
                translateY: 0,
              }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="flex items-center flex-col lg:gap-1"
            >
              <span className={`text-black dark:text-white md:text-xl ${colorsSmooth}`}>
                Co chcesz zrobić?
              </span>
              <ul
                className={`text-black dark:text-white flex flex-col md:flex-row gap-5 overflow-y-auto custom-scrollbar py-3 pr-1 ${colorsSmooth}`}>
                <ListEl mainTask="Sprawdź plan zajęć" taskDesc="Wybierz kierunek i dzień, aby zobaczyć listę przyszłych zajęć." index={2} />
                <ListEl mainTask="Znajdź wykładowcę" taskDesc="Podaj imię, dzień i godzinę, aby zobaczyć, gdzie dany wykładowca ma zajęcia." index={1} />
                <ListEl mainTask="Kto jest w sali?" taskDesc="Podaj numer sali, dzień i godzinę, aby sprawdzić, jakie zajęcia się odbędą." index={0} />
              </ul>
            </motion.div>
          ) : (
            <motion.div
              className="flex items-center flex-col lg:gap-1"
            >
              <span className={`text-black dark:text-white md:text-xl ${colorsSmooth}`}>
                Co chcesz zrobić?
              </span>
              <ul
                className={`text-black dark:text-white flex flex-col md:flex-row gap-5 overflow-y-auto custom-scrollbar py-3 pr-1 ${colorsSmooth}`}>
                <ListEl mainTask="Sprawdź plan zajęć" taskDesc="Wybierz kierunek i dzień, aby zobaczyć listę przyszłych zajęć." index={2} />
                <ListEl mainTask="Znajdź wykładowcę" taskDesc="Podaj imię, dzień i godzinę, aby zobaczyć, gdzie dany wykładowca ma zajęcia." index={1} />
                <ListEl mainTask="Kto jest w sali?" taskDesc="Podaj numer sali, dzień i godzinę, aby sprawdzić, jakie zajęcia się odbędą." index={0} />
              </ul>
            </motion.div>
          )}

        </div>
      }
      {getAction()}
    </>
  );
}

export default Index;
