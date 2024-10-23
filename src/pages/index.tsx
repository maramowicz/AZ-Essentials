import Head from "next/head";
import DynamicSearch from "@/components/DynamicSearch";
import { useState } from "react";

// Todo: Szukanie kto ma zajęcia ✅
// Todo: Szukanie wykładowcy ✅
// Todo: Podgląd uczelni ❌
// Todo: Jakie sale są wolne ❌
// Todo: Wyświetlenie planu lekcji danego kierunku z danego dnia ❌
// Todo: Możliwość zobaczenia planu wykładowcy❌
console.clear();

function Index() {
  const [chosenAction, setChosenAction] = useState<number | null>(null)
  const colorsSmooth = "trasition-colors duration-200"

  function returnToMenu() {
    setChosenAction(null)
  }

  function getAction() {
    if (chosenAction != null) {
      switch (chosenAction) {
        case 0:
          console.log("No dawaj");
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
    const interStyles = "hover:scale-105 active:scale-95 transition-transform duration-150"
    return (
      <li onClick={() => setChosenAction(index)} title={taskDesc} className={`relative md:h-[7.5rem] flex items-center flex-col gap-2 text-center px-2 py-2 md:py-5 border border-gray-300 dark:border-gray-700 rounded-xl shadow-md shadow-gray-300 dark:shadow-black mx-2 ${index == 2 ? "cursor-not-allowed pointer-events-none" : "cursor-pointer"} ${interStyles}`}>
        <span className="font-bold">
          {mainTask}
        </span>
        {index == 1 && (
          <span className="absolute -top-2 pointer-events-none text-yellow-500 font-bold">Work in progress</span>
        )}
        {index == 2 && (
          <span className="absolute -top-2 pointer-events-none text-red-500 font-bold">Not available</span>
        )}
        <p className="hidden md:block w-56 text-xs">
          {taskDesc}
        </p>
      </li>
    )
  }

  return (
    <>
      {chosenAction == null &&
        <div className="h-[92vh] sm:h-screen flex items-center justify-center flex-col gap-10">
          <Head>
            <title>AZ Essentials</title>
          </Head>
          <div className={`text-2xl text-center border-2 shadow-md text-black dark:text-white px-4 py-1.5 rounded-lg ${colorsSmooth}`}>
            Witam w
            <br />
            <b>
              {/* Todo: błysk po najechaniu na napis */}
              AZ Essentials
            </b>
          </div>
          <div className="flex items-center flex-col gap-2">
            <span className={`text-black dark:text-white ${colorsSmooth}`}>
              Co chcesz zrobić?
            </span>
            <ul className={`text-black dark:text-white flex flex-col md:flex-row gap-5 overflow-y-auto custom-scrollbar py-3 pr-1 ${colorsSmooth}`}>
              <ListEl mainTask="Znajdź wykładowce" taskDesc="Podaj imię, dzień tygodnia oraz godzinę, aby znaleźć w której sali powinien mieć zajęcia." index={1} />
              <ListEl mainTask="Sprawdź plan lekcji" taskDesc="Podaj nazwę kierunku i dzień, aby zobaczyć jakie zajęcia się odbędą" index={2} />
              <ListEl mainTask="Kto jest w sali?" taskDesc="Podaj numer pomieszczenia, dzień tygodnia oraz godzinę, aby sprawdzić, kto w danej sali ma lekcje." index={0} />
            </ul>
          </div>
        </div>
      }
      {getAction()}
    </>

  )
};

export default Index;