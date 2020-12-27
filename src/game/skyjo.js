import { PlayerView } from 'boardgame.io/core';
import { newDeck } from './cards';

export const SkyJo = {
  playerView: PlayerView.STRIP_SECRETS,
  setup: (ctx) => ({
    secret: {
      deck: ctx.random.Shuffle(newDeck()),
    },
    boards: {},
    scores: {},
  }),
  // phases: {
  //   start: {
  //     start: true,
  //     moves: {
  //     },
  //   },
  // },
  moves: {
    deal: {
      move: (G, ctx) => {
        debugger;
        // G.secret.deck;
        // G.boards;
      },
      undoable: true,
      client: false,
    },
  },
};
