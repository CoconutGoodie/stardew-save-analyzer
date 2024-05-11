import { GameSave } from "./gamesave/GameSave";
import { MoneySection } from "./section/MoneySection";
import { OverviewSection } from "./section/OverviewSection";
import { SkillsSection } from "./section/SkillsSection";
import { SpecialOrdersSection } from "./section/SpecialOrdersSection";
import { StardropsSection } from "./section/StardropsSection";

import questPng from "@src/assets/icon/exclamation.png";
import logoPng from "./assets/logo.png";

import { useState } from "react";
import { SummarySection } from "./component/SummarySection";
import { LoadSaveSection } from "./section/LoadSaveSection";

import { MuseumSection } from "@src/section/MuseumSection";
import { FishingSection } from "./section/FishingSection";
import { GrandpasEvaluationsSection } from "./section/GrandpasSection";

import { CraftingSection } from "@src/section/CraftingSection";
import { HelpWantedSection } from "@src/section/HelpWantedSection";
import { MasteriesSection } from "@src/section/MasteriesSection";

import { QiSpecialOrdersSection } from "@src/section/QiSpecialOrdersSection";
import { RarecrowSection } from "@src/section/RarecrowsSection";
import "./style/style.scss";
import { CookingSection } from "@src/section/CookingSection";

function App() {
  const [gameSave, setGameSave] = useState<GameSave>();

  return (
    <main>
      <header>
        <img width={350} src={logoPng} />
        <span>last updated for v1.6.8</span>
      </header>

      <div id="content">
        <div className="disclaimers">
          <div className="disclaimer">
            <img height={30} src={questPng} />
            <p>
              <em>Disclaimer!</em> This website is not affiliated with,
              endorsed, sponsored, or specifically approved by{" "}
              <a target="_blank" href="https://twitter.com/ConcernedApe">
                ConcernedApe
              </a>{" "}
              or{" "}
              <a target="_blank" href="https://www.stardewvalley.net/">
                Stardew Valley
              </a>
              .{"\n"}It is an independent, open-source, fan-made tool crafted by{" "}
              <a target="_blank" href="https://github.com/iGoodie">
                iGoodie
              </a>
              . Its aim is to provide players with helpful resources and
              utilities, purely out of my passion for the game.
            </p>
          </div>
          <div className="disclaimer">
            <img height={30} src={questPng} />
            <p>
              This website has no commercial concerns whatsoever. It DOES NOT
              seek to profit from the use of Stardew Valley's intellectual
              property. Instead, its goal is to contribute positively to the
              community and enhance the gaming experience for fellow players.
            </p>
          </div>
          <div className="disclaimer">
            <img height={30} src={questPng} />
            <p>
              For any inquiries or concerns regarding this website, please feel
              free to contact me on{" "}
              <a
                target="_blank"
                href="https://discordapp.com/users/117741752437309449"
              >
                Discord
              </a>
              , or leave a{" "}
              <a
                target="_blank"
                href="https://github.com/iGoodie/stardew-save-analyzer/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc"
              >
                Github Issue
              </a>
              .{"\n"}I appreciate your support and understanding.{" "}
              <span className="heart">♥</span>
            </p>
          </div>
        </div>

        {gameSave == null ? (
          <>
            <LoadSaveSection onSelected={setGameSave} />
          </>
        ) : (
          <>
            <OverviewSection gameSave={gameSave} />

            <div style={{ display: "flex", gap: 50 }}>
              <MoneySection gameSave={gameSave} />

              <SummarySection sectionTitle="Animals & Pets [WIP]" collapsable>
                <p>...</p>
                <p>...</p>
                <p>...</p>
              </SummarySection>
            </div>

            <SkillsSection gameSave={gameSave} />

            <MasteriesSection gameSave={gameSave} />

            <HelpWantedSection gameSave={gameSave} />

            <SpecialOrdersSection gameSave={gameSave} />

            <QiSpecialOrdersSection gameSave={gameSave} />

            <RarecrowSection gameSave={gameSave} />

            <FishingSection gameSave={gameSave} />

            <CraftingSection gameSave={gameSave} />

            <CookingSection gameSave={gameSave} />

            <SummarySection sectionTitle="Shipping [WIP]" collapsable>
              [WIP] Shipping Bin Achievements here
            </SummarySection>

            <StardropsSection gameSave={gameSave} />

            <MuseumSection gameSave={gameSave} />

            <GrandpasEvaluationsSection gameSave={gameSave} />

            <SummarySection sectionTitle="Perfection Tracker [WIP]" collapsable>
              [WIP] Perfection Tracker Analysis here
            </SummarySection>

            <hr />

            <SummarySection sectionTitle="Todo List">
              <ul>
                <li>"Forest Neightbors" Section</li>
                <li>"Ginger Island" Section</li>
                <li>"Secret Notes" Section</li>
                <li>"Grandpa's Evaluation" Section</li>
                <li>"Monster Hunting" Section</li>
                <li>"Socials" Section</li>
                <li>"Community Center" Section</li>
                <li>"Perfection" Section</li>
                <li>Tooltips Component</li>
                <li>Table of Contents Quick Navigator</li>
                <li>Support "Separate Wallets"</li>
              </ul>
            </SummarySection>
          </>
        )}
      </div>

      <footer style={{ height: 200 }}></footer>
    </main>
  );
}

export default App;
