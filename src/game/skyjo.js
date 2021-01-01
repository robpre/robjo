import { PlayerView, TurnOrder } from "boardgame.io/core";
import { initialState } from "./initialState";
import { startup } from "./phases/1-startup";
import { reveal } from "./phases/2-reveal";
import { cycle } from "./phases/3-cycle";
import { endround } from "./phases/4-endround";

export const SkyJo = {
  minPlayers: 2,
  maxPlayers: 6,
  name: "skyjo",
  disableUndo: true,
  playerView: PlayerView.STRIP_SECRETS,
  setup: initialState,
  endIf: (G) => {
    const lastScore = G.scores[G.scores.length - 1] || {};

    return Object.entries(lastScore).some(([playerID, score]) => {
      return score >= 100;
    });
  },
  turn: {
    order: TurnOrder.CONTINUE,
  },
  phases: {
    startup,
    reveal,
    cycle,
    endround,
  },
  events: {
    endStage: false,
    endTurn: false,
    endPhase: false,
    endGame: false,
    setStage: false,
    setPhase: false,
    setActivePlayers: false,
  },
};
