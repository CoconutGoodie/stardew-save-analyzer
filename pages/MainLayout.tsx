import { PropsWithChildren } from "react";
import { KnownElements } from "~frontend/const/KnownElements";
import { GameSave } from "~frontend/gamesave/GameSave";

import questPng from "~frontend/assets/icon/exclamation.png";
import logoPng from "~frontend/assets/logo.png";
import BuyMeACoffeeSvg from "~frontend/assets/social/buy-me-a-coffee.svg?component";
import GithubSvg from "~frontend/assets/social/github.svg?component";
import PatreonSvg from "~frontend/assets/social/patreon.svg?component";

import styles from "./MainLayout.module.scss";

import "~frontend/style/style.scss";

interface Props extends PropsWithChildren {}

export function MainLayout(props: Props) {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <a href="/">
          <img width={350} src={logoPng} />
        </a>
        <span>last updated for v{GameSave.compatibleVersion}</span>
      </header>

      <div className={styles.content}>
        <section
          id={KnownElements.DISCLAIMERS.id}
          className={styles.disclaimers}
        >
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
              </a>. Its aim is to provide players with helpful resources and
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

        {props.children}
      </div>

      <footer className={styles.footer}>
        <div className={styles.credits}>
          <span>
            Coded with <span style={{ color: "#f76767" }}>♥</span> by{" "}
            <a href="https://github.com/iGoodie" target="_blank">
              iGoodie
            </a>
          </span>
        </div>

        <div className={styles.siteInfo}>
          <span>
            Game Version: <em>v{GameSave.compatibleVersion}</em>
          </span>
          <span>
            Site Version: <em>v{process.env.APP_VERSION}</em>
          </span>
          <button
            onClick={() => {
              KnownElements.DISCLAIMERS.scrollInto().then((element) => {
                // TODO: play a flash animation to indicate disclaimers
              });
            }}
          >
            See Disclaimers
          </button>
        </div>

        <div className={styles.links}>
          <a
            href="https://github.com/iGoodie/stardew-save-analyzer"
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
