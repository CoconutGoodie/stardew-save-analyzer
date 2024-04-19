import goldSrc from "../assets/icon/gold.png";
import starTokenSrc from "../assets/icon/star-token.png";
import heartSrc from "../assets/icon/heart_filled.png";

interface Props {
  amount: number;
  unit?: keyof typeof UNITS;
}

const UNITS = {
  gold: {
    iconSrc: goldSrc,
    color: "#ffc400",
    suffix: () => "g",
  },
  starToken: {
    iconSrc: starTokenSrc,
    color: "#DBE0E6",
    suffix: undefined,
  },
  heart: {
    iconSrc: heartSrc,
    color: "#D83700",
    suffix: (amount: number) => " " + (amount === 1 ? "heart" : "hearts"),
  },
};

const FORMAT = new Intl.NumberFormat("en-US");

export const Currency = (props: Props) => {
  const unit = props.unit ?? "gold";

  return (
    <span
      style={{
        verticalAlign: "middle",
        height: "18px",
        display: "inline-flex",
        alignItems: "center",
        gap: 3,
      }}
    >
      <img height={16} src={UNITS[unit].iconSrc} />
      <span
        style={{
          color: UNITS[unit].color,
          fontWeight: 600,
          fontSize: 14,
          lineHeight: "18px",
        }}
      >
        {FORMAT.format(props.amount)}
        {UNITS[unit].suffix?.(props.amount)}
      </span>
    </span>
  );
};
