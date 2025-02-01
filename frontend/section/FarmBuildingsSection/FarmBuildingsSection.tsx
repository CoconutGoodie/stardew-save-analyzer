import heartFilledPng from "~frontend/assets/icon/heart_filled.png";
import chickenPng from "~frontend/assets/icon/chicken.png";
import { Scrollbox } from "~frontend/component/Scrollbox";
import { SummarySection } from "~frontend/component/SummarySection";
import {
  FARM_ANIMALS_SPRITES,
  FARM_BUILDING_SPRITES,
  FISH_SPRITES,
} from "~frontend/const/Assets";
import { GameSave } from "~frontend/gamesave/GameSave";
import { StardewWiki } from "~frontend/util/StardewWiki";
import { snakeCase } from "case-anything";
import clsx from "clsx";
import { useState } from "react";
import { sum, times } from "remeda";

import styles from "./FarmBuildingsSection.module.scss";
import { ObjectiveOLD } from "~frontend/component/Objective/Objective";
import { SectionPart } from "~frontend/component/SectionPart/SectionPart";

interface Props {
  gameSave: GameSave;
}

export const FarmBuildingsSection = (props: Props) => {
  const [expanded, setExpanded] = useState(false);

  const totalAnimalCount =
    props.gameSave.pets.length +
    props.gameSave.stables.length +
    sum(
      props.gameSave.animalBuildings.map((building) => building.animals.length)
    ) +
    sum(props.gameSave.fishPonds.map((pond) => pond.count));

  const buildingJsx = [
    ...props.gameSave.animalBuildings.map((building, index) => (
      <BuildingPart
        key={`building-${index}`}
        name={building.type}
        capacity={building.capacity}
        iconSrc={FARM_BUILDING_SPRITES.resolve(snakeCase(building.type))}
        animals={building.animals.map((animal) => ({
          name: animal.name,
          lovePercentage: animal.love / 1000,
          wikiUrl: StardewWiki.getLink(animal.type.split(/\s+/g).at(-1)!),
          iconSrc: FARM_ANIMALS_SPRITES.resolve(snakeCase(animal.type)),
          iconHeight: building.type.endsWith("Barn") ? 42 : 32,
        }))}
      />
    )),

    ...props.gameSave.fishPonds.map((pond, index) => (
      <BuildingPart
        key={`pond-${index}`}
        name={`${pond.fish ?? "Empty"} Pond`}
        capacity={pond.capacity}
        iconSrc={FARM_BUILDING_SPRITES.resolve("fish_pond")}
        emptyIconSrc={
          pond.fish == null ? "" : FISH_SPRITES.resolve(snakeCase(pond.fish))
        }
        animals={times(pond.count, () => ({
          iconHeight: 40,
          iconSrc: FISH_SPRITES.resolve(snakeCase(pond.fish)),
          wikiUrl: StardewWiki.getLink(pond.fish),
        }))}
      />
    )),

    props.gameSave.stables.length > 0 && (
      <BuildingPart
        key="stable"
        name="Stable"
        iconSrc={FARM_BUILDING_SPRITES.resolve("stable")}
        animals={props.gameSave.stables.map(() => ({
          wikiUrl: StardewWiki.getLink("Horse"),
          iconSrc: FARM_ANIMALS_SPRITES.resolve("horse"),
          iconHeight: 70,
        }))}
      />
    ),

    props.gameSave.pets.length > 0 && (
      <BuildingPart
        key="pet_bowl"
        name="Pet Bowl"
        iconSrc={FARM_BUILDING_SPRITES.resolve("pet_bowl")}
        animals={props.gameSave.pets.map((pet) => ({
          name: pet.name,
          lovePercentage: pet.love / 1000,
          //Website doesn't redirect /Turtle to /Animals#Turtle
          wikiUrl:
            pet.type == "Turtle"
              ? "https://stardewvalleywiki.com/Animals#Turtle"
              : StardewWiki.getLink(pet.type),
          //Turtles don't have a breed
          iconSrc: FARM_ANIMALS_SPRITES.resolve(
            pet.type == "Turtle"
              ? "turtle"
              : snakeCase(pet.type) + "_" + pet.breed
          ),
          iconHeight: 50,
        }))}
      />
    ),
  ].filter((jsx) => !!jsx);

  return (
    <SummarySection
      id="farm-buildings"
      sectionTitle="Farm Buildings"
      sectionIcon={chickenPng}
      className={styles.section}
      collapsable
    >
      <SectionPart.Statistics>
        <>
          <strong>{props.gameSave.farmName} Farm</strong> has{" "}
          <strong>{buildingJsx.length}</strong> farm building(s) in total.
        </>
        <>
          <strong>{props.gameSave.farmName} Farm</strong> is home to{" "}
          <strong>{totalAnimalCount}</strong> animal(s).
        </>
      </SectionPart.Statistics>
      <Scrollbox
        scrollClassName={styles.scrollbox}
        expanded={expanded}
        onExpanded={setExpanded}
      >
        <div className={styles.buildings}>{buildingJsx}</div>
      </Scrollbox>
    </SummarySection>
  );
};

/* ---------- */

const BuildingPart = (props: {
  name: string;
  iconSrc: string;
  emptyIconSrc?: string;
  capacity?: number;
  animals: {
    name?: string;
    lovePercentage?: number;
    iconSrc: string;
    iconHeight: number;
    wikiUrl: string;
  }[];
}) => {
  return (
    <div key="pets" className={styles.building}>
      <img width="100%" src={props.iconSrc} />

      <div>
        <div className={styles.info}>
          <span>{props.name}</span>
          {props.capacity != null && (
            <span>
              ({props.animals.length} / {props.capacity})
            </span>
          )}
        </div>

        <div className={styles.animals}>
          {props.animals.map((animal, i) => (
            <a
              key={animal.name + "_" + i}
              target="_blank"
              href={animal.wikiUrl}
              className={styles.animal}
            >
              <img height={animal.iconHeight} src={animal.iconSrc} />
              {animal.name && <span>{animal.name}</span>}
              {animal.lovePercentage != null && (
                <span>
                  <img height={12} src={heartFilledPng} />{" "}
                  {Math.floor(animal.lovePercentage * 100)}%
                </span>
              )}
            </a>
          ))}

          {props.capacity != null &&
            times(Math.max(0, props.capacity - props.animals.length), (i) => (
              <div
                key={"empty-" + i}
                className={clsx(styles.animal, styles.empty)}
              >
                <img
                  height={32}
                  src={
                    props.emptyIconSrc ?? FARM_ANIMALS_SPRITES.resolve("empty")
                  }
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
