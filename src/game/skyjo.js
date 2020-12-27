import { PlayerView } from 'boardgame.io/core';
import { newDeck } from './cards';
import { deal } from './moves/deal';

export const SkyJo = {
  minPlayers: 2,
  maxPlayers: 6,
  name: 'skyjo',
  playerView: PlayerView.STRIP_SECRETS,
  setup: (ctx) => ({
    secret: {
      deck: ctx.random.Shuffle(newDeck()),
    },
    boards: {},
    scores: {},
  }),
  phases: {
    startup: {
      start: true,
      moves: {
        deal,
      },
      next: 'reveal',
    },
    reveal: {
      moves: {

      },
    },
  },
};
