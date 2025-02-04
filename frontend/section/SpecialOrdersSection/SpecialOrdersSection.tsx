import clsx from "clsx";
import { GameDateDisplay } from "~frontend/component/GameDateDisplay/GameDateDisplay";
import { ImageObjective } from "~frontend/component/ImageObjective/ImageObjective";
import { Section } from "~frontend/component/Section/Section";
import { SectionPart } from "~frontend/component/SectionPart/SectionPart";
import { Tooltip } from "~frontend/component/Tooltip/Tooltip";
import { SPECIAL_ORDER_SPRITES } from "~frontend/const/Assets";
import { GameSave } from "~frontend/gamesave/GameSave";
import { useGoals } from "~frontend/hook/useGoals";
import { GameDate, GameSeason } from "~frontend/util/GameDate";
import { StardewWiki } from "~frontend/util/StardewWiki";

import boardPng from "~frontend/assets/sprite/special-order/special_order_board.png";

import styles from "./SpecialOrdersSection.module.scss";

interface Props {
  gameSave: GameSave;
}

const BOARD_BUILD_DATE = new GameDate(2, GameSeason.Fall, 1);

export const SpecialOrdersSection = (props: Props) => {
  const goals = useGoals(() => ({
    global: {
      objectives: [
        {
          id: "boardBuilt",
          type: "progressive",
          current: props.gameSave.currentDate.canonicalDay,
          goal: BOARD_BUILD_DATE.canonicalDay,
          description: (
            <>
              "Special Orders Board" has been built. (On{" "}
              <GameDateDisplay date={BOARD_BUILD_DATE} /> )
            </>
          ),
          hint: ({ current, goal }) => <>{goal - current} day(s) left.</>,
        },
        {
          id: "orderCompletion",
          type: "progressive",
          current: props.gameSave.specialOrders.filter(
            (order) => order.completed
          ).length,
          goal: props.gameSave.specialOrders.length,
          description: <>Every Special Order is completed.</>,
          hint: ({ current, goal }) => (
            <>
              Completed {current} out of {goal}
            </>
          ),
        },
      ],
    },
  }));

  return (
    <Section
      id="special-orders"
      sectionTitle="Special Orders"
      sectionIcon={boardPng}
      versions={["v1.5 Introduced"]}
      collapsable
      allDone={goals.allDone}
    >
      <div className={styles.board}>
        <a
          href={StardewWiki.getLink("Quests", "List_of_Special_Orders")}
          target="_blank"
        >
          <img
            height={108}
            className={clsx(
              !goals.globalGoals.objectives.orderCompletion && styles.incomplete
              // !goals.globalGoals.objectives.orderCompletion && styles.incomplete
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

      <SectionPart.Objectives objectives={goals.globalGoals.objectives} />
    </Section>
  );
};
