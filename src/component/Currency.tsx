import goldSrc from "../assets/icon/gold.png";
import starTokenSrc from "../assets/icon/star-token.png";
import heartSrc from "../assets/icon/heart_filled.png";
import qiGemSrc from "../assets/icon/qi-gem.png";
import qiCoinSrc from "../assets/icon/qi-coin.png";

interface Props {
  amount: number;
  unit?: keyof typeof UNITS;
}

const UNITS = {
  gold: {
    title: "Gold",
    iconSrc: goldSrc,
    color: "#ffc400",
    suffix: () => "g",
  },
  starToken: {
    title: "Star Token",
    iconSrc: starTokenSrc,
    color: "#DBE0E6",
    suffix: undefined,
  },
  heart: {
    title: "Heart",
    iconSrc: heartSrc,
    color: "#D83700",
    suffix: (amount: number) => " " + (amount === 1 ? "heart" : "hearts"),
  },
  qiGems: {
    title: "Qi Gem",
    iconSrc: qiGemSrc,
    color: "#a283e9",
    suffix: undefined,
  },
  qiCoins: {
    title: "Qi Coin",
    iconSrc: qiCoinSrc,
    color: "#E246FF",
    suffix: undefined,
  },
};

const FORMAT = new Intl.NumberFormat("en-US");

export const Currency = (props: Props) => {
  const unit = UNITS[props.unit ?? "gold"];

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
      <img height={16} src={unit.iconSrc} alt={"Unit"} title={unit.title} />
      <span
        style={{
          color: unit.color,
          fontWeight: 600,
          fontSize: 14,
          lineHeight: "18px",
        }}
      >
        {FORMAT.format(props.amount)}
        {unit.suffix?.(props.amount)}
      </span>
    </span>
  );
};
