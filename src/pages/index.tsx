// Todo: Szukanie kto ma zajęcia ✅
// Todo: Szukanie wykładowcy ❌
// Todo: Podgląd uczelni ❌
// Todo: Jakie sale są wolne ❌
// Todo: Wyświetlenie planu lekcji danego kierunku z danego dnia ❌
import React, { useState, useEffect } from 'react';
import data from '../../public/database.json';
import Sun from '../../public/sun-regular.svg'
import Moon from '../../public/moon-regular.svg'
import Head from 'next/head';
import { useTheme } from "next-themes";

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

  const inputStyles =
    'min-w-36 max-w-52 md:32 text-2xl md:text-lg border text-black border-2 border-black dark:border-gray-700 dark:bg-black dark:text-white rounded-full pl-2  dark:focus:outline dark:focus:outline-slate-500 placeholder:text-gray-400 tranistion-colors duration-500 shadow-lg dark:shadow-gray-900';

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
          setHourSuggestions(Array.from(hoursSuggestions));
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

      const slicedTime = timeInput.slice(3, timeInput.length);
      const [hours, minutes] = slicedTime.split(':').map(Number);
      const totalMinutes = hours * 60 + minutes;

      const matchedLessons = lessonsData?.filter(lesson => {
        return typeof lesson === 'object' && lesson.start_minute === totalMinutes;
      }) as Lesson[];

      setResults(matchedLessons || []);
      return totalMinutes;
    }
  }

  const handleCheck = () => {
    if (!placeInput || !dayInput || !hoursInput) {
      alert("Proszę wypełnić wszystkie pola.");
      return;
    } else {
      setShowResults(true);
    }
  };

  function goBack() {
    setShowResults(false);
    setResults([]);
    setDayInput("");
    setHoursInput("");
    setPlaceInput("");
  }

  function formatResult() {
    function formatTime(time: number) {
      return `${Math.floor(time / 60)}:${time % 60 === 0 ? '00' : time % 60 < 10 ? '0' + (time % 60) : time % 60}`;
    }
    return (
      <div className="h-[93vh]">
        <ul className='h-full flex items-center justify-center flex-col gap-2 overflow-y-auto pt-14'>
          {results.map((lesson, index) => (
            <li key={index} className='w-[21  rem] border-2 border-gray-400 dark:border-slate-600 text-black dark:text-white dark:bg-black rounded-lg flex flex-col px-1 py-2 mr-1 text-xl shadow-lg dark:shadow-gray-800 transition-all hover:scale-[1.03] duration-100'>
              <span><b>{lesson.subject}</b> {lesson.place}</span>
              <span>
                {lesson.type} {lesson.name}
              </span>
              <span className='font-bold'>{lesson.teacher}</span>
              <span>
                {formatTime(lesson.start_minute)} - {formatTime(lesson.end_minute)}
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
        <button className='text-black dark:text-white border border-black dark:border-white rounded-md text-2xl md:text-lg px-4 md:px-3 mt-2 ml-2 hover:scale-105 active:scale-95 transition-transform duration-150' onClick={() => { goBack() }}>Wróć</button>
      )}
      {!showResults && (
        <div className="h-screen flex items-center justify-center flex-col gap-2">
          <input
            type="text"
            placeholder="Sala: abc X "
            className={`${inputStyles} w-40`}
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
          <input
            type="text"
            placeholder="Dzień tygodnia"
            className={`${inputStyles}`}
            list="daysList"
            value={dayInput}
            onChange={(e) => fetchDay(e.target.value)}
          />
          <datalist id="daysList">
            {days.map((day, i) => (
              <option key={i} value={day}></option>
            ))}
          </datalist>
          <input type="text" placeholder="Od HH:MM" className={`${inputStyles} w-40`} list="hoursSuggestions"
            onChange={(e) => fetchHours(e.target.value)} value={hoursInput}
          />
          <datalist id='hoursSuggestions'>
            {hoursInput.length >= 1 &&
              hourSuggestions.map((hour, i) => (
                <option key={i} value={"Od " + hour}></option>
              ))}
          </datalist>
          <button
            className="border-2 border-gray-500 bg-white text-black dark:bg-black dark:text-white text-lg md:text-xl py-px md:px-3 px-4 md:py-px rounded-full hover:scale-105 active:scale-95 transition-transform duration-150 select-none"
            onClick={handleCheck}>
            Sprawdź
          </button>
        </div>
      )}

      {showResults && results.length > 0 && (
        formatResult()
      )}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="absolute bottom-1 right-2.5 rounded-md bg-gray-100">
        {currentTheme === "dark" ? (
          <Sun className="h-12 md:h-14 w-auto px-1 py-1" />
        ) : (
          <Moon className="h-12 md:h-14 w-auto px-2 py-1" />
        )}
      </button>
      <span className='absolute bottom-1 left-1 text-gray-400 dark:text-gray-700'>Beta</span>
    </div>
  );
};

export default Index;
