import { AssetRepository } from "@src/util/AssetRepository";

/* -- Sprites ------------------------------------ */

export const ACHIEVEMENT_SPRITES = new AssetRepository<string>({
  repository: import.meta.glob("../assets/sprite/achievement/*.png", {
    import: "default",
    eager: true,
  }),
  prefix: "../assets/sprite/achievement/",
  postfix: ".png",
  defaultKey: "unknown",
});

export const FARM_TYPE_SPRITES = new AssetRepository<string>({
  repository: import.meta.glob("../assets/sprite/farm-type/*.png", {
    import: "default",
    eager: true,
  }),
  prefix: "../assets/sprite/farm-type/",
  postfix: ".png",
});

export const FISH_SPRITES = new AssetRepository({
  repository: import.meta.glob<string>("../assets/sprite/fish/*.png", {
    import: "default",
    eager: true,
  }),
  prefix: "../assets/sprite/fish/",
  postfix: ".png",
});

export const FISH_COVER_SPRITES = new AssetRepository({
  repository: import.meta.glob<string>("../assets/cover/fishing/*.png", {
    import: "default",
    eager: true,
  }),
  prefix: "../assets/cover/fishing/",
  postfix: ".png",
});

export const FARM_BUILDING_SPRITES = new AssetRepository({
  repository: import.meta.glob<string>("../assets/sprite/building/*.png", {
    import: "default",
    eager: true,
  }),
  prefix: "../assets/sprite/building/",
  postfix: ".png",
});

export const FARM_ANIMALS_SPRITES = new AssetRepository({
  repository: import.meta.glob<string>("../assets/sprite/animal/*.png", {
    import: "default",
    eager: true,
  }),
  prefix: "../assets/sprite/animal/",
  postfix: ".png",
});

export const COOKING_RECIPE_SPRITES = new AssetRepository<string>({
  repository: import.meta.glob("../assets/sprite/cooking/*.png", {
    import: "default",
    eager: true,
  }),
  prefix: "../assets/sprite/cooking/",
  postfix: ".png",
});

export const CRAFTING_RECIPE_SPRITES = new AssetRepository<string>({
  repository: import.meta.glob("../assets/sprite/crafting/*.png", {
    import: "default",
    eager: true,
  }),
  prefix: "../assets/sprite/crafting/",
  postfix: ".png",
});

export const PERK_SPRITES = new AssetRepository<string>({
  repository: import.meta.glob("../assets/sprite/skill/mastery/*.png", {
    import: "default",
    eager: true,
  }),
  prefix: "../assets/sprite/skill/mastery/",
  postfix: ".png",
});

export const ARTIFACT_SPRITES = new AssetRepository<string>({
  repository: import.meta.glob("../assets/sprite/museum/artifacts/*.png", {
    import: "default",
    eager: true,
  }),
  prefix: "../assets/sprite/museum/artifacts/",
  postfix: ".png",
});

export const MINERAL_SPRITES = new AssetRepository<string>({
  repository: import.meta.glob("../assets/sprite/museum/minerals/*.png", {
    import: "default",
    eager: true,
  }),
  prefix: "../assets/sprite/museum/minerals/",
  postfix: ".png",
});

export const QI_SPECIAL_ORDER_SPRITES = new AssetRepository<string>({
  repository: import.meta.glob("../assets/sprite/special-order/qi/*.png", {
    import: "default",
    eager: true,
  }),
  prefix: "../assets/sprite/special-order/qi/",
  postfix: ".png",
});

export const RARECROW_SPRITES = new AssetRepository<string>({
  repository: import.meta.glob("../assets/sprite/scarecrow/*.png", {
    import: "default",
    eager: true,
  }),
  prefix: "../assets/sprite/scarecrow/",
  postfix: ".png",
});

export const SKILL_SPRITES = new AssetRepository<string>({
  repository: import.meta.glob("../assets/sprite/skill/*.png", {
    import: "default",
    eager: true,
  }),
  prefix: "../assets/sprite/skill/",
  postfix: ".png",
});

export const PROFESSION_SPRITES = new AssetRepository<string>({
  repository: import.meta.glob("../assets/sprite/profession/*.png", {
    import: "default",
    eager: true,
  }),
  prefix: "../assets/sprite/profession/",
  postfix: ".png",
});

export const SPECIAL_ORDER_SPRITES = new AssetRepository<string>({
  repository: import.meta.glob("../assets/sprite/special-order/*.png", {
    import: "default",
    eager: true,
  }),
  prefix: "../assets/sprite/special-order/",
  postfix: ".png",
});

export const MONSTER_SPRITES = new AssetRepository<string>({
  repository: import.meta.glob("../assets/sprite/monster/*.png", {
    import: "default",
    eager: true,
  }),
  prefix: "../assets/sprite/monster/",
  postfix: ".png",
});

export const NPC_SPRITES = new AssetRepository<string>({
  repository: import.meta.glob("../assets/sprite/npc/*.png", {
    import: "default",
    eager: true,
  }),
  prefix: "../assets/sprite/npc/",
  postfix: ".png",
});

export const SHIPPABLE_SPRITES = new AssetRepository<string>({
  repository: import.meta.glob("../assets/sprite/shipping/shippable/*.png", {
    import: "default",
    eager: true,
  }),
  prefix: "../assets/sprite/shipping/shippable/",
  postfix: ".png",
});

/* -- Other ------------------------------------ */

export const DEMO_SAVES = new AssetRepository({
  repository: import.meta.glob<Promise<string>>("../assets/Save_*.xml", {
    query: "raw",
    import: "default",
  }),
  prefix: "../assets/Save_",
  postfix: ".xml",
});
