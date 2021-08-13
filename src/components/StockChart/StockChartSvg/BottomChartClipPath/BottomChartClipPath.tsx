import { margin, svgHeight } from "../utils/utils";

export const BottomChartClipPath = () => {
  return (
    <clipPath id="area-crop-left" pointerEvents="all">
      <rect height={svgHeight - margin * 2} rx="4" ry="4" fill="red"></rect>
    </clipPath>
  );
};
