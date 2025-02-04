import clsx from "clsx";
import { Children, PropsWithChildren, ReactNode } from "react";
import { AchievementDisplay } from "~frontend/component/AchievementDisplay/AchievementDisplay";
import { Objective } from "~frontend/component/Objective/Objective";
import { Achievement } from "~frontend/gamesave/Achievements";
import { ObjectiveSummary } from "~frontend/hook/useGoals";

import styles from "./SectionPart.module.scss";
import { entries } from "remeda";

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

  Achievements(props: { achievements: Achievement[] }) {
    return (
      <div className={styles.achievements}>
        {props.achievements.map((achievement) => (
          <AchievementDisplay
            key={achievement.title}
            title={achievement.title}
            achieved={achievement.achieved}
            description={achievement.description}
          >
            {!achievement.achieved && achievement.achieveHint && (
              <>— {achievement.achieveHint()}</>
            )}
          </AchievementDisplay>
        ))}
      </div>
    );
  },

  Objectives(props: {
    objectives: Record<string, ObjectiveSummary> | ObjectiveSummary[];
  }) {
    return (
      <div className={styles.objectives}>
        {Array.isArray(props.objectives)
          ? props.objectives.map((objective, i) => (
              <Objective key={i} objective={objective} />
            ))
          : entries(props.objectives).map(([id, objective]) => (
              <Objective key={id} objective={objective} />
            ))}
      </div>
    );
  },
};
