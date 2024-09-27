import questPng from "@src/assets/icon/exclamation.png";
import { TableOfContents } from "@src/component/TableOfContents/TableOfContents";
import { AdventurersGuildSection } from "@src/section/AdventurersGuildSection/AdventurersGuildSection";
import { CookingSection } from "@src/section/CookingSection/CookingSection";
import { CraftingSection } from "@src/section/CraftingSection/CraftingSection";
import { FarmBuildingsSection } from "@src/section/FarmBuildingsSection/FarmBuildingsSection";
import { HelpWantedSection } from "@src/section/HelpWantedSection/HelpWantedSection";
import { MasteriesSection } from "@src/section/MasteriesSection/MasteriesSection";
import { MuseumSection } from "@src/section/MuseumSection/MuseumSection";
import { QiChallengesSection } from "@src/section/QiChallengesSection/QiChallengesSection";
import { RarecrowSection } from "@src/section/RarecrowsSection/RarecrowsSection";
import { RelationshipsSection } from "@src/section/RelationshipsSection/RelationshipsSection";
import { ShippingSection } from "@src/section/ShippingSection/ShippingSection";
import { useEffect, useState } from "react";
import logoPng from "./assets/logo.png";
import { SummarySection } from "./component/SummarySection";
import { GameSave } from "./gamesave/GameSave";
import { FishingSection } from "./section/FishingSection/FishingSection";
import { GrandpasEvaluationsSection } from "./section/GrandpasSection/GrandpasSection";
import { LoadSaveSection } from "./section/LoadSaveSection/LoadSaveSection";
import { MoneySection } from "./section/MoneySection/MoneySection";
import { OverviewSection } from "./section/OverviewSection/OverviewSection";
import { SkillsSection } from "./section/SkillsSection/SkillsSection";
import { SpecialOrdersSection } from "./section/SpecialOrdersSection/SpecialOrdersSection";
import { StardropsSection } from "./section/StardropsSection/StardropsSection";

import BuyMeACoffeeSvg from "@src/assets/social/buy-me-a-coffee.svg?component";
import GithubSvg from "@src/assets/social/github.svg?component";
import PatreonSvg from "@src/assets/social/patreon.svg?component";

import "./style/style.scss";

function App() {
  const [gameSave, setGameSave] = useState<GameSave>();

  useEffect(() => {
    if (!gameSave) return;
    console.debug("Parsed Game Save:", gameSave);
  }, [gameSave]);

  return (
    <main>
      <header>
        <img width={350} src={logoPng} />
        <span>last updated for v{GameSave.compatibleVersion}</span>
      </header>

      <div id="content">
        <section id="disclaimers">
          <div className="disclaimer" data-icon={questPng}>
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
        </section>

        {gameSave == null ? (
          <>
            <LoadSaveSection onSelected={setGameSave} />
          </>
        ) : (
          <>
            <TableOfContents />

            <OverviewSection gameSave={gameSave} />

            <SummarySection className="twoSections">
              <MoneySection gameSave={gameSave} />
              <FarmBuildingsSection gameSave={gameSave} />
            </SummarySection>

            <hr />

            <SkillsSection gameSave={gameSave} />

            <hr />

            <MasteriesSection gameSave={gameSave} />

            <hr />

            <HelpWantedSection gameSave={gameSave} />

            <hr />

            <SpecialOrdersSection gameSave={gameSave} />

            <hr />

            <QiChallengesSection gameSave={gameSave} />

            <hr />

            <RarecrowSection gameSave={gameSave} />

            <hr />

            <SummarySection
              sectionTitle="Special Items & Powers [WIP]"
              collapsable
            >
              [WIP] Special Items & Powers here
            </SummarySection>

            <hr />

            <RelationshipsSection gameSave={gameSave} />

            <hr />

            <SummarySection sectionTitle="House & Family [WIP]" collapsable>
              [WIP] House & Family here
            </SummarySection>

            <hr />

            <FishingSection gameSave={gameSave} />

            <hr />

            <CraftingSection gameSave={gameSave} />

            <hr />

            <CookingSection gameSave={gameSave} />

            <hr />

            <AdventurersGuildSection gameSave={gameSave} />

            <hr />

            <ShippingSection gameSave={gameSave} />

            <hr />

            <SummarySection sectionTitle="Forest Neightbors [WIP]" collapsable>
              [WIP] Forest Neightbors & Pedro here
            </SummarySection>

            <hr />

            <StardropsSection gameSave={gameSave} />

            <hr />

            <MuseumSection gameSave={gameSave} />

            <hr />

            <GrandpasEvaluationsSection gameSave={gameSave} />

            <hr />

            <SummarySection
              sectionTitle="Community Center / Joja Membership [WIP]"
              collapsable
            >
              [WIP] Community Center / Joja Membership here
            </SummarySection>

            <hr />

            <SummarySection sectionTitle="Secret Notes [WIP]" collapsable>
              [WIP] Secret Notes here
            </SummarySection>

            <hr />

            <SummarySection sectionTitle="Ginger Island [WIP]" collapsable>
              [WIP] Ginger Island here
            </SummarySection>

            <hr />

            <SummarySection sectionTitle="Perfection Tracker [WIP]" collapsable>
              [WIP] Perfection Tracker Analysis here
            </SummarySection>

            <hr />

            <SummarySection sectionTitle="Todo List">
              <ul>
                <li>Tooltips Component</li>
                <li>Support "Separate Wallets"</li>
                <li>Fix main app layout</li>
              </ul>
            </SummarySection>
          </>
        )}
      </div>

      <footer style={{ height: 200 }}>
        <div className="credits">
          <span>
            Coded with <span style={{ color: "#f76767" }}>♥</span> by{" "}
            <a href="https://github.com/iGoodie" target="_blank">
              iGoodie
            </a>
          </span>
          <span>
            Designed with <span style={{ color: "#f76767" }}>♥</span> by{" "}
            <a href="https://github.com/sedasen" target="_blank">
              CoconutOrange
            </a>
          </span>
        </div>

        <div className="site-info">
          <span>
            Game Version: <em>v{GameSave.compatibleVersion}</em>
          </span>
          <span>
            Site Version: <em>v{process.env.APP_VERSION}</em>
          </span>
        </div>

        <div className="links">
          <a
            href="https://github.com/CoconutGoodie/stardew-save-analyzer"
            target="_blank"
          >
            <GithubSvg />
          </a>
          <a href="https://buymeacoffee.com/igoodie" target="_blank">
            <BuyMeACoffeeSvg />
          </a>
          <a href="https://www.patreon.com/iGoodie" target="_blank">
            <PatreonSvg />
          </a>
        </div>
      </footer>
    </main>
  );
}

export default App;
