// Todo: Szukanie kto ma zajęcia ✅
// Todo: Szukanie wykładowcy ❌
// Todo: Podgląd uczelni ❌
// Todo: Jakie sale są wolne ❌
// Todo: Wyświetlenie planu lekcji danego kierunku z danego dnia ❌
import React, { useState, useEffect } from 'react';
import data from '../../public/database.json';
import Sun from '../../public/sun-regular.svg';
import Moon from '../../public/moon-regular.svg';
import Head from 'next/head';
import { useTheme } from "next-themes";
import ErrorModal from './ErrorModal';

interface Lesson {
  place: string;
  name: string;
  start_minute: number;
  end_minute: number;
  duration: number;
  whatever: string;
  type: string;
  teacher: string;
  subject: string;
  dates: string[];
}

interface kierunekTypes {
  degree: string | null;
  doc_type: number;
  groups: string[];
  name: string | null;
  plan: Lesson[][];
  semester: string | null;
  type: string | null;
  year: number | null;
}

const Index = () => {
  const [placeSuggestions, setPlaceSuggestions] = useState<string[]>([]);
  const [hourSuggestions, setHourSuggestions] = useState<string[]>([]);
  const [placeInput, setPlaceInput] = useState<string>('');
  const [dayInput, setDayInput] = useState<string>('');
  const [hoursInput, setHoursInput] = useState<string>('');
  const [results, setResults] = useState<Lesson[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const optionsStyle = "text-3xl px-2 py-1 md:text-lg text-black dark:text-white bg-gray-400 dark:bg-gray-700 rounded-sm outline-none focus:border-gray-900 dark:focus:border-gray-400 border-2 border-transparent hover:scale-[1.05] transition-transform duration-150 cursor-pointer"

  const days = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek'];

  useEffect(() => {
    console.clear();
    setPlaceInput("");
    setDayInput("");
    setHoursInput("");

    const placeSet = new Set<string>();

    Object.entries(data).forEach((kierunek) => {
      const kierunekData = kierunek[1] as kierunekTypes;
      kierunekData.plan.forEach((day) => {
        if (day) {
          Object.entries(day).forEach(([, lekcja]) => {
            const lesson = lekcja as Lesson;
            placeSet.add(lesson.place);
          });
        }
      });
    });

    setPlaceSuggestions(Array.from(placeSet));
  }, []);

  function fetchPlace(place: string): (Lesson | string | null)[][] | null {
    const placeSet: (Lesson | string | null)[][] = [];
    setPlaceInput(place);

    if (place.length >= 4) {
      for (const [, kierunek] of Object.entries(data)) {
        const kierunekData = kierunek as kierunekTypes;
        kierunekData.plan.forEach((day, dayIndex) => {
          if (day.length > 0) {
            for (const [, lekcja] of Object.entries(day)) {
              const lesson = lekcja as Lesson;
              if (lesson.place === place) {
                placeSet.push([lesson, days[dayIndex]]);
              }
            }
          }
        });
      }

      if (placeSet.length > 0) {
        return placeSet;
      }
    }

    return null;
  }

  function fetchDay(dayInput: string): Lesson[] | null {
    const lessonDetails: Lesson[] = [];
    const hoursSuggestions = new Set<string>();
    setDayInput(dayInput);

    if (placeInput.length > 2 && dayInput.length > 2) {
      const lessons = fetchPlace(placeInput);

      if (lessons) {
        lessons.forEach((lesson) => {
          const [details, day] = lesson as [Lesson, string];
          if (day === dayInput) {
            lessonDetails.push(details);
            const startTime = `${Math.floor(details.start_minute / 60)}:${details.start_minute % 60 === 0 ? '00' : details.start_minute % 60}`;
            hoursSuggestions.add(startTime);
          }
        });

        if (lessonDetails.length > 0) {
          const sortedHours = Array.from(hoursSuggestions).sort((a, b) => {
            const [aHours, aMinutes] = a.split(':').map(Number);
            const [bHours, bMinutes] = b.split(':').map(Number);
            return aHours * 60 + aMinutes - (bHours * 60 + bMinutes);
          });

          setHourSuggestions(sortedHours);
          return lessonDetails;
        }
      } else {
        alert("Nie ma żadnych lekcji");
      }
    }
    return null;
  }

  function fetchHours(timeInput: string) {
    setHoursInput(timeInput);

    if (timeInput.length >= 4) {

      const lessonsData: Lesson[] | null = fetchDay(dayInput);
      const [hours, minutes] = timeInput.split(':').map(Number);
      const totalMinutes = hours * 60 + minutes;

      const matchedLessons = lessonsData?.filter(lesson => {
        return typeof lesson === 'object' && lesson.start_minute === totalMinutes;
      }) as Lesson[];

      setResults(matchedLessons || []);
      return totalMinutes;
    }
  }

  function handleCheck() {
    const errorMessages: string[] = [];

    if (!placeInput && !dayInput && !hoursInput) {
      errorMessages.push("Proszę wypełnić wszystkie pola.");
    } else if (!placeInput) {
      errorMessages.push("Proszę wybrać sale.");
    } else if (!dayInput) {
      errorMessages.push("Proszę wybrać dzień.");
    } else if (!hoursInput) {
      errorMessages.push("Proszę wybrać godzine.");
    }

    if (errorMessages.length > 0) {
      setErrorMessage(errorMessages.join("\n"));
      return;
    }

    if (results.length > 0) {
      setShowResults(true);
    } else {
      setErrorMessage("Nie znaleziono wykładu dla podanych danych");
    }
  }

  function goBack() {
    setShowResults(false);
    setResults([]);
    setDayInput("");
    setHoursInput("");
    setPlaceInput("");
  }

  function closeErrorModal() {
    setErrorMessage(null);
  }

  function formatResult() {
    function formatTime(time: number) {
      return `${Math.floor(time / 60)}:${time % 60 === 0 ? '00' : time % 60 < 10 ? '0' + (time % 60) : time % 60}`;
    }

    const paddingTop = `${results.length * 1.25}rem`;

    return (
      <div className="h-[93vh] flex items-center justify-center">
        <ul className={`relative -top-5 sm:top-0 h-3/4 flex items-center justify-center flex-col gap-2 overflow-y-auto overflow-x-hidden px-1.5 pb-1.5 custom-scrollbar`} style={{ paddingTop }}>
          {results.map((lesson, index) => (
            <li key={index} className='w-[21rem] border-2 border-gray-500 text-center dark:border-slate-600 text-black dark:text-white bg-gray-200 dark:bg-black rounded-lg flex items-center flex-col py-3 mr-1 text-2xl shadow-md shadow-gray-400 dark:shadow-gray-800 transition-all hover:scale-[1.03] duration-100'>
              <span>{dayInput} {lesson.place}</span>
              <span>
                {formatTime(lesson.start_minute)} - {formatTime(lesson.end_minute)}
              </span>
              <b>{lesson.subject}</b>
              <span className='font-bold'>{lesson.teacher}</span>
              <span>
                {lesson.type} {lesson.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className='bg-gray-100 dark:bg-gray-950 transition-colors duration-1000'>
      <Head>
        <title>Kto ma w ...?</title>
      </Head>
      {showResults && results.length > 0 && (
        <button className='relative top-2 sm:top-1 text-black dark:text-white border-2 border-black dark:border-white rounded-md text-2xl md:text-lg px-4 md:px-3 mt-2 ml-2 hover:scale-105 active:scale-95 transition-transform duration-150' onClick={goBack}>Wróć</button>
      )}
      {!showResults && (
        <div className="h-screen flex items-center justify-center flex-col gap-5">
          <div className='bg-gray-400/50 dark:bg-gray-800/75 rounded-xl py-7 px-4 flex items-center justify-center flex-col gap-2'>
            <input
              type="text"
              placeholder="Sala: xyz A"
              className={`w-52 text-4xl sm:text-2xl text-black dark:text-white bg-gray-400 dark:bg-gray-700 pl-2 rounded-sm outline-none focus:border-gray-400 border-2 border-transparent placeholder:text-gray-300 dark:placeholder:text-gray-400 hover:scale-[1.05] transition-transform duration-150`}
              list="placeSuggestions"
              value={placeInput}
              onChange={(e) => fetchPlace(e.target.value)}
            />
            {placeInput.length > 1 && (
              <datalist id="placeSuggestions">
                {placeSuggestions.map((item, i) => (
                  <option key={i} value={item} />
                ))}
              </datalist>
            )}
            <select className={optionsStyle} onChange={(e) => fetchDay(e.target.value)}>
              <option hidden>Wybierz dzień</option>
              {days.map((day, i) => (
                <option key={i} value={day}>{day}</option>
              ))}
            </select>
            <select className={optionsStyle} onChange={(e) => fetchHours(e.target.value)}>
              <option hidden>Wybierz godzine</option>
              {hourSuggestions.map((hour, i) => (
                <option key={i} value={hour}>Od {hour}</option>
              ))}
            </select>
          </div>
          <button
            className="text-3xl px-5 py-1 rounded-lg border-2 border-gray-300 dark:border-gray-500 focus:border-black focus:scale-[1.1] text-black dark:text-white bg-gray-200 dark:bg-gray-700 transition-all duration-150 hover:scale-105 active:scale-95"
            onClick={handleCheck}
          >
            Sprawdź
          </button>
        </div>
      )}

      {showResults && results.length > 0 && (
        formatResult()
      )}

      {errorMessage && (
        <ErrorModal message={errorMessage} onClose={closeErrorModal} />
      )}

      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="absolute bottom-0 sm:bottom-1 right-2.5 rounded-full bg-gray-100">
        {currentTheme === "dark" ? (
          <Sun className="h-12 md:h-14 w-auto px-1 py-1" />
        ) : (
          <Moon className="h-12 md:h-14 w-auto px-2 py-1" />
        )}
      </button>
      <span className='absolute bottom-0.5 sm:bottom-1 left-2 text-gray-400 dark:text-gray-700'>Beta</span>
    </div>
  );
};

export default Index;