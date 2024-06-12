import boardPng from "@src/assets/sprite/special-order/qi/special_orders_board.png";
import { ImageObjective } from "@src/component/ImageObjective";
import { Objective } from "@src/component/Objective";
import { SummarySection } from "@src/component/SummarySection";
import { QI_SPECIAL_ORDER_SPRITES } from "@src/const/Assets";
import { GameSave } from "@src/gamesave/GameSave";
import { useGoals } from "@src/hook/useGoals";
import { StardewWiki } from "@src/util/StardewWiki";
import { snakeCase } from "case-anything";
import clsx from "clsx";

import styles from "./QiChallengesSection.module.scss";

interface Props {
  gameSave: GameSave;
}

export const QiChallengesSection = (props: Props) => {
  const { goals, allDone } = useGoals({
    global: {
      objectives: {
        walnutRoomDiscovered: true, // TODO
        orderCompletion: {
          current: props.gameSave.qiSpecialOrders.filter(
            (order) => order.completed
          ).length,
          goal: props.gameSave.qiSpecialOrders.length,
        },
      },
    },
  });

  return (
    <SummarySection
      id="qi-challenges"
      sectionTitle="Mr. Qi's Challenges"
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
              !goals.global.objectives.walnutRoomDiscovered && styles.incomplete
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
                src={QI_SPECIAL_ORDER_SPRITES.resolve(snakeCase(order.title))}
              />
            </a>
          ))}
        </div>
      </div>

      <Objective
        done={goals.global.objectives.walnutRoomDiscovered}
        className={styles.objective}
      >
        "Qi's Walnut Room" is discovered. [WIP]
      </Objective>

      <Objective
        done={goals.global.objectiveStatus.orderCompletion === "done"}
        className={styles.objective}
      >
        Every Challenge is completed.
        {goals.global.objectiveStatus.orderCompletion !== "done" && (
          <span>
            {" "}
            — Completed {goals.global.objectives.orderCompletion.current} out of{" "}
            {goals.global.objectives.orderCompletion.goal}
          </span>
        )}
      </Objective>
    </SummarySection>
  );
};
