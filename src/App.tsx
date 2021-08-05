import React from "react";
import "./App.css";
import { StockChart } from "./components/StockChart/StockChart";

function App() {
  return (
    <div className="m-2">
      <StockChart companyName="apple" />
      <StockChart companyName="microsoft" />
    </div>
  );
}

export default App;
