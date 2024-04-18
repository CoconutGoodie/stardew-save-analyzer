import { PropsWithChildren, ReactNode } from "react";
import styles from "./Achievement.module.scss";
import { AssetRepository } from "../util/AssetRepository";
import { lowerCase } from "case-anything";
import { clsx } from "clsx";

interface Props extends PropsWithChildren {
  title: string;
  description?: ReactNode;
  achieved?: boolean;
}

const achievementSprites = new AssetRepository<{ default: string }>(
  import.meta.glob("../assets/achievement/ingame/*.png", { eager: true }),
  "../assets/achievement/ingame/",
  ".png"
);

export const Achievement = (props: Props) => {
  const achievementId = lowerCase(props.title).replace(/\s+/g, "_");

  return (
    <div className={styles.container}>
      <img
        width={25}
        className={clsx(!props.achieved && styles.unchieved, styles.icon)}
        src={
          (
            achievementSprites.resolve(achievementId) ??
            achievementSprites.resolve("cowpoke")
          )?.default
        }
      />

      <div className={styles.text}>
        <a
          href="https://stardewvalleywiki.com/Achievements#Achievements_List"
          target="_blank"
        >
          {props.title}
        </a>

        {props.description && <> ({props.description})</>}

        {props.children}
      </div>
    </div>
  );
};
