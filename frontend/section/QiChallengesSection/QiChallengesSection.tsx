import boardPng from "~frontend/assets/sprite/special-order/qi/special_orders_board.png";
import mrQiPng from "~frontend/assets/icon/mr-qi.png";
import { ImageObjective } from "~frontend/component/ImageObjective/ImageObjective";
import { ObjectiveOLD } from "~frontend/component/Objective/Objective";
import { Section } from "~frontend/component/Section/Section";
import { QI_SPECIAL_ORDER_SPRITES } from "~frontend/const/Assets";
import { GameSave } from "~frontend/gamesave/GameSave";
import { useGoals_OLD } from "~frontend/hook/useGoals_OLD";
import { StardewWiki } from "~frontend/util/StardewWiki";
import { snakeCase } from "case-anything";
import clsx from "clsx";

import styles from "./QiChallengesSection.module.scss";

interface Props {
  gameSave: GameSave;
}

export const QiChallengesSection = (props: Props) => {
  const { goldenWalnuts } = props.gameSave;

  const { goals, allDone } = useGoals_OLD({
    global: {
      objectives: {
        gainAccessToQisWalnutRoom: {
          current: goldenWalnuts.parrotUsed
            ? 100
            : goldenWalnuts.calculatedTotal,
          goal: 100,
        },
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
    <Section
      id="qi-challenges"
      sectionTitle="Mr. Qi's Challenges"
      sectionIcon={mrQiPng}
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
              goals.global.objectiveStatus.gainAccessToQisWalnutRoom !=
                "done" && styles.incomplete
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

      <ObjectiveOLD
        className={styles.objective}
        done={goals.global.objectiveStatus.gainAccessToQisWalnutRoom === "done"}
      >
        Gained access to "Mr. Qi's Walnut Room".{" "}
        {goals.global.objectiveStatus.gainAccessToQisWalnutRoom !== "done" && (
          <>
            —{" "}
            {goals.global.objectives.gainAccessToQisWalnutRoom.goal -
              goals.global.objectives.gainAccessToQisWalnutRoom.current}{" "}
            more Golden Walnut(s) needed
          </>
        )}
      </ObjectiveOLD>

      <ObjectiveOLD
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
      </ObjectiveOLD>
    </Section>
  );
};
