import { capitalCase, snakeCase } from "case-anything";
import { entries, times } from "remeda";
import { ImageObjective } from "~frontend/component/ImageObjective";
import { SummarySection } from "~frontend/component/SummarySection";
import { Tooltip } from "~frontend/component/Tooltip/Tooltip";
import { STARDEW_GOLDEN_WALNUTS } from "~frontend/const/StardewGoldenWalnuts";
import { GameSave } from "~frontend/gamesave/GameSave";

import goldenWalnutPng from "~frontend/assets/icon/golden-walnut.png";

import styles from "./GoldenWalnutsSection.module.scss";
import { GOLDEN_WALNUT_HINT_SPRITES } from "~frontend/const/Assets";
import { StardewWiki } from "~frontend/util/StardewWiki";

interface Props {
  gameSave: GameSave;
}

export function GoldenWalnutsSection(props: Props) {
  return (
    <SummarySection
      id="golden-walnuts"
      sectionTitle="Golden Walnuts"
      sectionIcon={goldenWalnutPng}
      versions={["v1.5 Introduced"]}
      // className={styles.section}
      collapsable
      // allDone={allDone}
    >
      <div className={styles.locations}>
        {entries(STARDEW_GOLDEN_WALNUTS).map(([locationId, walnuts]) => {
          return (
            <div key={locationId} className={styles.location}>
              <h1>{capitalCase(locationId.replaceAll("_", " "))} (X / N)</h1>

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
                            done={false}
                            src={goldenWalnutPng}
                            height={38}
                          />
                        </a>
                      </Tooltip.Trigger>

                      <Tooltip.Content className={styles.walnutTooltip}>
                        <img
                          src={GOLDEN_WALNUT_HINT_SPRITES.resolve(
                            `${snakeCase(locationId)}_${walnutIndex + 1}`
                          )}
                        />
                        <p>{walnut.howToFind}</p>
                      </Tooltip.Content>
                    </Tooltip.Root>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </SummarySection>
  );
}
