import {
  bottomChartHeight,
  margin,
  svgHeight,
  topChartHeight,
} from "../utils/chart-utils";

interface Props {
  gradientId: string;
  gradientColor: string;
  chartHeight: number;
  isTopChart?: boolean;
}

export const LinearGradient = ({
  gradientId,
  gradientColor,
  chartHeight,
  isTopChart = false,
}: Props) => {
  return (
    <>
      <linearGradient
        id={gradientId}
        gradientUnits="userSpaceOnUse"
        x1="0%"
        y1={isTopChart ? 0 : 10}
        x2="0%"
        y2={isTopChart ? chartHeight + margin : bottomChartHeight - margin}
      >
        <stop stop-color={gradientColor} offset="0" />
        <stop stop-color="#1A1B3E" offset="1" />
      </linearGradient>
    </>
  );
};
