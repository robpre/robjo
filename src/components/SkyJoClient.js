import { Client } from "boardgame.io/react";
import { SocketIO, Local } from "boardgame.io/multiplayer";
import { SkyJo } from "../game/skyjo";
import { SkyJoGameBoard } from "./SkyJoGameBoard";

const local = new Local({
  // persist: true,
});

const socket = new SocketIO({
  server: `${window.location.protocol}//${window.location.hostname}:${window.location.port}/`,
});

const LocalComponent = new Client({
  game: SkyJo,
  board: SkyJoGameBoard,
  debug: process.env.NODE_ENV === "development",
  multiplayer: local,
});
const RemoteComponent = new Client({
  game: SkyJo,
  board: SkyJoGameBoard,
  debug: process.env.NODE_ENV === "development",
  multiplayer: socket,
});

export const SkyJoClient = ({ localMode, ...props }) => {
  let client;

  if (localMode) {
    client = (
      <LocalComponent
        ref={(el) => {
          if (el?.client) {
            el.client.matchData = props.matchData;
          }
        }}
        {...props}
      />
    );
  } else {
    client = <RemoteComponent {...props} />;
  }

  return client;
};
