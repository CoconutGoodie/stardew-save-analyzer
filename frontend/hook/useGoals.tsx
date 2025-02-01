import { DependencyList, ReactNode, useMemo } from "react";
import { filter, flat, map, pick, pipe } from "remeda";
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

  const everyAchievement = pipe(
    [goals.global?.achievements, goals.individuals?.map((i) => i.achievements)],
    flat(2),
    filter((x) => x != null)
  );

  const everyObjective = pipe(
    [goals.global?.objectives, goals.individuals?.map((i) => i.objectives)],
    flat(2),
    filter((x) => x != null)
  );

  const achievementsDone = everyAchievement.reduce((done, achievement) => {
    return done && achievement.achieved;
  }, true);

  const objectivesDone = everyObjective.reduce((done, objective) => {
    return done && isObjectiveDone(objective);
  }, true);

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
