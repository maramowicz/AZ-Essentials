import React, { useState, useEffect } from 'react';
import data from '../../public/database.json';
import Sun from '../../public/sun-regular.svg';
import Moon from '../../public/moon-regular.svg';
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

  const inputStyles = 'min-w-52 max-w-64 md:32 text-3xl md:text-lg border text-black border-2 border-black dark:border-gray-700 dark:bg-black dark:text-white rounded-full pl-2 py-1 md:py-0  dark:focus:outline dark:focus:outline-slate-500 placeholder:text-gray-400 transition-colors duration-500 shadow-lg dark:shadow-gray-900';

  const errorInputStyle = 'border-red-500';

  const days = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek'];

  const [inputErrors, setInputErrors] = useState({
    place: false,
    day: false,
    hours: false
  });

  useEffect(() => {
    console.clear();
    setPlaceInput("");
    setDayInput("");
    setHoursInput("");
    setInputErrors({ place: false, day: false, hours: false }); // resetujemy błędy

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
    const errors = { place: false, day: false, hours: false };

    if (!placeInput || !dayInput || !hoursInput) {
      errorMessages.push("Proszę wypełnić wszystkie pola.");
      if (!placeInput) errors.place = true;
      if (!dayInput) errors.day = true;
      if (!hoursInput) errors.hours = true;
    }

    if (dayInput.trim() === '' || typeof dayInput !== 'string') {
      errorMessages.push("Dzień musi być ciągiem znaków.");
      errors.day = true;
    }

    if (!hoursInput) {
      errorMessages.push("Niepoprawny format godziny.");
      errors.hours = true;
    }

    setInputErrors(errors);

    if (errorMessages.length > 0) {
      alert(errorMessages.join("\n"));
      return;
    }

    console.log(placeInput, dayInput, hoursInput, results);

    if (results.length > 0) {
      setShowResults(true);
    } else {
      alert("Nie znaleziono wykładu dla podanych danych");
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
      <div className="h-[93vh] flex items-center justify-center">
        <ul className='h-3/4 flex items-center justify-center flex-col gap-2 overflow-y-auto overflow-x-hidden pt-44 px-1.5 custom-scrollbar'>
          {results.map((lesson, index) => (
            <li key={index} className='w-[21rem] border-2 border-gray-400 dark:border-slate-600 text-black dark:text-white dark:bg-black rounded-lg flex flex-col px-1 py-2 mr-1 text-xl shadow-lg dark:shadow-gray-800 transition-all hover:scale-[1.03] duration-100'>
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
        <button className='text-black dark:text-white border border-black dark:border-white rounded-md text-2xl md:text-lg px-4 md:px-3 mt-2 ml-2 hover:scale-105 active:scale-95 transition-transform duration-150' onClick={goBack}>Wróć</button>
      )}
      {!showResults && (
        <div className="h-screen flex items-center justify-center flex-col gap-2">
          <select className='text-black dark:text-white bg-gray-300 dark:bg-gray-700 rounded-sm'
            onChange={(e) => fetchPlace(e.target.value)}>
            <option value="">--Wybierz sale--</option>
            [{placeSuggestions.map((item, i) => (
              <option key={i} value={item}>{item}</option>
            ))}]
          </select>
          <select className='text-black dark:text-white bg-gray-300 dark:bg-gray-700 rounded-sm'
            onChange={(e) => fetchDay(e.target.value)}>
            <option value="">--Wybierz dzień tygodnia--</option>
            {days.map((day, i) => (
              <option key={i} value={day}>{day}</option>
            ))}
          </select>
          <select className='text-black dark:text-white bg-gray-300 dark:bg-gray-700 rounded-sm'
            onChange={(e) => fetchHours(e.target.value)}>
            <option value="">--Wybierz godzine--</option>
            {hourSuggestions.map((hour, i) => (
              <option key={i} value={hour}>Od {hour}</option>
            ))}
          </select>
          <datalist id='hoursSuggestions'>
          </datalist>
          <button
            className="border-2 border-gray-500 bg-white text-black dark:bg-black dark:text-white text-2xl py-1.5 md:py-px px-6 md:px-3 rounded-full hover:scale-105 active:scale-95 transition-transform duration-150 mt-2.5 select-none"
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
        className="absolute bottom-1 right-2.5 rounded-full bg-gray-100">
        {currentTheme === "dark" ? (
          <Sun className="h-12 md:h-14 w-auto px-1 py-1" />
        ) : (
          <Moon className="h-12 md:h-14 w-auto px-2 py-1" />
        )}
      </button>
      <span className='absolute bottom-1 left-2 text-gray-400 dark:text-gray-700'>Beta</span>
    </div>
  );
};

export default Index;
