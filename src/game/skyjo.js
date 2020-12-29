import { PlayerView, TurnOrder } from "boardgame.io/core";
import { EMPTY_CARD, newDeck } from "./cards";
import { startup } from "./phases/1-startup";
import { reveal } from "./phases/2-reveal";
import { cycle } from "./phases/3-cycle";

export const SkyJo = {
  minPlayers: 2,
  maxPlayers: 6,
  name: "skyjo",
  disableUndo: true,
  playerView: PlayerView.STRIP_SECRETS,
  setup: (ctx) => ({
    secret: {
      deck: ctx.random.Shuffle(newDeck()),
      hands: {},
    },
    discard: EMPTY_CARD,
    discardPile: [],
    boards: {},
    scores: {},
    active: {},
    choseRandom: false,
  }),
  endIf: (G) =>
    Object.entries(G.scores).some(([playerID, score]) => {
      return score >= 100;
    }),
  turn: {
    order: TurnOrder.CONTINUE,
  },
  phases: {
    startup,
    reveal,
    cycle,
  },
};
