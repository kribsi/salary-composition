import React from "react";
import SalaryCalculator from "./components/SalaryCalculator";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-3xl p-8 bg-white shadow-lg rounded-xl">
        <SalaryCalculator />
      </div>
    </div>
  );
}

export default App;
