import { lowerCase } from "case-anything";
import { clsx } from "clsx";
import { PropsWithChildren, ReactNode } from "react";
import { AssetRepository } from "../util/AssetRepository";
import { StardewWiki } from "../util/StardewWiki";

import checkmarkPng from "../assets/icon/checkmark.png";

import styles from "./AchievementDisplay.module.scss";

interface Props extends PropsWithChildren {
  title: string;
  description?: ReactNode;
  achieved?: boolean;
  inline?: boolean;
}

const platformSprites = new AssetRepository<{ default: string }>(
  import.meta.glob("../assets/sprite/achievement/platform/*.png", {
    eager: true,
  }),
  "../assets/sprite/achievement/platform/",
  ".png"
);

const ingameSprites = new AssetRepository<{ default: string }>(
  import.meta.glob("../assets/sprite/achievement/ingame/*.png", {
    eager: true,
  }),
  "../assets/sprite/achievement/ingame/",
  ".png"
);

export const AchievementDisplay = (props: Props) => {
  const achievementId = lowerCase(props.title)
    .replace(/\s+/g, "_")
    .replace(/'/, "");

  return (
    <div className={clsx(styles.container, props.inline && styles.inline)}>
      {/* <img
        width={25}
        alt="In-game Icon"
        title="In-game Icon"
        className={clsx(!props.achieved && styles.unchieved, styles.icon)}
        src={
          (
            ingameSprites.resolve(achievementId) ??
            ingameSprites.resolve("cowpoke")
          )?.default
        }
      /> */}
      <img
        width={30}
        alt="Platform Icon"
        title="Platform Icon"
        className={clsx(!props.achieved && styles.unachieved, styles.icon)}
        src={
          (
            platformSprites.resolve(achievementId.replace(/\./g, "")) ??
            platformSprites.resolve("unknown")
          )?.default
        }
      />

      <div className={clsx(!props.achieved && styles.unachieved, styles.text)}>
        <a
          href={StardewWiki.getLink("Achievements", "Achievements_List")}
          target="_blank"
        >
          {props.title}
        </a>

        {props.description && <span>({props.description})</span>}

        {props.children}
      </div>

      {props.achieved && !props.inline && <img src={checkmarkPng} />}
    </div>
  );
};
