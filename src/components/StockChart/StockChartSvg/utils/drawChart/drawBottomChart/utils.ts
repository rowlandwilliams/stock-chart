import {
  axisBottom,
  pointer,
  scaleLinear,
  ScaleTime,
  scaleTime,
  Selection,
} from "d3";
import { bottomChartHeight, brushColor, margin } from "../../chart-utils";

export const getBottomChartSelections = (
  companyName: string,
  bottomChartGroup: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>
) => {
  return {
    xAxisGroupBottom: bottomChartGroup.select<SVGSVGElement>(
      `#x-axis-${companyName}`
    ),
    linesGroupBottom: bottomChartGroup.selectAll<SVGSVGElement, unknown>(
      `#lines-${companyName}`
    ),
    areaGroupBottom: bottomChartGroup.selectAll<SVGSVGElement, unknown>(
      `#area-${companyName}`
    ),
    brushGroup: bottomChartGroup.select<SVGSVGElement>(`#brush-${companyName}`),
  };
};

export const getBottomChartScalesAndAxes = (
  fullDatesDomain: number[],
  fullStocksDomain: number[],
  width: number
) => {
  // define x and y scale for bottom graph
  const xBottom = scaleTime().domain(fullDatesDomain).range([0, width]);

  return {
    xBottom: xBottom,
    yBottom: scaleLinear()
      .domain(fullStocksDomain)
      .range([bottomChartHeight - margin, margin]),
    xAxisBottom: axisBottom(xBottom).tickSize(0),
  };
};

export const updateBrushOnMove = (
  brushGroup: Selection<SVGSVGElement, unknown, HTMLElement, any>,
  brush: any,
  xBottom: ScaleTime<number, number, never>,
  activeDatesDomain: number[],
  width: number
) => {
  // call brush function and set initial position / position on time label click
  brushGroup
    .call(brush as any)
    .transition()
    .duration(800)
    .call(brush.move as any, [
      xBottom(activeDatesDomain[0]),
      xBottom(activeDatesDomain[1]),
    ])
    .select(".selection") // color brush
    .attr("fill", brushColor)
    .attr("stroke", brushColor);

  // brushGroup.select(".overlay").datum({ type: "selection" });
};
