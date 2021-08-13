import { bottomChartHeight, topChartHeight } from "../utils/utils";
import { LinearGradientBlock } from "./LinearGradientBlock/LinearGradientBlock";

interface Props {
  stockKeys: string[];
}

export const Defs = ({ stockKeys }: Props) => {
  return (
    <defs>
      <LinearGradientBlock
        stockKeys={stockKeys}
        urlDescriptor="-top"
        chartHeight={topChartHeight}
      />
      <LinearGradientBlock
        stockKeys={stockKeys}
        urlDescriptor="-bottom"
        chartHeight={bottomChartHeight}
      />
    </defs>
  );
};
