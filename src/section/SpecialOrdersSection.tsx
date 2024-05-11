import { SummarySection } from "../component/SummarySection";
import { GameSave } from "../gamesave/GameSave";
import { AssetRepository } from "../util/AssetRepository";
import { StardewWiki } from "../util/StardewWiki";

import boardPng from "../assets/sprite/special-order/special_order_board.png";

import { ImageObjective } from "@src/component/ImageObjective";
import { useGoals } from "@src/hook/useGoals";
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
  const { goals, allDone } = useGoals({
    global: {
      objectives: {
        boardBuilt:
          BOARD_BUILD_DATE.canonicalDay <=
          props.gameSave.currentDate.canonicalDay,
        orderCompletion: {
          current: props.gameSave.specialOrders.filter(
            (order) => order.completed
          ).length,
          goal: props.gameSave.specialOrders.length,
        },
      },
    },
  });

  return (
    <SummarySection
      id="special-orders"
      sectionTitle="Special Orders"
      versions={["v1.5 Introduced"]}
      collapsable
      allDone={allDone}
    >
      <div className={styles.board}>
        <a
          href={StardewWiki.getLink("Quests", "List_of_Special_Orders")}
          target="_blank"
        >
          <img
            height={108}
            className={clsx(
              !goals.global.objectives.orderCompletion && styles.incomplete
            )}
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

      <Objective
        done={goals.global.objectives.boardBuilt}
        className={styles.objective}
      >
        "Special Orders Board" has been built. (On{" "}
        <GameDateDisplay date={BOARD_BUILD_DATE} /> )
      </Objective>

      <Objective
        done={goals.global.objectiveStatus.orderCompletion === "done"}
        className={styles.objective}
      >
        Every Special Order is completed.
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
