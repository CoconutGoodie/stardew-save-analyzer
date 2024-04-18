import { ReactNode } from "react";
import "./App.css";
import xml from "./assets/Kaktus_372348215.xml";
import { Currency } from "./component/Currency";
import { GameSave } from "./util/GameSave";
import { lowerCase } from "case-anything";
import stardropPng from "./assets/stardrop.png";

const achievements = import.meta.glob("./assets/achievement/ingame/*.png", {
  eager: true,
});

const farmTypes = import.meta.glob("./assets/farm/*.png", {
  eager: true,
});

const professions = import.meta.glob("./assets/profession/*.png", {
  eager: true,
});

const specialOrderNpcs = import.meta.glob("./assets/special-order/*.png", {
  eager: true,
});

function Achievement(props: {
  title: string;
  description?: ReactNode;
  achieved?: boolean;
  children?: ReactNode;
}) {
  return (
    <div key={props.title}>
      {/* <span style={{ marginRight: 10 }}>
        {achieved ? "\u2714" : "\u2718"}
      </span> */}
      <img
        width={20}
        style={{
          marginRight: 8,
          filter: props.achieved ? "" : "brightness(0)",
          opacity: props.achieved ? 1 : 0.2,
        }}
        src={
          // @ts-ignore
          achievements[
            `./assets/achievement/ingame/${lowerCase(props.title).replace(
              /\s+/g,
              "_"
            )}.png`
            // @ts-ignore
          ]?.default ??
          // @ts-ignore
          achievements[`./assets/achievement/ingame/cowpoke.png`].default
        }
      />
      <a
        href="https://stardewvalleywiki.com/Achievements#Achievements_List"
        target="_blank"
        style={{ color: "unset", fontWeight: 400 }}
      >
        <em>{props.title}</em>
      </a>
      {props.description && <> ({props.description})</>} {props.children}
    </div>
  );
}

function App() {
  console.log(xml.SaveGame);

  const gameSave = new GameSave(xml.SaveGame);
  const saveSummary = gameSave.getSaveSummary();
  const moneySummary = gameSave.getMoneySummary();
  const specialOrders = gameSave.getSpecialOrders();
  const farmerNames = gameSave.getAllFarmerNames();

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
        <h1 style={{ fontSize: 18 }}>Money </h1>
        <div style={{ marginLeft: 15, marginBottom: 10 }}>
          {saveSummary.farmName} Farm has earned{" "}
          <Currency amount={moneySummary.earnedTotal} />.
        </div>

        {moneySummary.achievements.map((achi) => {
          const achieved = achi.goal <= moneySummary.earnedTotal;
          return (
            <Achievement
              key={achi.title}
              title={achi.title}
              achieved={achieved}
              description={
                <>
                  earn <Currency amount={achi.goal} />
                </>
              }
            >
              {!achieved && (
                <span style={{ opacity: 0.6 }}>
                  {" "}
                  -- need{" "}
                  <Currency amount={achi.goal - moneySummary.earnedTotal} />
                  more
                </span>
              )}
            </Achievement>
          );
        })}
      </section>

      <section id="skills">
        <h1 style={{ fontSize: 18 }}>Skills</h1>

        <div
          style={{
            display: "grid",
            gap: 50,
            gridTemplateColumns: `repeat(${farmerNames.length}, 1fr)`,
          }}
        >
          {farmerNames.map((farmerName) => {
            const skillAttribs = gameSave.getSkillAttributes(farmerName)!;

            return (
              <div style={{ marginLeft: 15 }}>
                <h2 style={{ fontSize: 12 }}>
                  {farmerName}{" "}
                  <a
                    href="https://stardewvalleywiki.com/Skills#Skill-Based_Title"
                    target="_blank"
                  >
                    <span>({skillAttribs.title})</span>
                  </a>
                </h2>

                {skillAttribs.skills.map((skill) => (
                  <div
                    key={skill.title}
                    style={{ display: "flex", gap: 10, alignItems: "center" }}
                  >
                    <span>{skill.title}</span>
                    <progress max={10} value={skill.level} />
                    <span>{skill.level} / 10</span>

                    {skill.professions.map((profession) => (
                      <div>
                        <a
                          href={`https://stardewvalleywiki.com/Skills#${skill.title}`}
                          target="_blank"
                        >
                          <img
                            width={24}
                            title={profession}
                            src={
                              // @ts-ignore
                              professions[
                                `./assets/profession/${lowerCase(
                                  profession
                                )}.png`
                              ].default
                            }
                          />
                        </a>
                      </div>
                    ))}
                  </div>
                ))}

                <Achievement
                  title={"Singular Talent"}
                  achieved={skillAttribs.skills.some(
                    (skill) => skill.level === 10
                  )}
                  description={<>Level 10 in a skill</>}
                />

                <Achievement
                  title={"Master of the Five Ways"}
                  achieved={skillAttribs.skills.every(
                    (skill) => skill.level === 10
                  )}
                  description={<>Level 10 in every skill</>}
                />
              </div>
            );
          })}
        </div>
      </section>

      <section id="special-orders">
        <h1 style={{ fontSize: 18 }}>Special Orders</h1>

        <div
          style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)" }}
        >
          {specialOrders.map((order) => (
            <a href={order.wiki} target="_blank">
              <img
                width={50}
                title={order.title}
                style={{
                  filter: order.completed ? "" : "brightness(0)",
                  opacity: order.completed ? 1 : 0.2,
                }}
                src={
                  // @ts-ignore
                  specialOrderNpcs[`./assets/special-order/${order.npc}.png`]
                    .default
                }
              />
            </a>
          ))}
        </div>

        <Achievement
          title={"Complete all Special Orders"}
          achieved={specialOrders.every((order) => order.completed)}
        >
          {" "}
          - ({specialOrders.filter((order) => order.completed).length}/
          {specialOrders.length} Done)
        </Achievement>
      </section>

      <section id="stardrops">
        <h1 style={{ fontSize: 18 }}>Stardrops</h1>

        <div
          style={{
            display: "grid",
            gap: 50,
            gridTemplateColumns: `repeat(${farmerNames.length}, 1fr)`,
          }}
        >
          {farmerNames.map((farmerName) => {
            const stardrops = gameSave.getStardrops(farmerName)!;

            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <h2 style={{ fontSize: 12 }}>
                  {farmerName} - (
                  {stardrops.filter((stardrop) => stardrop.gathered).length}/
                  {stardrops.length})
                </h2>

                {stardrops.map((stardrop, index) => (
                  <div
                    style={{ display: "flex", gap: 5, alignItems: "center" }}
                  >
                    <img
                      width={35}
                      src={stardropPng}
                      title={`Stardrop #${index + 1}`}
                      style={{
                        filter: stardrop.gathered ? "" : "brightness(0)",
                        opacity: stardrop.gathered ? 1 : 0.2,
                      }}
                    />
                    {stardrop.description}
                  </div>
                ))}

                <div style={{ marginTop: 10 }}>
                  <Achievement
                    title="Mystery Of The Stardrops"
                    description="Gather every Stardrop"
                    achieved={stardrops.every((stardrop) => stardrop.gathered)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

export default App;
