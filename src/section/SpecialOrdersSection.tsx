import { SummarySection } from "../component/SummarySection";
import { GameSave } from "../gamesave/GameSave";
import { AssetRepository } from "../util/AssetRepository";
import { StardewWiki } from "../util/StardewWiki";

import boardPng from "../assets/sprite/special-order/special_order_board.png";

import { ImageObjective } from "@src/component/ImageObjective";
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
  const completedCount = props.gameSave.specialOrders.filter(
    (order) => order.completed
  ).length;

  const builtBoard =
    BOARD_BUILD_DATE.canonicalDay <= props.gameSave.currentDate.canonicalDay;

  const completedEveryOrder =
    completedCount === props.gameSave.specialOrders.length;

  return (
    <SummarySection
      id="special-orders"
      sectionTitle="Special Orders"
      collapsable
    >
      <div className={styles.board}>
        <a
          href={StardewWiki.getLink("Quests", "List_of_Special_Orders")}
          target="_blank"
        >
          <img
            height={108}
            className={clsx(!builtBoard && styles.incomplete)}
            src={boardPng}
          />
        </a>

        <div className={styles.orders}>
          {props.gameSave.specialOrders.map((order) => (
            <a
              key={order.title}
              href={StardewWiki.getLink("Quests", order.title)}
              target="_blank"
            >
              <ImageObjective
                done={order.completed}
                width={42}
                title={order.title}
                src={specialOrderNpcs.resolve(order.npc).default}
              />
            </a>
          ))}
        </div>
      </div>

      <Objective done={builtBoard} className={styles.objective}>
        "Special Orders Board" has been built. (On{" "}
        <GameDateDisplay date={BOARD_BUILD_DATE} /> )
      </Objective>

      <Objective done={completedEveryOrder} className={styles.objective}>
        Every Special Order is completed.
        {!completedEveryOrder && (
          <span>
            {" "}
            — Completed {completedCount} out of{" "}
            {props.gameSave.specialOrders.length}
          </span>
        )}
      </Objective>
    </SummarySection>
  );
};
