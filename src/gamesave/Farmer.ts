import { intersection, keys, values } from "lodash";
import { GameSave } from "./GameSave";
import { STARDEW_PROFESSIONS } from "../const/StardewProfessions";

export class Farmer {
  public readonly name;
  public readonly gender;
  public readonly favoriteThing;
  public readonly playtime;

  public readonly skills;
  public readonly skillLevelTotal;
  public readonly skillBasedTitle;

  public readonly receivedMailFlags;
  public readonly caughtFish;

  constructor(private playerXml: GameSave.FarmerXml) {
    this.name = playerXml.name[0];
    this.gender =
      playerXml.gender?.[0] ?? playerXml.isMale?.[0] === "true"
        ? ("Male" as const)
        : ("Female" as const);
    this.favoriteThing = playerXml.favoriteThing[0];
    this.playtime = parseInt(playerXml.millisecondsPlayed[0]);

    this.skills = {
      farming: {
        level: parseInt(playerXml.farmingLevel[0]),
        professions: this.calcProfessions("farming"),
      },
      fishing: {
        level: parseInt(playerXml.fishingLevel[0]),
        professions: this.calcProfessions("fishing"),
      },
      mining: {
        level: parseInt(playerXml.miningLevel[0]),
        professions: this.calcProfessions("mining"),
      },
      foraging: {
        level: parseInt(playerXml.foragingLevel[0]),
        professions: this.calcProfessions("foraging"),
      },
      combat: {
        level: parseInt(playerXml.combatLevel[0]),
        professions: this.calcProfessions("combat"),
      },
    };
    this.skillLevelTotal = values(this.skills).reduce((s, c) => s + c.level, 0);
    this.skillBasedTitle = this.calcSkillBasedTitle();

    this.receivedMailFlags = playerXml.mailReceived.flatMap(
      (entry) => entry.string
    );
    this.caughtFish = (this.playerXml.fishCaught?.[0]?.item ?? []).map(
      (caught) => ({
        fishId: ("string" in caught.key[0]
          ? caught.key[0].string[0]
          : caught.key[0].int[0]
        ).replace(/\(.*?\)/, ""),
        amount: parseInt(caught.value[0].ArrayOfInt[0].int[0]),
        lengthInInches: parseInt(caught.value[0].ArrayOfInt[0].int[1]),
      })
    );
  }

  private calcProfessions(skillName: keyof typeof STARDEW_PROFESSIONS) {
    return intersection(
      this.playerXml.professions[0].int,
      keys(STARDEW_PROFESSIONS[skillName])
    )
      .map((id) => parseInt(id))
      .sort((a, b) => a - b) // Ensure, 5 level professions come first
      .map((professionId) => {
        const professions = STARDEW_PROFESSIONS[skillName];
        return professions[professionId as keyof typeof professions];
      });
  }

  private calcSkillBasedTitle() {
    const v = this.skillLevelTotal / 2;
    if (v >= 30) return "Farm King";
    if (v >= 28) return "Cropmaster";
    if (v >= 25) return "Agriculturist";
    if (v >= 24) return "Farmer";
    if (v >= 22) return "Rancher";
    if (v >= 20) return "Planter";
    if (v >= 18) return "Granger";
    if (v >= 16) return this.gender === "Female" ? "Farmgirl" : "Farmboy";
    if (v >= 14) return "Sodbuster";
    if (v >= 12) return "Smallholder";
    if (v >= 10) return "Tiller";
    if (v >= 8) return "Farmhand";
    if (v >= 6) return "Cowpoke";
    if (v >= 4) return "Bumpkin";
    if (v >= 2) return "Greenhorn";
    return "Newcomer";
  }
}
