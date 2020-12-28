import { PlayerView } from 'boardgame.io/core';
import { addCards, HIDDEN_CARD, newDeck } from './cards';
import { deal } from './moves/deal';
import { reveal } from './moves/reveal';

export const SkyJo = {
  minPlayers: 2,
  maxPlayers: 6,
  name: 'skyjo',
  disableUndo: true,
  playerView: PlayerView.STRIP_SECRETS,
  setup: (ctx) => ({
    secret: {
      deck: ctx.random.Shuffle(newDeck()),
      hands: {},
    },
    discard: null,
    boards: {},
    scores: {},
  }),
  turn: {
    stages: {
      reveal2: {
        moves: { reveal },
        onEnd: (G, ctx) => {
          const [next] = Object.entries(G.boards).reduce(([highestID, highestCards], [playerID, cards]) => {
            if (addCards(cards) > addCards(highestCards)) {
              return [playerID, cards];
            }

            return [highestID, highestCards];
          });

          ctx.events.endTurn({ next })
        },
      }
    }
  },
  endIf: (G) => Object.entries(G.scores).some(([playerID, score]) => {
    return score >= 100;
  }),
  phases: {
    startup: {
      start: true,
      moves: {
        deal,
      },
      next: 'cycle',
    },
    cycle: {
      onBegin: (G, ctx) => {
        ctx.events.setActivePlayers({ all: 'reveal2', moveLimit: 2 });
      },
      endIf: (G, ctx) => Object.entries(G.boards).every(([playerID, board]) => {
        return board.every(v => v !== HIDDEN_CARD);
      }),
      onEnd: (G, ctx) => {
        Object.entries(G.boards).forEach(([playerID, cards]) => {
          G.scores[playerID] += addCards(cards);
        });
      },
    },
  },
};
