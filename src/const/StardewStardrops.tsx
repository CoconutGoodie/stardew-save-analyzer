import { Currency } from "../component/Currency";
import { StardewWiki } from "../util/StardewWiki";

export const STARDROP_MAIL_FLAGS = {
  CF_Fair: (
    <>
      Sold for <Currency amount={2000} unit="starToken" /> at the{" "}
      <a href={StardewWiki.getLink("Stardew_Valley_Fair")} target="_blank">
        Stardew Valley Fair
      </a>
      .
    </>
  ),
  CF_Mines: (
    <>
      Obtained from the treasure chest on floor 100 in{" "}
      <a href={StardewWiki.getLink("The_Mines")} target="_blank">
        the Mines
      </a>
      .
    </>
  ),
  CF_Spouse: (
    <>
      From the player's spouse or roommate when{" "}
      <a href={StardewWiki.getLink("Friendship")} target="_blank">
        friendship level
      </a>{" "}
      reaches <Currency amount={12.5} unit="heart" />.
    </>
  ),
  CF_Sewer: (
    <>
      Sold by{" "}
      <a href={StardewWiki.getLink("Krobus")} target="_blank">
        Krobus
      </a>{" "}
      for <Currency amount={20000} /> in{" "}
      <a href={StardewWiki.getLink("The_Sewers")} target="_blank">
        the Sewers
      </a>
      .
    </>
  ),
  CF_Statue: (
    <>
      Obtained from{" "}
      <a href={StardewWiki.getLink("Old_Master_Cannoli")} target="_blank">
        Old Master Cannoli
      </a>{" "}
      in the{" "}
      <a href={StardewWiki.getLink("Secret_Woods")} target="_blank">
        Secret Woods
      </a>{" "}
      after giving him a{" "}
      <a href={StardewWiki.getLink("Sweet_Gem_Berry")} target="_blank">
        Sweet Gem Berry
      </a>
      .
    </>
  ),
  CF_Fish: (
    <>
      Received in a letter from{" "}
      <a href={StardewWiki.getLink("Willy")} target="_blank">
        Willy
      </a>{" "}
      the day after attaining the{" "}
      <a
        href={StardewWiki.getLink("Achievements", "Achievements_List")}
        target="_blank"
      >
        Master Angler Achievement
      </a>
      .
    </>
  ),
  museumComplete: (
    <>
      Reward for donating all 95 items to{" "}
      <a href={StardewWiki.getLink("Museum")} target="_blank">
        the Museum
      </a>
      .
    </>
  ),
};
