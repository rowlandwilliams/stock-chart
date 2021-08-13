import { bisect, pointer, ScaleLinear, ScaleTime, select, Selection } from "d3";
import { ConvertedData } from "../../../../../../types";
import {
  brushColor,
  capitalizeString,
  margin,
  supernovaColors,
  topChartHeight,
} from "../../chart-utils";

export const getTopChartSelections = (
  companyName: string,
  topChartGroup: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>
) => {
  const focusGroup = topChartGroup.select<SVGSVGElement>(
    `#focus-${companyName}`
  );
  return {
    areaGroup: select<SVGSVGElement, unknown>(`#area-${companyName}`),
    focusGroup: focusGroup,
    focusLine: focusGroup.select<SVGSVGElement>("line"),
    focusCircles: focusGroup.selectAll<SVGSVGElement, unknown>("circle"),
    focusText: focusGroup.selectAll<SVGSVGElement, unknown>("text"),
    focusTextRects: focusGroup.selectAll<SVGSVGElement, unknown>("rect"),
  };
};

export const updateTopChartAxesDomains = (
  x: ScaleTime<number, number, never>,
  y: ScaleLinear<number, number, never>,
  activeDatesDomain: number[],
  activeStocksDomain: number[],
  svgWidth: number
) => {
  x.domain(activeDatesDomain).range([0, svgWidth]);
  y.domain(activeStocksDomain).range([topChartHeight - margin, margin]);
};

const chartBackgroundColor = "#1a1b3e";

export const addFocusLineCirclesAndText = (
  focusLine: Selection<SVGSVGElement, unknown, HTMLElement, any>,
  focusCircles: Selection<SVGSVGElement, unknown, SVGSVGElement, unknown>,
  convertedData: ConvertedData[],
  focusText: Selection<SVGSVGElement, unknown, SVGSVGElement, unknown>
) => {
  focusLine
    .attr("stroke", "white")
    .attr("stroke-svgWidth", 1)
    .attr("shape-rendering", "crispEdges")
    .attr("opacity", 0)
    .attr("y2", topChartHeight - margin);

  focusCircles
    .data(convertedData)
    .join("circle")
    .attr("opacity", 0)
    .attr("r", "4")
    .attr("fill", (d, i) => supernovaColors[i])
    .attr("stroke", chartBackgroundColor)
    .attr("stroke-svgWidth", 2);

  focusText
    .data(convertedData)
    .join("text")
    .attr("fill", (d, i) => supernovaColors[i]);
};

// mousmove function for when svg is hovered
export const mousemove = (
  event: PointerEvent,
  x: ScaleTime<number, number, never>,
  y: ScaleLinear<number, number, never>,
  dates: number[],
  focusLine: Selection<SVGSVGElement, unknown, HTMLElement, any>,
  focusCircles: Selection<SVGSVGElement, unknown, SVGSVGElement, unknown>,
  focusText: Selection<SVGSVGElement, unknown, SVGSVGElement, unknown>,
  focusTextRects: Selection<SVGSVGElement, unknown, SVGSVGElement, unknown>,
  width: number
) => {
  // height of one label
  const textHeight = 20;

  // get x mouse position
  const xMouse = pointer(event)[0];
  const yMouse = pointer(event)[1];

  if (yMouse < topChartHeight) {
    // convert mouse coordinate to date based on x scale
    const x0 = x.invert(pointer(event)[0]).getTime();

    // determine the index of the date in dates array that is closest to x0
    const idx = bisect(dates, x0, 1);

    // define dates one before and at index
    const d0 = dates[idx - 1];
    const d1 = dates[idx];

    // determine date value that will be used to position x value of verticla line / tooltip
    const dFinal = x0 - d0 > d1 - x0 ? d1 : d0;
    const idxFinal = x0 - d0 > d1 - x0 ? idx : idx - 1;

    // translate line based on current x value
    focusLine
      .attr("opacity", 1)
      .attr("transform", "translate(" + x(dFinal) + ",0)");

    // translate circle based on current x and y value
    focusCircles
      .attr("opacity", 1)
      .attr("cx", x(dFinal))
      .attr("cy", (d: any) => y(d.values[idxFinal].value));

    // for the given date get the value for each stockMetric
    const sequentialLineData: number[] = [];

    // for each label grab data value associated with it and push to array
    focusText.each((d: any) => {
      sequentialLineData.push(d.values[idxFinal].value);
    });

    // sort in descneding order (for y positioning)
    sequentialLineData.sort().reverse();
    const length = sequentialLineData.length;

    // calulcate the mid of all four values for a given date (for mid positioning of tooltip box)
    const midStockValue =
      sequentialLineData[length - 1] -
      (sequentialLineData[length - 1] - sequentialLineData[0]) / 2;

    const textWidths: number[] = [];

    focusText.each((d, i, nodes) => {
      const node = select(nodes[i]).node() as SVGSVGElement;
      const width = node.getBBox().width;
      textWidths.push(width + 10);
    });

    const maxTextWidth = Math.max(...textWidths);
    const maxTextWidthAndOffset = maxTextWidth + 5;

    focusTextRects
      .attr("rx", 2)
      .attr("fill", brushColor)
      .attr("width", maxTextWidth)
      .attr("height", "80px")
      .attr("transform", (d: any, i) =>
        getRectTranslationFromData(
          x,
          dFinal,
          xMouse,
          width,
          maxTextWidthAndOffset,
          y,
          midStockValue,
          i,
          textHeight
        )
      );

    focusText
      .text(
        (d: any) =>
          capitalizeString(d.stockMetric) +
          ": " +
          d.values[idxFinal].value.toFixed(2)
      )
      .attr("font-size", "0.75rem")
      .attr("transform", (d: any, i) =>
        getTextTranslationFromData(
          sequentialLineData,
          d,
          idxFinal,
          x,
          xMouse,
          width,
          maxTextWidthAndOffset,
          y,
          midStockValue,
          textHeight,
          dFinal
        )
      )
      .attr("text-anchor", "start");
  }
};

// translate text labels based on value at a given date
const getTextTranslationFromData = (
  sequentialLineData: number[],
  d: any,
  idxFinal: number,
  x: ScaleTime<number, number, never>,
  xMouse: number,
  width: number,
  maxTextWidthAndOffset: number,
  y: ScaleLinear<number, number, never>,
  midStockValue: number,
  textHeight: number,
  dFinal: number
) => {
  // distance between tooltip and point
  const offset = 15;

  // determine position of rectangle based on y value
  const index = sequentialLineData.indexOf(d.values[idxFinal].value);

  return (
    "translate(" +
    (x(dFinal) +
      (xMouse > width - maxTextWidthAndOffset
        ? -maxTextWidthAndOffset
        : offset)) +
    "," + // multiply index by textheight to determine vertical position of each label in tooltip
    (y(midStockValue) + index * textHeight - 25) +
    ")"
  );
};

// translate text rectablges based on value at a given date
const getRectTranslationFromData = (
  x: d3.ScaleTime<number, number, never>,
  dFinal: number,
  xMouse: number,
  width: number,
  maxTextWidthAndOffset: number,
  y: d3.ScaleLinear<number, number, never>,
  midStockValue: number,
  i: number,
  textHeight: number
) => {
  return (
    "translate(" +
    (x(dFinal) +
      (xMouse > width - maxTextWidthAndOffset
        ? -maxTextWidthAndOffset - 5
        : margin / 2) +
      "," +
      (y(midStockValue) + i * textHeight - 2 * textHeight) +
      ")")
  );
};
