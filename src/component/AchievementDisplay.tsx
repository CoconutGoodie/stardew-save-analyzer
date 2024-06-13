import { ACHIEVEMENT_SPRITES } from "@src/const/Assets";
import { lowerCase } from "case-anything";
import { clsx } from "clsx";
import { PropsWithChildren, ReactNode } from "react";
import checkmarkPng from "@src/assets/icon/checkmark.png";
import { StardewWiki } from "@src/util/StardewWiki";

import styles from "./AchievementDisplay.module.scss";

interface Props extends PropsWithChildren {
  title: string;
  description?: ReactNode;
  achieved?: boolean;
  inline?: boolean;
}

export const AchievementDisplay = (props: Props) => {
  const achievementId = lowerCase(props.title)
    .replace(/\s+/g, "_")
    .replace(/'/, "");

  return (
    <div className={clsx(styles.container, props.inline && styles.inline)}>
      <img
        width={30}
        alt="Platform Icon"
        title="Platform Icon"
        className={clsx(!props.achieved && styles.unachieved, styles.icon)}
        src={ACHIEVEMENT_SPRITES.resolve(achievementId.replace(/\./g, ""))}
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
