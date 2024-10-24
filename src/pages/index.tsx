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
      <li onClick={() => setChosenAction(index)} title={taskDesc} className={`relative md:h-[7.5rem] flex items-center flex-col gap-2 text-center px-2 py-2 md:py-5 border border-gray-300 dark:border-gray-700 rounded-xl shadow-md shadow-gray-300 dark:shadow-black mx-2 ${index == 2 ? "cursor-not-allowed pointer-events-none" : "cursor-pointer"} ${interStyles}`}>
        <span className="font-bold">
          {mainTask}
        </span>
        {index == 2 && (
          <span className="absolute -top-2 pointer-events-none text-red-500 font-bold">Not available</span>
        )}
        <p className="hidden md:block w-55 text-xs">
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
                opacity: 0,
                translateY: "350%",
                scale: 1.75
              }}
              animate={{
                opacity: [0, 1],
                translateY: ["350%", "200%", "197%", "200%", "190%", "0%"],
                scale: [1.75, 2, 2, 1]
              }}
              transition={{
                duration: 5,
                ease: "easeInOut",
                times: [0, 1]
              }}
              onAnimationComplete={handleAnimationComplete}
              className={`text-2xl text-center border-2 shadow-md text-black dark:text-white px-4 py-1.5 rounded-lg bg-slate-900 z-10`}
            >
              Witam w
              <br />
              <b>AZ Essentials</b>
            </motion.div>
          ) : (
            <div className={`text-2xl text-center border-2 shadow-md text-black dark:text-white px-4 py-1.5 rounded-lg bg-slate-900 z-10`}>
              Witam w
              <br />
              <b>AZ Essentials</b>
            </div>
          )}
          {!showAnimation ? (
            <motion.div
              initial={{
                opacity: 0,
                translateY: 25,
              }}
              animate={{
                opacity: 1,
                translateY: 0,
              }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="flex items-center flex-col gap-2"
            >
              <span className={`text-black dark:text-white ${colorsSmooth}`}>
                Co chcesz zrobić?
              </span>
              <ul
                className={`text-black dark:text-white flex flex-col md:flex-row gap-5 overflow-y-auto custom-scrollbar py-3 pr-1 ${colorsSmooth}`}>
                <ListEl mainTask="Znajdź wykładowce" taskDesc="Podaj imię, dzień tygodnia oraz godzinę, aby znaleźć w której sali powinien mieć zajęcia." index={1} />
                <ListEl mainTask="Sprawdź plan lekcji" taskDesc="Podaj nazwę kierunku i dzień, aby zobaczyć jakie zajęcia się odbędą" index={2} />
                <ListEl mainTask="Kto jest w sali?" taskDesc="Podaj numer pomieszczenia, dzień tygodnia oraz godzinę, aby sprawdzić, kto w danej sali ma lekcje." index={0} />
              </ul>
            </motion.div>
          ) : (
            <motion.div
              className="flex items-center flex-col gap-2"
            >
              <span className={`text-black dark:text-white ${colorsSmooth}`}>
                Co chcesz zrobić?
              </span>
              <ul
                className={`text-black dark:text-white flex flex-col md:flex-row gap-5 overflow-y-auto custom-scrollbar py-3 pr-1 ${colorsSmooth}`}>
                <ListEl mainTask="Znajdź wykładowce" taskDesc="Podaj imię, dzień tygodnia oraz godzinę, aby znaleźć w której sali powinien mieć zajęcia." index={1} />
                <ListEl mainTask="Sprawdź plan lekcji" taskDesc="Podaj nazwę kierunku i dzień, aby zobaczyć jakie zajęcia się odbędą" index={2} />
                <ListEl mainTask="Kto jest w sali?" taskDesc="Podaj numer pomieszczenia, dzień tygodnia oraz godzinę, aby sprawdzić, kto w danej sali ma lekcje." index={0} />
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
