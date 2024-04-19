import { lowerCase } from "case-anything";
import { entries } from "lodash";
import "./App.css";
import xml from "./assets/Kaktus_372348215.xml";
import femalePng from "./assets/icon/female.png";
import malePng from "./assets/icon/male.png";
import { FishCategory, STARDEW_FISH_CATEGORIES } from "./const/StardewFishes";
import { MoneySection } from "./section/MoneySection";
import { SkillsSection } from "./section/SkillsSection";
import { SpecialOrdersSection } from "./section/SpecialOrdersSection";
import { StardropsSection } from "./section/StardropsSection";
import { GameSave } from "./util/GameSave";
import { SummarySection } from "./component/SummarySection";
import logoPng from "./assets/logo.png";

import "./style/style.scss";
import { GameDateDisplay } from "./component/GameDateDisplay";

const farmTypes = import.meta.glob("./assets/sprite/farm/*.png", {
  eager: true,
});

const fishSprites = import.meta.glob("./assets/sprite/fish/*.png", {
  eager: true,
});

function App() {
  const gameSave = new GameSave(xml.SaveGame);
  const farmSummary = gameSave.getFarmSummary();
  const farmerNames = gameSave.getAllFarmerNames();

  return (
    <main>
      <header>
        <img
          width={350}
          src={logoPng}
          // For debug purposes
          onClick={() => console.log(xml.SaveGame)}
        />
      </header>

      <section id="farm-summary">
        <h1 style={{ fontSize: 24 }}>Summary</h1>
        <ul>
          <li>
            {farmSummary.farmName} Farm (
            <img
              width={20}
              style={{}}
              src={
                // @ts-ignore
                farmTypes[
                  `./assets/sprite/farm/${lowerCase(
                    farmSummary.farmType
                  ).replace(/\s+/g, "-")}.png`
                ].default
              }
            />{" "}
            {farmSummary.farmType})
          </li>
          <li>
            Farmer:
            <img
              alt="Farmer Gender"
              title={farmSummary.player.gender}
              src={farmSummary.player.gender === "Male" ? malePng : femalePng}
            />{" "}
            {farmSummary.player.name}
          </li>
          <li>
            Farmhand(s):{" "}
            {farmSummary.farmhands.map((farmer, index) => (
              <>
                <img
                  alt="Farmer Gender"
                  title={farmer.gender}
                  src={farmer.gender === "Male" ? malePng : femalePng}
                />{" "}
                {farmer.name}
                {index !== farmSummary.farmhands.length - 1 && <>, </>}
              </>
            ))}
          </li>
          <li>
            Today is <GameDateDisplay date={farmSummary.currentDate} />
          </li>
          <li>Played for {farmSummary.playtime}ms</li>
          <li>Game Version {farmSummary.gameVersion}</li>
        </ul>
      </section>

      <hr />

      <MoneySection gameSave={gameSave} />

      <hr />

      <SkillsSection gameSave={gameSave} />

      <hr />

      <StardropsSection gameSave={gameSave} />

      <hr />

      <SpecialOrdersSection gameSave={gameSave} />

      {/* <section id="fishing">
        <h1 style={{ fontSize: 24 }}>Fish Collection</h1>

        <div
          style={{
            display: "grid",
            gap: 50,
            gridTemplateColumns: `repeat(${farmerNames.length}, 1fr)`,
          }}
        >
          {farmerNames.map((farmerName) => {
            const caughtFishes = gameSave.getCaughtFishes(farmerName)!;

            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                <h2 style={{ fontSize: 12 }}>{farmerName}</h2>

                {entries(caughtFishes).map(([categoryName, fishes]) => {
                  return (
                    <div
                      style={{
                        background: "#604620",
                        borderRadius: 5,
                        padding: "0 10px",
                        display: "grid",
                        gap: 10,
                        gridTemplateColumns: "50px 1fr",
                      }}
                    >
                      <h1
                        style={{
                          fontSize: 11,
                          color:
                            STARDEW_FISH_CATEGORIES[
                              categoryName as FishCategory
                            ].accentColor,
                        }}
                      >
                        {categoryName}
                      </h1>

                      <div style={{ display: "flex", flexWrap: "wrap" }}>
                        {fishes.map((fish) => (
                          <div>
                            <img
                              width={34}
                              alt="Fish"
                              title={fish.name}
                              src={
                                // @ts-ignore
                                fishSprites[
                                  `./assets/sprite/fish/${lowerCase(
                                    fish.name
                                  ).replace(/\s+/g, "_")}.png`
                                  // @ts-ignore
                                ]?.default ?? ""
                              }
                              style={{
                                filter:
                                  fish.caught !== 0 ? "" : "brightness(0)",
                                opacity: fish.caught !== 0 ? 1 : 0.2,
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </section> */}

      <footer style={{ height: 200 }}></footer>
    </main>
  );
}

export default App;
