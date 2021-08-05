import { useEffect, useRef, useState } from "react";
import { StockData, StockKey, StockValue } from "../../../types";
import * as d3 from "d3";
import { easeBack, easeElastic, easeExp, easeLinear, easeQuad } from "d3";
import { convertStockDataForChart } from "./utils/helpers/convertStockDataForChart";
import { getMinMaxStock } from "./utils/helpers/getMinMaxStock";

interface Props {
  stockData: StockData[];
  stockKeys: StockKey[];
  isMonth: boolean;
  companyName: string;
}

const margin = 20;
const supernovaColors = ["#52a866", "#FF715B", "#E9FEA5", "#A0FCAD", "#E0D9FE"];

const xAxisScale = (datesDomain: number[], width: number) => {
  return d3.scaleTime().domain(datesDomain).range([0, width]);
};

export const StockChartSvg = ({
  stockData,
  stockKeys,
  isMonth,
  companyName,
}: Props) => {
  const parentRef = useRef<HTMLInputElement>(null);

  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    if (parentRef.current) {
      setWidth(parentRef.current.offsetWidth);
      setHeight(parentRef.current.offsetHeight - 20);
    }
  }, [parentRef]);

  console.log(width);

  useEffect(() => {
    if (width > 0) {
      const xAxisGroup = d3.select(`#x-axis-${companyName}`);
      const chartGroup = d3.select(`.chart-group-${companyName}`);
      const convertedData = convertStockDataForChart(stockData, stockKeys);

      const dates = stockData.map((x) => x.date);
      const datesDomain = [
        Math.min.apply(null, dates),
        Math.max.apply(null, dates),
      ];

      const stocksDomain = getMinMaxStock(stockData, stockKeys);

      // define x axis scale
      const x = xAxisScale(datesDomain, width);
      const y = d3.scaleLinear();

      // define x axis
      const xAxis = d3.axisBottom(x);

      // determine tick marks based on axis state
      isMonth
        ? xAxis.ticks(d3.timeWeek.every(1)).tickSize(0)
        : xAxis.ticks(d3.timeYear.every(1)).tickSize(0);

      const drawAxis = () => {
        var t = d3.transition().duration(1500).ease(d3.easeLinear);

        // reset axis domain
        x.domain(datesDomain).range([0, width]);
        y.domain(stocksDomain).range([height, 50]);

        // transition x axis
        xAxisGroup
          .attr("transform", `translate(0, ${height - margin})`)
          .transition()
          // .ease(easeExp)
          .duration(1000)
          .call(xAxis as any)
          .on("start", () => {
            xAxisGroup.select(".domain").remove();
          });

        const plotLine = d3
          .line<StockValue>()
          .x((d) => x(d.date))
          .y((d) => y(d.value));

        chartGroup
          .selectAll("path")
          .data(convertedData)
          .join("path")
          .attr("fill", "none")
          .attr("stroke", (d, i) => supernovaColors[i])
          .transition()
          // .ease(easeLinear)
          // .duration(200)
          .attr("d", (d) => plotLine(d.values));
      };

      drawAxis();
    }
  }, [stockData, stockKeys, width, height, isMonth, companyName]);

  return (
    <div className="h-80 w-full" ref={parentRef}>
      <svg width="100%" height="100%">
        <g
          className={`chart-group-${companyName}`}
          style={{ transform: "translate(0,10)" }}
        ></g>
        <g id={`x-axis-${companyName}`}></g>
      </svg>
    </div>
  );
};
