import Head from "next/head";
import DynamicSearch from "@/components/DynamicSearch";
import { useState } from "react";
import { motion } from 'framer-motion';

function Index() {
  const [chosenAction, setChosenAction] = useState<number | null>(null);
  const colorsSmooth = "trasition-colors duration-200";


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

  function ListEl({ mainTask, taskDesc, index }: { mainTask: string, taskDesc: string, index: number }) {
    return (
      <motion.li
        // initial={{ opacity: 0, translateY: 30 }}
        // animate={{ opacity: 1, translateY: 0 }}
        // transition={{
        //   duration: 1,
        //   ease: "easeInOut",
        //   delay: index + 2
        // }}
        onClick={() => setChosenAction(index)}
        title={taskDesc}
        className={`relative md:w-52 lg:w-72 flex items-center flex-col gap-2 text-center px-4 py-1.5 md:py-5 rounded-xl shadow-[0px_2px_10px_2px_rgb(225,225,225)] dark:shadow-[0px_2px_10px_2px_rgb(10,10,10)] transition-colors duration-500 hover:bg-gray-100 dark:hover:bg-gray-800/50 ${index == 2 ? "cursor-not-allowed pointer-events-none" : "cursor-pointer"}  ${colorsSmooth}`}
      >
        <span className="font-bold md:text-xl text-black dark:text-white transition-colors duration-100">{mainTask}</span>
        {index === 2 && (
          <span className="absolute top-2 md:top-10 pointer-events-none text-red-500 md:text-4xl font-bold rotate-12 rounded-md">
            Niedostępne
          </span>
        )}
        <p className="hidden md:block w-55 text-xs md:text-sm md:leading-[19px] lg:text-lg lg:leading-[24px] text-gray-600 dark:text-gray-400">{taskDesc}</p>
      </motion.li>
    );
  }

  return (
    <>
      {chosenAction == null &&
        <div className="h-[92vh] sm:h-screen flex items-center justify-center flex-col gap-16 md:gap-24 lg:gap-32 overflow-y-hidden">
          <Head>
            <title>AZ Essentials</title>
          </Head>
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
            className={`text-2xl md:text-3xl lg:text-5xl text-center shadow-[0px_2px_10px_2px_rgb(225,225,225)] dark:shadow-[0px_2px_10px_2px_rgb(10,10,10)] text-black dark:text-white bg-white dark:bg-slate-900 px-4 py-1.5 md:py-3 lg:py-5 rounded-lg z-10  ${colorsSmooth}`}
          >
            Witam w
            <br />
            <b>AZ Essentials</b>
          </motion.div>
          <div className="flex items-center flex-col gap-1 lg:gap-5">
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
                duration: 1,
                ease: "linear",
                delay: 1
              }}
              className={`text-black dark:text-white md:text-xl lg:text-2xl ${colorsSmooth}`}>
              Co chcesz zrobić?
            </motion.span>
            <ul
              className={` flex flex-col md:flex-row gap-5 py-3 pr-1 ${colorsSmooth}`}>
              <ListEl mainTask="Wyświetl info o sali" taskDesc="Podaj numer sali, dzień i godzinę, aby sprawdzić, jakie zajęcia się odbędą." index={0} />
              <ListEl mainTask="Znajdź wykładowcę" taskDesc="Podaj imię, dzień i godzinę, aby zobaczyć, gdzie dany wykładowca ma zajęcia." index={1} />
              <ListEl mainTask="Sprawdź plan zajęć" taskDesc="Wybierz kierunek i dzień, aby zobaczyć listę przyszłych zajęć." index={2} />
            </ul>
          </div>
        </div>
      }
      {getAction()}
    </>
  );
}

export default Index;
