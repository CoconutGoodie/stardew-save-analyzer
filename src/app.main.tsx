import { MoneySection } from "./section/MoneySection";
import { OverviewSection } from "./section/OverviewSection";
import { SkillsSection } from "./section/SkillsSection";
import { SpecialOrdersSection } from "./section/SpecialOrdersSection";
import { StardropsSection } from "./section/StardropsSection";
import { GameSave } from "./gamesave/GameSave";

import logoPng from "./assets/logo.png";

import saveXml from "./assets/Save_1.6.xml";

import "./style/style.scss";
import { SummarySection } from "./component/SummarySection";

function App() {
  const gameSave = new GameSave(saveXml.SaveGame);

  return (
    <main>
      <header>
        <img
          width={350}
          src={logoPng}
          // For debug purposes
          onClick={() => console.log(saveXml.SaveGame)}
        />
      </header>

      <OverviewSection gameSave={gameSave} />

      <MoneySection gameSave={gameSave} />

      <SkillsSection gameSave={gameSave} />

      <StardropsSection gameSave={gameSave} />

      <SpecialOrdersSection gameSave={gameSave} />

      <SummarySection>
        <h1>Craftables [WIP]</h1>
      </SummarySection>

      <SummarySection>
        <h1>Fishing [WIP]</h1>
      </SummarySection>

      <SummarySection>
        <h1>Socials [WIP]</h1>
      </SummarySection>

      <SummarySection>
        <h1>Community Center [WIP]</h1>
      </SummarySection>

      <SummarySection>
        <h1>Many More... [WIP]</h1>
      </SummarySection>

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
