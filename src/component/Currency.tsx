import goldSrc from "../assets/icon/gold.png";
import starTokenSrc from "../assets/icon/star-token.png";

interface Props {
  amount: number;
  unit?: keyof typeof UNITS;
}

const UNITS = {
  gold: {
    iconSrc: goldSrc,
    color: "#ffc400",
    suffix: "g",
  },
  starToken: {
    iconSrc: starTokenSrc,
    color: "#DBE0E6",
    suffix: undefined,
  },
};

const FORMAT = new Intl.NumberFormat("en-US");

export const Currency = (props: Props) => {
  const unit = props.unit ?? "gold";

  return (
    <span
      style={{
        height: "18px",
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      <img src={UNITS[unit].iconSrc} />
      <span
        style={{
          color: UNITS[unit].color,
          fontWeight: 600,
          fontSize: 14,
          lineHeight: "18px",
        }}
      >
        {FORMAT.format(props.amount)}
        {UNITS[unit].suffix}
      </span>
    </span>
  );
};
