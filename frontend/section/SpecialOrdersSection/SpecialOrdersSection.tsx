import boardPng from "~frontend/assets/sprite/special-order/special_order_board.png";
import { GameDateDisplay } from "~frontend/component/GameDateDisplay";
import { ImageObjective } from "~frontend/component/ImageObjective";
import { ObjectiveOLD } from "~frontend/component/Objective/Objective";
import { SummarySection } from "~frontend/component/SummarySection";
import { SPECIAL_ORDER_SPRITES } from "~frontend/const/Assets";
import { GameSave } from "~frontend/gamesave/GameSave";
import { useGoals_OLD } from "~frontend/hook/useGoals_OLD";
import { GameDate, GameSeason } from "~frontend/util/GameDate";
import { StardewWiki } from "~frontend/util/StardewWiki";
import clsx from "clsx";

import styles from "./SpecialOrdersSection.module.scss";
import { Tooltip } from "~frontend/component/Tooltip/Tooltip";

interface Props {
  gameSave: GameSave;
}

const BOARD_BUILD_DATE = new GameDate(2, GameSeason.Fall, 1);

export const SpecialOrdersSection = (props: Props) => {
  const { goals, allDone } = useGoals_OLD({
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
      sectionIcon={boardPng}
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
            title="Click to open in Wiki"
          />
        </a>

        <div className={styles.orders}>
          {props.gameSave.specialOrders.map((order) => (
            <a
              key={order.title}
              href={StardewWiki.getLink(
                "Quests",
                order.title.replaceAll("!", "")
              )}
              target="_blank"
            >
              <Tooltip.Root>
                <Tooltip.Trigger>
                  <ImageObjective
                    done={order.completed}
                    width={42}
                    title="Click to open in Wiki"
                    src={SPECIAL_ORDER_SPRITES.resolve(order.npc)}
                  />
                </Tooltip.Trigger>

                <Tooltip.Content>{order.title}</Tooltip.Content>
              </Tooltip.Root>
            </a>
          ))}
        </div>
      </div>

      <ObjectiveOLD
        done={goals.global.objectives.boardBuilt}
        className={styles.objective}
      >
        "Special Orders Board" has been built. (On{" "}
        <GameDateDisplay date={BOARD_BUILD_DATE} /> )
      </ObjectiveOLD>

      <ObjectiveOLD
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
      </ObjectiveOLD>
    </SummarySection>
  );
};
