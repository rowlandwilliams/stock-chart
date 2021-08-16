import { supernovaColors } from "../../utils/utils";
import { LinearGradient } from "./LinearGradient/LinearGradient";

interface Props {
  stockKeys: string[];
  urlDescriptor: string;
  chartHeight: number;
}

export const LinearGradientBlock = ({
  stockKeys,
  urlDescriptor,
  chartHeight,
}: Props) => {
  return (
    <>
      {stockKeys.map((stockKey, i) => (
        <LinearGradient
          key={stockKey + "-top"}
          gradientId={stockKey + urlDescriptor}
          gradientColor={supernovaColors[i]}
          isTopChart
          chartHeight={chartHeight}
        />
      ))}
    </>
  );
};
