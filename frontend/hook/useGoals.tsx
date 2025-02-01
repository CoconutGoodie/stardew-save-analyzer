import { DependencyList, ReactNode, useMemo } from "react";
import { pick } from "remeda";
import { Achievement } from "~frontend/gamesave/Achievements";
import { Farmer } from "~frontend/gamesave/Farmer";

interface ObjectiveBase {
  type: string;
  description: ReactNode;
  hint?: (objective: this) => ReactNode;
}

interface TriggerableObjective extends ObjectiveBase {
  type: "triggerable";
  triggered: boolean;
}

interface ProgressiveObjective extends ObjectiveBase {
  type: "progressive";
  current: number;
  goal: number;
}

export type ObjectiveConfig = TriggerableObjective | ProgressiveObjective;

export type ObjectiveSummary = ReturnType<
  typeof sanitizeGoals
>["objectives"][number];

export interface GoalsConfig {
  achievements?: Achievement[];
  objectives?: ObjectiveConfig[];
}

export interface UseGoalsOptions {
  global?: GoalsConfig;
  individuals?: ({ farmer: Farmer } & GoalsConfig)[];
}

function isObjectiveDone(config: ObjectiveConfig) {
  switch (config.type) {
    case "triggerable":
      return config.triggered;
    case "progressive":
      return config.current >= config.goal;
    default:
      throw new Error("Unknown objective shape: " + config);
  }
}

function sanitizeGoals(config: GoalsConfig) {
  return {
    achievements: config.achievements ?? [],
    objectives: (config.objectives ?? []).map((objectiveConfig) => {
      return {
        done: isObjectiveDone(objectiveConfig),
        config: objectiveConfig,
        ...pick(objectiveConfig, ["description", "hint"]),
      };
    }),
  };
}

export function useGoals<T extends UseGoalsOptions>(
  factory: () => T,
  depts: DependencyList = []
) {
  const goals = useMemo(factory, depts);

  const achievementsDone = (goals.global?.achievements ?? []).reduce(
    (done, achievement) => {
      return done || achievement.achieved;
    },
    true
  );

  const objectivesDone = (goals.global?.achievements ?? []).reduce(
    (done, achievement) => {
      return done || achievement.achieved;
    },
    true
  );

  return {
    allDone: achievementsDone && objectivesDone,
    achievementsDone,
    objectivesDone,

    globalGoals: goals.global != null ? sanitizeGoals(goals.global) : undefined,

    farmerGoals: (farmer: Farmer) => {
      const farmerGoals = goals.individuals?.find((g) => g.farmer === farmer);
      if (!farmerGoals)
        throw new Error("Given farmer does not have any goals registered");
      return sanitizeGoals(farmerGoals);
    },
  };
}
