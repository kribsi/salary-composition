import React, { useState, useEffect } from "react";
import * as RadixSlider from "@radix-ui/react-slider";

const Card = ({ children }) => (
  <div className="bg-white shadow-md rounded-lg p-6 mb-6 border border-gray-200">
    {children}
  </div>
);

const Input = (props) => (
  <input {...props} className="w-full p-2 border rounded-lg text-lg" />
);

const SalaryCalculator = () => {
  const [totalComp, setTotalComp] = useState(230000);
  const [bonusPct, setBonusPct] = useState(15);
  const [equityRatio, setEquityRatio] = useState(50);
  const [vestingSchedule, setVestingSchedule] = useState([38, 32, 20, 10]);
  const [currency, setCurrency] = useState("USD");
  const [exchangeRates, setExchangeRates] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
        const data = await response.json();
        setExchangeRates(data.rates);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      }
    };

    fetchExchangeRates();
  }, []);

  if (loading) {
    return <div className="text-center text-xl font-semibold">Loading exchange rates...</div>;
  }

  const baseSalary = ((100 - equityRatio) / 100) * (totalComp / (1 + bonusPct / 100));
  const bonus = (bonusPct / 100) * baseSalary;
  const fourYearEquity = (equityRatio / 100) * totalComp * 4;
  const yearlyVesting = vestingSchedule.map((percent) => (fourYearEquity * percent) / 100);
  const equityInUSD = fourYearEquity / (exchangeRates[currency] || 1);

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-6">Salary Composition Calculator</h1>
      
      <Card>
        <div className="flex gap-4 items-end">
          <div className="w-1/3">
            <label className="block text-lg font-medium mb-2">Average Yearly TC</label>
            <Input type="number" value={totalComp} onChange={(e) => setTotalComp(Number(e.target.value))} />
          </div>
          
          <div className="w-1/3">
            <select 
              className="w-full p-3 border rounded-lg text-lg"
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
            >
              {Object.keys(exchangeRates).map((cur) => (
                <option key={cur} value={cur}>{cur}</option>
              ))}
            </select>
          </div>
          
          <div className="w-1/3">
            <label className="block text-lg font-medium mb-2">Bonus (%)</label>
            <Input type="number" value={bonusPct} onChange={(e) => setBonusPct(Number(e.target.value))} />
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-2">Equity Vesting Schedule (%)</h2>
        <div className="flex gap-4">
          {vestingSchedule.map((value, index) => (
            <div key={index} className="flex flex-col items-center">
              <label className="text-md">Year {index + 1}</label>
              <Input 
                type="number" 
                value={value} 
                onChange={(e) => {
                  const newSchedule = [...vestingSchedule];
                  newSchedule[index] = Number(e.target.value);
                  setVestingSchedule(newSchedule);
                }} 
                className="w-16"
              />
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <RadixSlider.Root
          className="relative flex items-center w-full h-6"
          value={[equityRatio]}
          onValueChange={(val) => setEquityRatio(val[0])}
          min={0}
          max={100}
          step={1}
        >
          <RadixSlider.Track className="bg-gray-400 relative flex-grow h-2 rounded-full overflow-hidden">
            <RadixSlider.Range className="absolute bg-green-500 h-full rounded-full" />
          </RadixSlider.Track>
          <RadixSlider.Thumb
      class="block w-5 h-5 bg-white shadow-[0_2px_10px] shadow-blackA7 rounded-[10px] hover:bg-violet3 focus:outline-none focus:shadow-[0_0_0_5px] focus:shadow-blackA8"
      aria-label="Volume"
    />
          </RadixSlider.Root>
        <p className="text-lg text-gray-600 mt-2">{equityRatio}% Equity / {100 - equityRatio}% Salary+Bonus</p>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-2">Breakdown:</h2>
        <p>Base Salary: <strong>{currency} {Math.round(baseSalary / 1000)}k</strong></p>
        <p>Bonus: <strong>{currency} {Math.round(bonus / 1000)}k</strong></p>
        <p>4-Year Equity Grant: <strong>{currency} {Math.round(fourYearEquity / 1000)}k (USD {Math.round(equityInUSD / 1000)}k)</strong></p>
        
        <h3 className="text-md font-semibold mt-4">Yearly Compensation Breakdown:</h3>
        {yearlyVesting.map((amount, index) => (
          <p key={index} className={index === 0 ? "font-bold text-green-600" : ""}>
            Year {index + 1}: <strong>{currency} {Math.round((baseSalary + bonus + amount) / 1000)}k</strong>
          </p>
        ))}
      </Card>
    </div>
  );
};

export default SalaryCalculator;





