import iconSrc from "../assets/icon/gold.png";

interface Props {
  amount: number;
}

const FORMAT = new Intl.NumberFormat("en-US");

export const Currency = (props: Props) => {
  return (
    <span
      style={{
        height: "18px",
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      <img src={iconSrc} />
      <span
        style={{
          color: "#ffc400",
          fontWeight: 500,
          fontSize: 14,
          lineHeight: "18px",
        }}
      >
        {FORMAT.format(props.amount)}g
      </span>
    </span>
  );
};
