import React from "react";
import "./App.css";
import { StockChart } from "./components/StockChart/StockChart";

function App() {
  return (
    <div className="m-2 flex justify-center">
      <StockChart companyTicker="aapl" />
    </div>
  );
}

export default App;
