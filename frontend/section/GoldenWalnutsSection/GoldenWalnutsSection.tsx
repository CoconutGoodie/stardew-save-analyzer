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

import { GOLDEN_WALNUT_HINT_SPRITES } from "~frontend/const/Assets";
import { useGoals } from "~frontend/hook/useGoals";
import { StardewWiki } from "~frontend/util/StardewWiki";
import styles from "./GoldenWalnutsSection.module.scss";
import { Objective } from "~frontend/component/Objective";

interface Props {
  gameSave: GameSave;
}

export function GoldenWalnutsSection(props: Props) {
  console.log(props.gameSave.goldenWalnuts);

  const { goldenWalnuts } = props.gameSave;

  const { allDone, goals } = useGoals({
    global: {
      objectives: {
        visitGingerIsland: true, // TODO
        gainAccessToQisWalnutRoom: {
          current: goldenWalnuts.calculatedTotal,
          goal: 100,
        },
        queenOfSauceAvailable: {
          current: goldenWalnuts.calculatedTotal,
          goal: 100,
        },
        collectEveryNut: {
          current: goldenWalnuts.calculatedTotal,
          goal: STARDEW_GOLDEN_WALNUTS_COUNT,
        },
      },
    },
    // individuals: mapToObj(farmers, (farmer) => [
    //   farmer.name,
    //   {
    //     achievements: [
    //       props.gameSave.achievements[farmer.name].diy,
    //       props.gameSave.achievements[farmer.name].artisan,
    //       props.gameSave.achievements[farmer.name].craftMaster,
    //     ],
    //   },
    // ]),
  });

  return (
    <SummarySection
      id="golden-walnuts"
      sectionTitle="Golden Walnuts"
      sectionIcon={goldenWalnutPng}
      versions={["v1.5 Introduced"]}
      // className={styles.section}
      collapsable
      allDone={allDone}
    >
      <div className={styles.locations}>
        {entries(STARDEW_GOLDEN_WALNUTS).map(([locationId, walnuts]) => {
          const maxObtainable = sum(walnuts.map((w) => w.quantity));

          let locationWalnutId = 1;

          return (
            <div key={locationId} className={styles.location}>
              <h1>
                {capitalCase(locationId.replaceAll("_", " "))}{" "}
                <span>(X / {maxObtainable})</span>
                <img src={checkmarkPng} height={14} />
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
                            // TODO: Yeet after debugging
                            style={
                              walnut.id == null
                                ? { background: "red" }
                                : undefined
                            }
                            done={
                              goldenWalnuts.collection[walnut.id ?? ""] <=
                              walnut.quantity
                            }
                            src={goldenWalnutPng}
                            height={38}
                          />
                        </a>
                      </Tooltip.Trigger>

                      <Tooltip.Content className={styles.walnutTooltip}>
                        {/* <img
                          src={GOLDEN_WALNUT_HINT_SPRITES.resolve(
                            `${snakeCase(locationId)}_${walnutIndex + 1}`
                          )}
                        /> */}
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
                          <h6>{walnut.id}</h6>
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

      <Objective
        className={styles.objective}
        done={goals.global.objectiveStatus.gainAccessToQisWalnutRoom === "done"}
      >
        Gain access to "Mr. Qi's Walnut Room".{" "}
        {goals.global.objectiveStatus.gainAccessToQisWalnutRoom !== "done" && (
          <>
            —{" "}
            {goals.global.objectives.gainAccessToQisWalnutRoom.goal -
              goals.global.objectives.gainAccessToQisWalnutRoom.current}{" "}
            more needed
          </>
        )}
      </Objective>

      <Objective
        className={styles.objective}
        done={goals.global.objectiveStatus.gainAccessToQisWalnutRoom === "done"}
      >
        Unlock "Queen of Sauce Cookbook" trade in the Bookseller.{" "}
        {goals.global.objectiveStatus.queenOfSauceAvailable !== "done" && (
          <>
            —{" "}
            {goals.global.objectives.queenOfSauceAvailable.goal -
              goals.global.objectives.queenOfSauceAvailable.current}{" "}
            more needed
          </>
        )}
      </Objective>

      <Objective
        className={styles.objective}
        done={goals.global.objectiveStatus.gainAccessToQisWalnutRoom === "done"}
      >
        Collect every Golden Walnut.{" "}
        {goals.global.objectiveStatus.collectEveryNut !== "done" && (
          <>
            —{" "}
            {goals.global.objectives.collectEveryNut.goal -
              goals.global.objectives.collectEveryNut.current}{" "}
            more needed
          </>
        )}
      </Objective>
    </SummarySection>
  );
}
