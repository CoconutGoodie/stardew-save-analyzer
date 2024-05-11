import { Achievement } from "@src/gamesave/Achievements";
import { isKeyOf } from "@src/util/utilities";
import { entries, isPlainObject, mapValues, values } from "remeda";

type ObjectiveValue =
  | boolean
  | { current: number; goal: number }
  | { [x: string]: ObjectiveValue };

interface Objectives {
  [name: PropertyKey]: ObjectiveValue;
}

interface Goals<O extends Objectives, A extends Achievement[]> {
  achievements: A;
  objectives: O;
}

export function useGoals<
  const GO extends Objectives,
  const GA extends Achievement[],
  const IO extends Objectives,
  const IA extends Achievement[]
>(args: {
  global?: Partial<Goals<GO, GA>>;
  individuals?: { [name: string]: Partial<Goals<IO, IA>> };
}) {
  const goals = {
    global: {
      achievements: args.global?.achievements ?? [],
      objectives: args.global?.objectives ?? ({} as GO),
      objectiveStatus: mapValues(
        args.global?.objectives ?? ({} as GO),
        calcObjectiveStatus
      ),
    },
    individuals: mapValues(args.individuals ?? {}, (individual) => ({
      achievements: individual?.achievements ?? [],
      objectives: individual?.objectives ?? ({} as IO),
      objectiveStatus: mapValues(
        individual?.objectives ?? ({} as IO),
        calcObjectiveStatus
      ),
    })),
  };

  return {
    goals,
    allDone:
      isAllDone(goals.global) && values(goals.individuals).every(isAllDone),
  };
}

function isAllDone<O extends Objectives, A extends Achievement[]>(
  goals: Goals<O, A>
): boolean {
  const achievementsDone = (goals.achievements ?? []).every(
    (achievement) => achievement.achieved
  );

  const objectivesDone = entries(goals.objectives ?? {}).every(
    ([_, objective]) => calcObjectiveStatus(objective) === "done"
  );

  return achievementsDone && objectivesDone;
}

function calcObjectiveStatus(objective: ObjectiveValue) {
  if (typeof objective === "boolean") {
    return objective ? "done" : "not-started";
  }

  if (isKeyOf("current", objective) && isKeyOf("goal", objective)) {
    return objective.current === 0
      ? "not-started"
      : objective.current >= objective.goal
      ? "done"
      : "in-progress";
  }

  const subObjectives = extractFlattenedEntries(objective);
  const doneCount = subObjectives.filter((v) => !!v).length;

  return doneCount === 0
    ? "not-started"
    : doneCount >= subObjectives.length
    ? "done"
    : "in-progress";
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
