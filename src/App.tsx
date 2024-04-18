import "./App.css";
import xml from "./assets/Kaktus_372348215.xml";
import { Gold } from "./component/Gold";
import { GameSave } from "./util/GameSave";
import { lowerCase } from "case-anything";

const achievements = import.meta.glob("./assets/achievement/ingame/*.png", {
  eager: true,
});

const farmTypes = import.meta.glob("./assets/farm/*.png", {
  eager: true,
});

function App() {
  console.log(xml.SaveGame);

  const gameSave = new GameSave(xml.SaveGame);
  const saveSummary = gameSave.getSaveSummary();
  const moneySummary = gameSave.getMoneySummary();

  return (
    <main>
      <section id="summary">
        <h1 style={{ fontSize: 18 }}>Summary</h1>
        <ul>
          <li>
            {saveSummary.farmName} Farm (
            <img
              width={20}
              style={{}}
              src={
                // @ts-ignore
                farmTypes[
                  `./assets/farm/${lowerCase(saveSummary.farmType).replace(
                    /\s+/g,
                    "-"
                  )}.png`
                ].default
              }
            />{" "}
            {saveSummary.farmType})
          </li>
          <li>Farmer: {saveSummary.playerName}</li>
          <li>Farmhand(s): {saveSummary.farmhandNames.join(",")}</li>
          <li>
            Day {saveSummary.currentDate.day} of{" "}
            {saveSummary.currentDate.season}, Year{" "}
            {saveSummary.currentDate.year}
          </li>
          <li>Played for {saveSummary.playtime}ms</li>
          <li>Save is from version {saveSummary.gameVersion}</li>
        </ul>
      </section>

      <section id="money">
        <h1 style={{ fontSize: 18 }}>Money</h1>
        <ul>
          <li>
            {saveSummary.farmName} Farm has earned{" "}
            <Gold amount={moneySummary.earnedTotal} />.
          </li>

          <ul>
            {moneySummary.achievements.map((achi) => {
              const achieved = achi.goal <= moneySummary.earnedTotal;
              return (
                <li key={achi.title}>
                  {/* <span style={{ marginRight: 10 }}>
                    {achieved ? "\u2714" : "\u2718"}
                  </span> */}
                  <img
                    width={20}
                    style={{
                      marginRight: 8,
                      filter: achieved ? "" : "brightness(0)",
                      opacity: achieved ? 1 : 0.2,
                    }}
                    src={
                      // @ts-ignore
                      achievements[
                        `./assets/achievement/ingame/${lowerCase(
                          achi.title
                        )}.png`
                      ].default
                    }
                  />
                  <em>{achi.title}</em> (earn <Gold amount={achi.goal} />){" "}
                  {achieved ? (
                    <span>achieved</span>
                  ) : (
                    <span style={{ opacity: 0.6 }}>
                      -- need{" "}
                      <Gold amount={achi.goal - moneySummary.earnedTotal} />
                      more
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </ul>
      </section>

      {/* <section id="">
        <h1 style={{ fontSize: 18 }}>Money</h1>
        <ul>
          <li>
            {saveSummary.farmName} Farm has earned {moneySummary.earnedTotal}g.
          </li>
        </ul>
      </section> */}
    </main>
  );
}

export default App;
