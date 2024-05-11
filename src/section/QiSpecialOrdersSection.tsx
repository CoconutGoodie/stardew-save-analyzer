import { SummarySection } from "../component/SummarySection";
import { GameSave } from "../gamesave/GameSave";
import { AssetRepository } from "../util/AssetRepository";
import { StardewWiki } from "../util/StardewWiki";

import boardPng from "../assets/sprite/special-order/qi/special_orders_board.png";

import { ImageObjective } from "@src/component/ImageObjective";
import { useGoals } from "@src/hook/useGoals";
import { snakeCase } from "case-anything";
import clsx from "clsx";
import { Objective } from "../component/Objective";
import styles from "./QiSpecialOrdersSection.module.scss";

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
  const { goals, allDone } = useGoals({
    objectives: {
      walnutRoomDiscovered: true, // TODO
      orderCompletion: {
        current: props.gameSave.qiSpecialOrders.filter(
          (order) => order.completed
        ).length,
        goal: props.gameSave.qiSpecialOrders.length,
      },
    },
    farmers: {
      aaa: {
        objectives:{
          x:true
        }
      }
    }
  });

  goals.farmers["sdasad"].objectiveDone

  return (
    <SummarySection
      id="qi-special-orders"
      sectionTitle="Mr. Qi's Special Orders"
      collapsable
      versions={["v1.5 Introduced"]}
      allDone={allDone}
    >
      <div className={styles.board}>
        <a
          href={StardewWiki.getLink("Qi's Walnut Room", "Special_Orders_Board")}
          target="_blank"
        >
          <img
            height={108}
            className={clsx(
              !goals.objectives.walnutRoomDiscovered && styles.incomplete
            )}
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

      <Objective
        done={goals.objectives.walnutRoomDiscovered}
        className={styles.objective}
      >
        "Qi's Walnut Room" is discovered. [WIP]
      </Objective>

      <Objective
        done={goals.objectiveDone.orderCompletion}
        className={styles.objective}
      >
        Every Special Order is completed.
        {!goals.objectiveDone.orderCompletion && (
          <span>
            {" "}
            — Completed {goals.objectives.orderCompletion.current} out of{" "}
            {goals.objectives.orderCompletion.goal}
          </span>
        )}
      </Objective>
    </SummarySection>
  );
};
