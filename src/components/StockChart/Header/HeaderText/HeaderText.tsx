interface Props {
  boldText: string;
  subText: string;
  boldTextMarginRight?: number;
}

export const HeaderText = ({ boldText, subText }: Props) => {
  return (
    <div className="flex items-end sm:mr-8">
      <div className="mr-2">{boldText}</div>
      <div className="opacity-20 text-sm">{subText}</div>
    </div>
  );
};
