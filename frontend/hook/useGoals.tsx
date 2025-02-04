import { DependencyList, ReactNode, useMemo } from "react";
import { filter, flat, pick, pipe } from "remeda";
import { Achievement } from "~frontend/gamesave/Achievements";
import { Farmer } from "~frontend/gamesave/Farmer";
import { mapCollectionToObj } from "~frontend/util/mapCollectionToObj";

interface ObjectiveBase {
  id: string;
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

export type ObjectiveSummary<
  $result = ReturnType<typeof sanitizeGoals>["objectives"],
> = $result[keyof $result];

export interface GoalsConfig {
  readonly achievements?: Achievement[];
  readonly objectives?: ObjectiveConfig[];
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

function sanitizeGoals<const C extends GoalsConfig>(config: C) {
  return {
    achievements: config.achievements ?? [],

    objectives: mapCollectionToObj<NonNullable<C["objectives"]>[number], "id">(
      config.objectives ?? [],
      "id"
    )((objectiveConfig) => ({
      done: isObjectiveDone(objectiveConfig),
      config: objectiveConfig,
      description: objectiveConfig.description,
      hint: objectiveConfig.hint,
    })),
  };
}

type IndividualConfig<C extends GoalsConfig> = { farmer: Farmer } & Readonly<C>;

export function useGoals<
  const CG extends GoalsConfig,
  const CI extends GoalsConfig,
>(
  factory: () => {
    global?: CG;
    individuals?: readonly IndividualConfig<CI>[];
  },
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

  const individualGoals = (goals.individuals ?? []).map((g) => ({
    farmer: g.farmer,
    ...sanitizeGoals<CI>(g),
  }));

  return {
    allDone: achievementsDone && objectivesDone,
    achievementsDone,
    objectivesDone,

    globalGoals: sanitizeGoals<CG>(goals.global ?? ({} as CG)),
    individualGoals,

    getFarmerGoals: (farmer: Farmer) => {
      const farmerGoals = goals.individuals?.find((g) => g.farmer === farmer);
      if (!farmerGoals)
        throw new Error("Given farmer does not have any goals registered");
      return sanitizeGoals<CI>(farmerGoals);
    },
  };
}
