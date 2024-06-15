import heartEmptyPng from "@src/assets/icon/heart_empty.png";
import heartPng from "@src/assets/icon/heart_filled.png";
import heartHalfPng from "@src/assets/icon/heart_half.png";
import bouquetPng from "@src/assets/icon/bouquet.png";
import mermaidPendantPng from "@src/assets/icon/mermaid-pendant.png";
import heartsPng from "@src/assets/icon/hearts.png";
import { AchievementDisplay } from "@src/component/AchievementDisplay";
import { FarmerTag } from "@src/component/FarmerTag";
import { FarmersRow } from "@src/component/FarmersRow";
import { ImageObjective } from "@src/component/ImageObjective";
import { Objective } from "@src/component/Objective";
import { Scrollbox } from "@src/component/Scrollbox";
import { SummarySection } from "@src/component/SummarySection";
import { NPC_SPRITES } from "@src/const/Assets";
import { STARDEW_RELATABLE_NPCS } from "@src/const/StardewNpcs";
import { GameSave } from "@src/gamesave/GameSave";
import { useGoals } from "@src/hook/useGoals";
import { useSyncedScrollbar } from "@src/hook/useSyncedScrollbar";
import { StardewWiki } from "@src/util/StardewWiki";
import { useState } from "react";
import { keys, mapToObj, times } from "remeda";

import styles from "./RelationshipsSection.module.scss";
import { thru } from "@src/util/utilities";

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

  const { allDone, goals } = useGoals({
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
                <Objective icon={<img height={16} src={heartPng} />} done>
                  Marital status:{" "}
                  {thru(
                    farmer.relationships.find(
                      (r) => r.status === "Married" || r.status === "Roommate"
                    ),
                    (partner) =>
                      partner ? (
                        <>
                          Married to <strong>{partner.name}</strong>
                        </>
                      ) : (
                        "Single"
                      )
                  )}
                </Objective>
                <Objective icon={<img height={16} src={heartPng} />} done>
                  Has <strong>{h5.length}</strong> relationship(s) of 5+ hearts.
                  (excluding children)
                </Objective>
                <Objective icon={<img height={16} src={heartPng} />} done>
                  Has <strong>{h10.length}</strong> relationship(s) of 10+
                  hearts. (excluding children)
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

              <div>
                <AchievementDisplay
                  title={farmerAchievements.aNewFriend.title}
                  achieved={farmerAchievements.aNewFriend.achieved}
                  description={`reach a ${farmerAchievements.aNewFriend.minPoints}-heart friend level with ${farmerAchievements.aNewFriend.goal}`}
                />
                <AchievementDisplay
                  title={farmerAchievements.cliques.title}
                  achieved={farmerAchievements.cliques.achieved}
                  description={`reach a ${farmerAchievements.cliques.minPoints}-heart friend level with ${farmerAchievements.cliques.goal}`}
                />
                <AchievementDisplay
                  title={farmerAchievements.networking.title}
                  achieved={farmerAchievements.networking.achieved}
                  description={`reach a ${farmerAchievements.networking.minPoints}-heart friend level with ${farmerAchievements.networking.goal}`}
                />
                <AchievementDisplay
                  title={farmerAchievements.bestFriends.title}
                  achieved={farmerAchievements.bestFriends.achieved}
                  description={`reach a ${farmerAchievements.bestFriends.minPoints}-heart friend level with ${farmerAchievements.bestFriends.goal}`}
                />
                <AchievementDisplay
                  title={farmerAchievements.theBelovedFarmer.title}
                  achieved={farmerAchievements.theBelovedFarmer.achieved}
                  description={`reach a ${farmerAchievements.theBelovedFarmer.minPoints}-heart friend level with ${farmerAchievements.theBelovedFarmer.goal}`}
                />
                <div>
                  <Objective
                    className={styles.objective}
                    done={farmerGoals.objectives.maxedOut}
                  >
                    Reached max heart with every townsfolk.
                  </Objective>
                  <span style={{ opacity: 0.4 }}>
                    (8-heart is considered max for dateable ones)
                  </span>
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
