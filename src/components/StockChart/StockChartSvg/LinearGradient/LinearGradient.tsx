import { margin, topChartHeight } from "../utils/chart-utils";

interface Props {
  gradientId: string;
  gradientColor: string;
}

export const LinearGradient = ({ gradientId, gradientColor }: Props) => {
  return (
    <>
      <linearGradient
        id={gradientId}
        gradientUnits="userSpaceOnUse"
        x1="0%"
        y1="0"
        x2="0%"
        y2={topChartHeight + margin}
      >
        <stop stop-color={gradientColor} offset="0" />
        <stop stop-color="#1A1B3E" offset="1" />
      </linearGradient>
    </>
  );
};
