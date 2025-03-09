import React, { useState, useEffect } from 'react';

export default function CurrencyExchange(){
  const [rates, setRates] = useState({});
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState(1);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchRates = async () => {
      const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
      setRates(response.data.rates);
    };
    fetchRates();
  }, []);

  const handleConvert = () => {
    if (!rates[fromCurrency] || !rates[toCurrency]) return;
    const convertedAmount = (amount * rates[toCurrency]) / rates[fromCurrency];
    setResult(convertedAmount.toFixed(2));
  };

  return (
    <div className='flex flex-col justify-center items-center mt-[10px] text-lg p-3 w-full sm:w-[75%] h-[80vh] bg-slate-200 rounded-xl m-auto'>
      <h2 className='mb-[50px] font-semibold'>Currency Exchange</h2>
      <div>
        <label>From:</label>
        <select className='bg-slate-300 rounded-lg block w-[200px] p-2' value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
          {Object.keys(rates).map(currency => (
            <option key={currency} value={currency}>{currency}</option>
          ))} 
        </select>
      </div>
      <div>
        <label>To:</label>
        <select className='bg-slate-300 rounded-lg block w-[200px] p-2 ' value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
          {Object.keys(rates).map(currency => (
            <option key={currency} value={currency}>{currency}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Amount:</label>
        <input className='bg-slate-300 rounded-lg block w-[200px] p-2' type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </div>
      <button className='bg-blue-400 mt-[50px] p-1 rounded-lg block w-[200px] text-white' onClick={handleConvert}>Convert</button>
      {result && <h3>Converted Amount: {result} {toCurrency}</h3>}
    </div>
  );
}
