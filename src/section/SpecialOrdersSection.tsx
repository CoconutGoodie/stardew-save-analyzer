import { SummarySection } from "../component/SummarySection";
import { GameSave } from "../util/GameSave";
import { StardewWiki } from "../util/StardewWiki";
import { AssetRepository } from "../util/AssetRepository";

import questPng from "../assets/icon/quest.png";
import checkmarkPng from "../assets/icon/checkmark.png";
import boardPng from "../assets/sprite/special-order/special_order_board.png";

import styles from "./SpecialOrdersSection.module.scss";
import clsx from "clsx";

interface Props {
  gameSave: GameSave;
}

const specialOrderNpcs = new AssetRepository<{ default: string }>(
  import.meta.glob("../assets/sprite/special-order/*.png", {
    eager: true,
  }),
  "../assets/sprite/special-order/",
  ".png"
);

export const SpecialOrdersSection = (props: Props) => {
  const specialOrders = props.gameSave.getSpecialOrders();

  const completed = specialOrders.filter((order) => order.completed).length;

  return (
    <SummarySection id="special-orders">
      <h1>Special Orders</h1>

      <div className={styles.board}>
        <a
          href={StardewWiki.getLink("Quests", "List_of_Special_Orders")}
          target="_blank"
        >
          <img height={108} src={boardPng} />
        </a>

        <div className={styles.orders}>
          {specialOrders.map((order) => (
            <a
              href={StardewWiki.getLink("Quests", order.title)}
              target="_blank"
            >
              <img
                width={45}
                title={order.title}
                className={clsx(!order.completed && styles.incomplete)}
                src={specialOrderNpcs.resolve(order.npc).default}
              />
            </a>
          ))}
        </div>
      </div>

      <div className={styles.info}>
        <img width={14} src={checkmarkPng} />
        <span>Special Orders Board has been built (Day 2 of Fall, Year 1)</span>
      </div>

      <div className={styles.info}>
        <img width={14} src={questPng} />
        <span>
          Completed {completed} out of {specialOrders.length}
        </span>
      </div>
    </SummarySection>
  );
};
