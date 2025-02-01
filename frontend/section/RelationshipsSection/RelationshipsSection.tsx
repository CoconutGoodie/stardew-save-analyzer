import bouquetPng from "~frontend/assets/icon/bouquet.png";
import heartEmptyPng from "~frontend/assets/icon/heart_empty.png";
import heartPng from "~frontend/assets/icon/heart_filled.png";
import heartHalfPng from "~frontend/assets/icon/heart_half.png";
import heartsPng from "~frontend/assets/icon/hearts.png";
import mermaidPendantPng from "~frontend/assets/icon/mermaid-pendant.png";
import { AchievementDisplay } from "~frontend/component/AchievementDisplay";
import { FarmerTag } from "~frontend/component/FarmerTag";
import { FarmersRow } from "~frontend/component/FarmersRow/FarmersRow";
import { ImageObjective } from "~frontend/component/ImageObjective";
import { ObjectiveOLD } from "~frontend/component/Objective/Objective";
import { Scrollbox } from "~frontend/component/Scrollbox";
import { SummarySection } from "~frontend/component/SummarySection";
import { NPC_SPRITES } from "~frontend/const/Assets";
import { GameSave } from "~frontend/gamesave/GameSave";
import { useGoals_OLD } from "~frontend/hook/useGoals_OLD";
import { useSyncedScrollbar } from "~frontend/hook/useSyncedScrollbar";
import { StardewWiki } from "~frontend/util/StardewWiki";
import { useState } from "react";
import { keys, mapToObj, times } from "remeda";

import { thru } from "~frontend/util/utilities";
import styles from "./RelationshipsSection.module.scss";
import { STARDEW_RELATABLE_NPCS } from "~frontend/const/StardewNpcs";
import { InfoText } from "~frontend/component/InfoText";

interface Props {
  gameSave: GameSave;
}

function toHearts(points: number) {
  return Math.floor((points / 250) * 2) / 2;
}

export const RelationshipsSection = (props: Props) => {
  const [expanded, setExpanded] = useState(false);

  const { registerScrollableRef } = useSyncedScrollbar([expanded]);

  const farmers = props.gameSave.getAllFarmers();

  const { allDone, goals } = useGoals_OLD({
    individuals: mapToObj(farmers, (farmer) => [
      farmer.name,
      {
        achievements: [
          props.gameSave.achievements[farmer.name].aNewFriend,
          props.gameSave.achievements[farmer.name].cliques,
          props.gameSave.achievements[farmer.name].networking,
          props.gameSave.achievements[farmer.name].bestFriends,
          props.gameSave.achievements[farmer.name].theBelovedFarmer,
        ],
        objectives: {
          maxedOut: farmer.relationships
            .filter((r) => !r.isChild)
            .every((r) => r.points >= (r.dateable ? 250 * 8 : r.maxPoints)),
        },
      },
    ]),
  });

  return (
    <SummarySection
      id="relationships"
      sectionTitle="Relationships"
      sectionIcon={heartPng}
      collapsable
      allDone={allDone}
    >
      <FarmersRow>
        {farmers.map((farmer) => {
          const farmerAchievements = props.gameSave.achievements[farmer.name];
          const farmerGoals = goals.individuals[farmer.name];

          const h5 = farmer.relationships.filter(
            (r) => !r.isChild && r.points >= 250 * 5
          );
          const h10 = farmer.relationships.filter(
            (r) => !r.isChild && r.points >= 250 * 10
          );

          return (
            <div key={farmer.name}>
              <FarmerTag farmer={farmer} />

              <div className={styles.objectives}>
                {/* <Objective icon={<img height={16} src={heartPng} />} done>
                  Met every townsfolk.
                </Objective> */}
                <ObjectiveOLD icon={<img height={16} src={heartPng} />} done>
                  Marital status:{" "}
                  {thru(
                    farmer.relationships.find(
                      (r) => r.status === "Married" || r.status === "Roommate"
                    ),
                    (partner) =>
                      partner ? (
                        <strong>Married to {partner.name}</strong>
                      ) : (
                        <strong>Single</strong>
                      )
                  )}
                </ObjectiveOLD>
                <ObjectiveOLD icon={<img height={16} src={heartPng} />} done>
                  Has 5+ hearts with <strong>{h5.length}</strong> of{" "}
                  <strong>{keys(STARDEW_RELATABLE_NPCS).length}</strong> people
                  (excluding children)
                </ObjectiveOLD>
                <ObjectiveOLD icon={<img height={16} src={heartPng} />} done>
                  Has 10+ hearts with <strong>{h10.length}</strong> of{" "}
                  <strong>{keys(STARDEW_RELATABLE_NPCS).length}</strong> people
                  (excluding children)
                </ObjectiveOLD>
              </div>

              <Scrollbox
                scrollRef={registerScrollableRef}
                expanded={expanded}
                onExpanded={setExpanded}
                className={styles.relationsScrollbox}
              >
                <div className={styles.relations}>
                  {farmer.relationships.map((related) => (
                    <div key={related.name} className={styles.related}>
                      <div className={styles.npc}>
                        <a
                          target="_blank"
                          href={StardewWiki.getLink(related.name)}
                        >
                          <ImageObjective
                            width={40}
                            height={40}
                            src={
                              related.isChild
                                ? NPC_SPRITES.resolve("child")
                                : NPC_SPRITES.resolve(
                                    related.name.toLowerCase()
                                  )
                            }
                            done
                            checkmarkInvisible
                          />
                        </a>
                        <span>
                          {related.name} {related.isChild && "(Child)"}—{" "}
                          {related.status}
                        </span>
                        <Hearts
                          count={toHearts(
                            Math.min(related.maxPoints, related.points)
                          )}
                          maxCount={toHearts(related.maxPoints)}
                        />
                      </div>

                      <div className={styles.summary}>
                        {related.dateable && (
                          <>
                            {related.status === "Married" ||
                            related.status === "Roommate" ? (
                              <ImageObjective
                                width={40}
                                height={40}
                                src={mermaidPendantPng}
                                done
                              />
                            ) : (
                              <ImageObjective
                                width={40}
                                height={40}
                                src={bouquetPng}
                                done={related.status === "Dating"}
                              />
                            )}
                          </>
                        )}
                        <ImageObjective
                          width={40}
                          height={40}
                          src={heartsPng}
                          done={
                            related.points >=
                            (related.dateable ? 250 * 8 : related.maxPoints)
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Scrollbox>

              <InfoText>
                <strong>8-heart</strong> is considered max for dateable folk.
              </InfoText>

              <div>
                {goals.individuals[farmer.name].achievements.map(
                  (achievement) => (
                    <AchievementDisplay
                      key={achievement.title}
                      title={achievement.title}
                      achieved={achievement.achieved}
                      description={`reach a ${achievement.minHearts}-heart friend level with ${achievement.goal}`}
                    />
                  )
                )}
                <div>
                  <ObjectiveOLD
                    className={styles.objective}
                    done={farmerGoals.objectives.maxedOut}
                  >
                    Reached max heart with every townsfolk.
                  </ObjectiveOLD>
                </div>
              </div>
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
        <img key={"full" + i} height={12} src={heartPng} />
      ))}
      {hasHalfHeart && <img height={12} src={heartHalfPng} />}
      {times(emptyHeartCount, (i) => (
        <img key={"empty-" + i} height={12} src={heartEmptyPng} />
      ))}
      <span>
        {props.count} / {props.maxCount}{" "}
        {/* {props.count === props.maxCount ? (
          <img src={checkmarkPng} />
        ) : (
          <img src={questPng} />
        )} */}
      </span>
    </div>
  );
};
