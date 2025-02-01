import { Children, PropsWithChildren, ReactNode } from "react";
import { ObjectiveOLD } from "~frontend/component/Objective/Objective";
import { Achievement } from "~frontend/gamesave/Achievements";

import styles from "./SectionPart.module.scss";
import { AchievementDisplay } from "~frontend/component/AchievementDisplay";

export const SectionPart = {
  Statistics(props: PropsWithChildren<{ icon?: ReactNode }>) {
    return (
      <ul className={styles.statistics} data-has-icon={props.icon != null}>
        {Children.map(props.children, (child) => (
          <li>
            {props.icon ? (
              <>
                {props.icon} {child}
              </>
            ) : (
              child
            )}
          </li>
        ))}
      </ul>
    );
  },

  Achievements: (props: { achievements: Achievement[] }) => {
    return (
      <div className={styles.achievements}>
        {props.achievements.map((achievement) => (
          <AchievementDisplay
            key={achievement.title}
            title={achievement.title}
            achieved={achievement.achieved}
            description={achievement.description}
          >
            {!achievement.achieved && <>— {achievement.achieveHint?.()}</>}
          </AchievementDisplay>
        ))}
      </div>
    );
  },
};
