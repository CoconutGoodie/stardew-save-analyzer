import { Achievement } from "@src/gamesave/Achievements";
import { isKeyOf } from "@src/util/utilities";
import { entries, fromEntries, isPlainObject, mapValues, values } from "remeda";

type ObjectiveValue =
  | boolean
  | { current: number; goal: number }
  | { [x: string]: ObjectiveValue };

interface Objectives {
  [name: string]: ObjectiveValue;
}

interface Goals<
  O extends Objectives,
  A extends Achievement[],
  OF extends Objectives,
  AF extends Achievement[]
> {
  achievements?: A;
  objectives?: O;
  farmers?: Record<string, Omit<Goals<OF, AF, never, never>, "farmers">>;
}

export function useGoals<
  const O extends Objectives,
  const A extends Achievement[],
  const OF extends Objectives,
  const AF extends Achievement[]
>(goals: Goals<O, A, OF, AF>) {
  return {
    goals: {
      achievements: goals.achievements ?? [],
      objectives: goals.objectives ?? ({} as O),
      objectiveDone: fromEntries(
        entries(goals.objectives ?? {}).map(([k, v]) => [k, isObjectiveDone(v)])
      ),
      farmers: goals.farmers ?? {},
    },
    allDone: isAllDone(goals),
  };
}

function isAllDone<
  O extends Objectives,
  A extends Achievement[],
  OF extends Objectives,
  AF extends Achievement[]
>(goals: Goals<O, A, OF, AF>): boolean {
  const achievementsDone = (goals.achievements ?? []).every(
    (achievement) => achievement.achieved
  );

  const objectivesDone = entries(goals.objectives ?? {}).every(
    ([_, objective]) => isObjectiveDone(objective)
  );

  const farmersDone = !goals.farmers
    ? true
    : values(goals.farmers).every((g) => isAllDone(g));

  return achievementsDone && objectivesDone && farmersDone;
}

function isObjectiveDone(objective: ObjectiveValue) {
  return typeof objective === "boolean"
    ? objective
    : isKeyOf("current", objective) && isKeyOf("goal", objective)
    ? objective.current >= objective.goal
    : extractFlattenedEntries(objective).every((v) => !!v);
}

function extractFlattenedEntries<T extends Record<string, unknown>>(obj: T) {
  const extractedEntries: [string, unknown][] = [];

  entries(obj).map(([key, value]) => {
    if (isPlainObject(value)) {
      extractedEntries.push(
        ...extractFlattenedEntries(value).map(
          ([k, v]) => [`${key}_${k}`, v] as [string, unknown]
        )
      );
    } else {
      extractedEntries.push([key, value]);
    }
  });

  return extractedEntries;
}
