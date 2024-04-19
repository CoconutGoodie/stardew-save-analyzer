import { SummarySection } from "../component/SummarySection";
import { AssetRepository } from "../util/AssetRepository";
import { GameSave } from "../util/GameSave";
import { StardewWiki } from "../util/StardewWiki";

import boardPng from "../assets/sprite/special-order/special_order_board.png";

import clsx from "clsx";
import { GameDateDisplay } from "../component/GameDateDisplay";
import { Objective } from "../component/Objective";
import { GameDate, GameSeason } from "../util/GameDate";
import styles from "./SpecialOrdersSection.module.scss";

interface Props {
  gameSave: GameSave;
}

const BOARD_BUILD_DATE = new GameDate(2, GameSeason.Fall, 1);

const specialOrderNpcs = new AssetRepository<{ default: string }>(
  import.meta.glob("../assets/sprite/special-order/*.png", {
    eager: true,
  }),
  "../assets/sprite/special-order/",
  ".png"
);

export const SpecialOrdersSection = (props: Props) => {
  const farmOverview = props.gameSave.getFarmOverview();
  const specialOrders = props.gameSave.getSpecialOrders();

  const completedCount = specialOrders.filter(
    (order) => order.completed
  ).length;

  const boardBuilt =
    BOARD_BUILD_DATE.canonicalDay <= farmOverview.currentDate.canonicalDay;

  const everyOrderCompleted = completedCount === specialOrders.length;

  return (
    <SummarySection id="special-orders">
      <h1>Special Orders</h1>

      <div className={styles.board}>
        <a
          href={StardewWiki.getLink("Quests", "List_of_Special_Orders")}
          target="_blank"
        >
          <img
            height={108}
            className={clsx(!boardBuilt && styles.incomplete)}
            src={boardPng}
          />
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

      <Objective done={boardBuilt} className={styles.objective}>
        "Special Orders Board" has been built. (On{" "}
        <GameDateDisplay date={BOARD_BUILD_DATE} /> )
      </Objective>

      <Objective done={everyOrderCompleted} className={styles.objective}>
        Every Special Order is completed.
        {!everyOrderCompleted && (
          <span>
            {" "}
            — Completed {completedCount} out of {specialOrders.length}
          </span>
        )}
      </Objective>
    </SummarySection>
  );
};
