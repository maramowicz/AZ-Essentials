import Head from "next/head";
import PlaceInfo from '@/components/PlaceInfo'
import { useState } from "react";
// Todo: Szukanie kto ma zajęcia ✅
// Todo: Szukanie wykładowcy ❌
// Todo: Podgląd uczelni ❌
// Todo: Jakie sale są wolne ❌
// Todo: Wyświetlenie planu lekcji danego kierunku z danego dnia ❌

function Index() {
  const [chosenAction, setChosenAction] = useState<number | null>(null)

  function returnToMenu() {
    setChosenAction(null)
  }

  function getAction() {
    if (chosenAction != null) {
      switch (chosenAction) {
        case 0:
          console.log("No dawaj");

          return <PlaceInfo returnToMenu={returnToMenu} />
          break;
        case 1:
          console.log("Lol 1");

          break;
        case 2:
          console.log("Lol 2");

          break;
      }
    }
  }

  function ListEl({ mainTask, taskDesc, index }: { mainTask: string, taskDesc: string, index: number | null }) {
    const interStyles = "hover:scale-105 active:scale-95 transition-all duration-150"
    return (
      <li onClick={() => setChosenAction(index)} title={taskDesc} className={`md:h-[7.5rem] flex items-center flex-col gap-2 text-center px-2 py-2 md:py-5 border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg shadow-gray-300 dark:shadow-black ${interStyles} mx-2 cursor-pointer`}>
        <span className="font-bold">
          {mainTask}
        </span>
        <p className="hidden md:block w-56 text-xs">
          {taskDesc}
        </p>
      </li>
    )
  }

  return (
    <>
      {chosenAction == null &&
        <div className="h-[92vh] sm:h-screen border flex items-center justify-center flex-col gap-10">
          <Head>
            <title>AZ Essentials</title>
          </Head>
          <div className="text-2xl text-center border-2 shadow-md text-black dark:text-white px-2 rounded-lg font-semibold">
            Witam w
            <br />
            AZ Essentials
          </div>
          <div className="flex items-center flex-col gap-2">
            <span className="text-black dark:text-white">
              Co chcesz zrobić?
            </span>
            <ul className="text-black dark:text-white flex flex-col md:flex-row gap-5 overflow-y-auto custom-scrollbar py-3 pr-1">
              <ListEl mainTask="Kto jest w sali?" taskDesc="Podaj numer pomieszczenia, dzień tygodnia oraz godzinę, aby sprawdzić, kto w danej sali ma lekcje." index={0} />
              <ListEl mainTask="Znajdź wykładowce" taskDesc="Podaj imię, dzień tygodnia oraz godzinę, aby znaleźć w której sali powinien mieć zajęcia." index={null} />
              <ListEl mainTask="Sprawdź plan lekcji" taskDesc="Podaj nazwę kierunku i dzień, aby zobaczyć jakie zajęcia się odbędą" index={null} />
            </ul>
          </div>
        </div>
      }
      {getAction()}
    </>

  )
};

export default Index;