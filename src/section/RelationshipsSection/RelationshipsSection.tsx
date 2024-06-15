import checkmarkPng from "@src/assets/icon/checkmark-outlined.png";
import heartEmptyPng from "@src/assets/icon/heart_empty.png";
import heartPng from "@src/assets/icon/heart_filled.png";
import heartHalfPng from "@src/assets/icon/heart_half.png";
import questPng from "@src/assets/icon/quest.png";
import { FarmerTag } from "@src/component/FarmerTag";
import { FarmersRow } from "@src/component/FarmersRow";
import { Objective } from "@src/component/Objective";
import { SummarySection } from "@src/component/SummarySection";
import { GameSave } from "@src/gamesave/GameSave";
import { useSyncedScrollbar } from "@src/hook/useSyncedScrollbar";
import { useState } from "react";
import { times } from "remeda";

import styles from "./RelationshipsSection.module.scss";
import { Scrollbox } from "@src/component/Scrollbox";
import { NPC_SPRITES } from "@src/const/Assets";

interface Props {
  gameSave: GameSave;
}

function toHearts(points: number) {
  return Math.floor((points / 250) * 2) / 2;
}

export const RelationshipsSection = (props: Props) => {
  const [expanded, setExpanded] = useState(false);

  const { registerScrollableRef: addScrollableRef } = useSyncedScrollbar([
    expanded,
  ]);

  const farmers = props.gameSave.getAllFarmers();

  return (
    <SummarySection
      id="relationships"
      sectionTitle="Relationships [WIP]"
      sectionIcon={heartPng}
      collapsable
    >
      <FarmersRow>
        {farmers.map((farmer) => {
          return (
            <div key={farmer.name}>
              <FarmerTag farmer={farmer} />

              <div className={styles.objectives}>
                <Objective icon={<img height={16} src={heartPng} />} done>
                  X
                </Objective>
                <Objective icon={<img height={16} src={heartPng} />} done>
                  X
                </Objective>
              </div>

              <Scrollbox
                scrollRef={addScrollableRef}
                expanded={expanded}
                onExpanded={setExpanded}
                className={styles.relationsScrollbox}
              >
                <div className={styles.relations}>
                  {farmer.relationships.map((related) => (
                    <div key={related.name} className={styles.related}>
                      <img
                        width={40}
                        height={40}
                        src={NPC_SPRITES.resolve(related.name.toLowerCase())}
                      />
                      <span>
                        {related.name} ({related.status})
                      </span>
                      <Hearts
                        count={toHearts(
                          Math.min(related.maxPoints, related.points)
                        )}
                        maxCount={toHearts(related.maxPoints)}
                      />
                    </div>
                  ))}
                </div>
              </Scrollbox>
            </div>
          );
        })}
      </FarmersRow>
    </SummarySection>
  );
};

const Hearts = (props: { count: number; maxCount: number }) => {
  const hasHalfHeart = Math.trunc(props.count) !== props.count;
  const fullHeartCount = Math.trunc(props.count);
  const emptyHeartCount = Math.trunc(props.maxCount - props.count);

  return (
    <div className={styles.hearts}>
      {times(fullHeartCount, (i) => (
        <img key={"full" + i} height={14} src={heartPng} />
      ))}
      {hasHalfHeart && <img height={14} src={heartHalfPng} />}
      {times(emptyHeartCount, (i) => (
        <img key={"empty-" + i} height={14} src={heartEmptyPng} />
      ))}
      <span>
        {props.count} / {props.maxCount}{" "}
        {props.count === props.maxCount ? (
          <img src={checkmarkPng} />
        ) : (
          <img src={questPng} />
        )}
      </span>
    </div>
  );
};
