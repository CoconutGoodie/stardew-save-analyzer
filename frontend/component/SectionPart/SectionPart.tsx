import { Children, PropsWithChildren, ReactNode } from "react";
import { Achievement } from "~frontend/gamesave/Achievements";

import { AchievementDisplay } from "~frontend/component/AchievementDisplay";
import styles from "./SectionPart.module.scss";
import clsx from "clsx";

export const SectionPart = {
  Statistics(
    props: PropsWithChildren<{ icon?: ReactNode; className?: string }>
  ) {
    return (
      <ul
        className={clsx(styles.statistics, props.className)}
        data-has-icon={props.icon != null}
      >
        {Children.map(
          props.children,
          (child) =>
            child && (
              <li>
                {props.icon ? (
                  <>
                    {props.icon} {child}
                  </>
                ) : (
                  child
                )}
              </li>
            )
        )}
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
