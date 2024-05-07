import { SummarySection } from "../component/SummarySection";
import { GameSave } from "../gamesave/GameSave";
import { AssetRepository } from "../util/AssetRepository";
import { StardewWiki } from "../util/StardewWiki";

import boardPng from "../assets/sprite/special-order/qi/special_orders_board.png";

import { ImageObjective } from "@src/component/ImageObjective";
import clsx from "clsx";
import { GameDateDisplay } from "../component/GameDateDisplay";
import { Objective } from "../component/Objective";
import { GameDate, GameSeason } from "../util/GameDate";
import styles from "./QiSpecialOrdersSection.module.scss";
import { snakeCase } from "case-anything";

interface Props {
  gameSave: GameSave;
}

const specialOrderIcons = new AssetRepository<{ default: string }>(
  import.meta.glob("../assets/sprite/special-order/qi/*.png", {
    eager: true,
  }),
  "../assets/sprite/special-order/qi/",
  ".png"
);

export const QiSpecialOrdersSection = (props: Props) => {
  const completedCount = props.gameSave.qiSpecialOrders.filter(
    (order) => order.completed
  ).length;

  const walnutRoomDiscovered = true; // TODO

  const completedEveryOrder =
    completedCount === props.gameSave.qiSpecialOrders.length;

  return (
    <SummarySection
      id="qi-special-orders"
      sectionTitle="Mr. Qi's Special Orders"
      collapsable
      versions={["v1.5 Introduced"]}
    >
      <div className={styles.board}>
        <a
          href={StardewWiki.getLink("Qi's Walnut Room", "Special_Orders_Board")}
          target="_blank"
        >
          <img
            height={108}
            className={clsx(!walnutRoomDiscovered && styles.incomplete)}
            src={boardPng}
          />
        </a>

        <div className={styles.orders}>
          {props.gameSave.qiSpecialOrders.map((order) => (
            <a
              key={order.title}
              href={StardewWiki.getLink("Qi's Walnut Room", order.title)}
              target="_blank"
            >
              <ImageObjective
                done={order.completed}
                width={42}
                title={order.title}
                src={
                  specialOrderIcons.resolve(snakeCase(order.title))?.default ??
                  ""
                }
              />
            </a>
          ))}
        </div>
      </div>

      <Objective done={walnutRoomDiscovered} className={styles.objective}>
        "Qi's Walnut Room" is discovered. [WIP]
      </Objective>

      <Objective done={completedEveryOrder} className={styles.objective}>
        Every Special Order is completed.
        {!completedEveryOrder && (
          <span>
            {" "}
            — Completed {completedCount} out of{" "}
            {props.gameSave.qiSpecialOrders.length}
          </span>
        )}
      </Objective>
    </SummarySection>
  );
};
