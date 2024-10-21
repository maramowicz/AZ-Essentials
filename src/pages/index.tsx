import React, { useState, useMemo } from 'react';

function ExpensiveCalculationComponent() {
  const [count, setCount] = useState(0);
  const [input, setInput] = useState('');

  // Funkcja symulująca kosztowne obliczenia
  const expensiveCalculation = (num: number) => {
    console.clear();
    
    console.log('Wykonywanie kosztownych obliczeń...');
    for (let i = 0; i < 1000000000; i++) {} // symulacja dużego obciążenia
    return num;
  };

  // Zapamiętanie wyniku kosztownych obliczeń, zależne od wartości count
  const calculatedValue = useMemo(() => {
    return expensiveCalculation(count);
  }, [count]);

  return (
    <div>
      <h1>useMemo Example</h1>
      <p>Obliczony wynik: {calculatedValue}</p>
      <button onClick={() => setCount(count + 1)}>Zwiększ count</button>
      <input
        type="text"
        value={input}
        className='ml-2 text-black'
        onChange={(e) => setInput(e.target.value)}
        placeholder="Wpisz coś..."
      />
    </div>
  );
}

export default ExpensiveCalculationComponent;
