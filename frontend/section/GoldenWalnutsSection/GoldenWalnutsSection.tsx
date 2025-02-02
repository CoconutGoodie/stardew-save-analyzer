import { capitalCase, snakeCase } from "case-anything";
import { entries, sum, times } from "remeda";
import { ImageObjective } from "~frontend/component/ImageObjective";
import { SummarySection } from "~frontend/component/SummarySection";
import { Tooltip } from "~frontend/component/Tooltip/Tooltip";
import {
  STARDEW_GOLDEN_WALNUTS,
  STARDEW_GOLDEN_WALNUTS_COUNT,
} from "~frontend/const/StardewGoldenWalnuts";
import { GameSave } from "~frontend/gamesave/GameSave";

import checkmarkPng from "~frontend/assets/icon/checkmark.png";
import goldenWalnutPng from "~frontend/assets/icon/golden-walnut.png";
import goldenParrotPng from "~frontend/assets/icon/golden-parrot.png";

import { GOLDEN_WALNUT_HINT_SPRITES } from "~frontend/const/Assets";
import { useGoals_OLD } from "~frontend/hook/useGoals_OLD";
import { StardewWiki } from "~frontend/util/StardewWiki";
import styles from "./GoldenWalnutsSection.module.scss";
import { ObjectiveOLD } from "~frontend/component/Objective/Objective";
import { Currency } from "~frontend/component/Currency";

interface Props {
  gameSave: GameSave;
}

export function GoldenWalnutsSection(props: Props) {
  const { goldenWalnuts } = props.gameSave;

  const { allDone, goals } = useGoals_OLD({
    global: {
      objectives: {
        visitGingerIsland: true, // TODO
        gainAccessToQisWalnutRoom: {
          current: goldenWalnuts.parrotUsed
            ? 100
            : goldenWalnuts.calculatedTotal,
          goal: 100,
        },
        queenOfSauceAvailable: {
          current: goldenWalnuts.parrotUsed
            ? 100
            : goldenWalnuts.calculatedTotal,
          goal: 100,
        },
        collectEveryNut: {
          current: goldenWalnuts.parrotUsed
            ? STARDEW_GOLDEN_WALNUTS_COUNT
            : goldenWalnuts.calculatedTotal,
          goal: STARDEW_GOLDEN_WALNUTS_COUNT,
        },
      },
    },
  });

  const goldenParrotJsx = (
    <a
      href={StardewWiki.getLink("Golden_Walnut", "Golden_Joja_Parrot")}
      target="_blank"
    >
      Golden Parrot
    </a>
  );

  return (
    <SummarySection
      id="golden-walnuts"
      sectionTitle="Golden Walnuts"
      sectionIcon={goldenWalnutPng}
      versions={["v1.5 Introduced"]}
      collapsable
      allDone={allDone}
    >
      <div className={styles.goldenParrot}>
        <img src={goldenParrotPng} height={50} />
        {goals.global.objectiveStatus.collectEveryNut === "done" ? (
          goldenWalnuts.parrotUsed ? (
            <p>{goldenParrotJsx} was paid to fetch remaining Golden Walnuts.</p>
          ) : (
            <p>
              {goldenParrotJsx} was <strong>NOT</strong> paid to fetch any
              Golden Walnuts.
            </p>
          )
        ) : (
          <p>
            {goldenParrotJsx} will charge{" "}
            <Currency
              unit="gold"
              amount={
                10_000 *
                (STARDEW_GOLDEN_WALNUTS_COUNT -
                  goals.global.objectives.collectEveryNut.current)
              }
            />{" "}
            to fetch remaining Golden Walnuts.
          </p>
        )}
      </div>

      <div className={styles.locations}>
        {entries(STARDEW_GOLDEN_WALNUTS).map(([locationId, walnuts]) => {
          const maxObtainable = sum(walnuts.map((w) => w.quantity));
          const obtained = sum(
            walnuts.map((w) => goldenWalnuts.collection[w.id] ?? 0)
          );

          let locationWalnutId = 1;

          return (
            <div key={locationId} className={styles.location}>
              <h1>
                {capitalCase(locationId.replaceAll("_", " "))}{" "}
                <span>
                  ({obtained} / {maxObtainable})
                </span>
                {obtained >= maxObtainable && (
                  <img src={checkmarkPng} height={14} />
                )}
              </h1>

              <div className={styles.walnuts}>
                {walnuts.map((walnut, walnutIndex) =>
                  times(walnut.quantity, (i) => (
                    <Tooltip.Root key={walnutIndex + "." + i}>
                      <Tooltip.Trigger>
                        <a
                          href={StardewWiki.getLink(
                            "Golden_Walnut",
                            "Walnut_Locations"
                          )}
                          target="_blank"
                        >
                          <ImageObjective
                            done={
                              goldenWalnuts.collection[walnut.id] <=
                              walnut.quantity
                            }
                            src={goldenWalnutPng}
                            height={38}
                          />
                        </a>
                      </Tooltip.Trigger>

                      <Tooltip.Content className={styles.walnutTooltip}>
                        <img
                          src={GOLDEN_WALNUT_HINT_SPRITES.resolve(walnut.id)}
                        />
                        <div>
                          <h1>
                            Golden Walnut -{" "}
                            {capitalCase(locationId.replaceAll("_", " "))} #
                            {locationWalnutId++}
                          </h1>
                          <p>{walnut.howToFind}</p>
                        </div>
                      </Tooltip.Content>
                    </Tooltip.Root>
                  ))
                )}
              </div>
            </div>
          );
        })}
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
            more needed
          </>
        )}
      </ObjectiveOLD>

      <ObjectiveOLD
        className={styles.objective}
        done={goals.global.objectiveStatus.gainAccessToQisWalnutRoom === "done"}
      >
        Unlocked "Queen of Sauce Cookbook" trade in the Bookseller.{" "}
        {goals.global.objectiveStatus.queenOfSauceAvailable !== "done" && (
          <>
            —{" "}
            {goals.global.objectives.queenOfSauceAvailable.goal -
              goals.global.objectives.queenOfSauceAvailable.current}{" "}
            more needed
          </>
        )}
      </ObjectiveOLD>

      <ObjectiveOLD
        className={styles.objective}
        done={goals.global.objectiveStatus.gainAccessToQisWalnutRoom === "done"}
      >
        Collected every Golden Walnut.{" "}
        {goals.global.objectiveStatus.collectEveryNut !== "done" && (
          <>
            —{" "}
            {goals.global.objectives.collectEveryNut.goal -
              goals.global.objectives.collectEveryNut.current}{" "}
            more needed
          </>
        )}
      </ObjectiveOLD>
    </SummarySection>
  );
}
