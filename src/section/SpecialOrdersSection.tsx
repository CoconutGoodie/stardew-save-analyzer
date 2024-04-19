import { Achievement } from "../component/Achievement";
import { SummarySection } from "../component/SummarySection";
import { GameSave } from "../util/GameSave";

import styles from "./SpecialOrdersSection.module.scss";

interface Props {
  gameSave: GameSave;
}

const specialOrderNpcs = import.meta.glob("../assets/special-order/*.png", {
  eager: true,
});

export const SpecialOrdersSection = (props: Props) => {
  const specialOrders = props.gameSave.getSpecialOrders();

  return (
    <SummarySection id="special-orders">
      <h1>Special Orders</h1>

      <div className={styles.orders}>
        {specialOrders.map((order) => (
          <a href={order.wiki} target="_blank">
            <img
              width={50}
              title={order.title}
              style={{
                filter: order.completed ? "" : "brightness(0.2)",
                opacity: order.completed ? 1 : 0.2,
              }}
              src={
                // @ts-ignore
                specialOrderNpcs[`../assets/special-order/${order.npc}.png`]
                  .default
              }
            />
          </a>
        ))}
      </div>

      <Achievement
        title={"Complete all Special Orders"}
        achieved={specialOrders.every((order) => order.completed)}
      >
        {" "}
        ({specialOrders.filter((order) => order.completed).length}/
        {specialOrders.length} Done)
      </Achievement>
    </SummarySection>
  );
};
