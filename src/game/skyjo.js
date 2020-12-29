import { PlayerView, TurnOrder } from "boardgame.io/core";
import { addCards, EMPTY_CARD, HIDDEN_CARD, newDeck } from "./cards";
import { deal } from "./moves/deal";
import { reveal } from "./moves/reveal";

const swapActive = (G, ctx, i) => {
  const oldCard = G.secret.hands[ctx.currentPlayer][i];

  G.discard = oldCard;
  G.secret.hands[ctx.currentPlayer][i] = G.active[ctx.currentPlayer];
  G.boards.hands[ctx.currentPlayer][i] = G.active[ctx.currentPlayer];

  ctx.events.endTurn();
};

const ssr = (move) => ({
  move,
  client: false,
});

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
    startup: {
      start: true,
      moves: {
        deal,
      },
      next: "reveal",
    },
    reveal: {
      onBegin: (G, ctx) => {
        ctx.events.setActivePlayers({ all: "reveal2", moveLimit: 2 });
      },
      turn: {
        order: TurnOrder.CONTINUE,
        stages: {
          reveal2: {
            moves: { reveal },
          },
        },
        endIf: (G, ctx) => {
          const everyRevealed = Object.entries(G.boards).every(
            ([id, cards]) => {
              const countNonHidden = cards.reduce(
                (c, n) => c + (n !== HIDDEN_CARD ? 1 : 0),
                0
              );

              return countNonHidden === 2;
            }
          );

          if (!everyRevealed) {
            return false;
          }

          const [next] = Object.entries(G.boards).reduce(
            ([highestID, highestCards], [playerID, cards]) => {
              if (addCards(cards) > addCards(highestCards)) {
                return [playerID, cards];
              }

              return [highestID, highestCards];
            }
          );

          console.log("setting next player to ", next);
          return { next };
        },
        onEnd: (G, ctx) => {
          ctx.events.endPhase();
        },
      },
      next: "cycle",
    },
    cycle: {
      onBegin: (G, ctx) => {
        ctx.events.setActivePlayers({ currentPlayer: "chooseActive" });
      },
      turn: {
        order: TurnOrder.CONTINUE,
        onEnd: (G, ctx) => {
          G.active[ctx.currentPlayer] = EMPTY_CARD;
          // calculate columns of the same value
          const cards = G.boards[ctx.currentPlayer];

          const isV = (v) => v !== HIDDEN_CARD && v !== EMPTY_CARD;
          for (let i = 0; i < 4; i++) {
            const x = cards[i];
            const y = cards[i + 4];
            const z = cards[i + 8];
            if (isV(x) && isV(y) && isV(z)) {
              if (x === y && y === z) {
                G.boards[ctx.currentPlayer][i] = EMPTY_CARD;
                G.boards[ctx.currentPlayer][i + 4] = EMPTY_CARD;
                G.boards[ctx.currentPlayer][i + 8] = EMPTY_CARD;
                G.secret.hands[ctx.currentPlayer][i] = EMPTY_CARD;
                G.secret.hands[ctx.currentPlayer][i + 4] = EMPTY_CARD;
                G.secret.hands[ctx.currentPlayer][i + 8] = EMPTY_CARD;
              }
            }
          }
        },
        stages: {
          chooseActive: {
            moves: {
              chooseRandom: ssr((G, ctx) => {
                G.active[ctx.currentPlayer] = G.secret.deck.pop();
                ctx.events.setActivePlayers({ currentPlayer: "discardOrSwap" });
              }),
              chooseDiscard: ssr((G, ctx) => {
                G.active[ctx.currentPlayer] = G.discard;
                G.discard = EMPTY_CARD;
                ctx.events.setActivePlayers({ currentPlayer: "swap" });
              }),
            },
          },
          discardOrSwap: {
            moves: {
              swap: ssr(swapActive),
              discard: ssr((G, ctx) => {
                G.discard = G.active[ctx.currentPlayer];
                ctx.events.setActivePlayers({ currentPlayer: "turnOver" });
              }),
            },
          },
          swap: {
            moves: {
              swap: ssr(swapActive),
            },
          },
          turnOver: {
            moves: {
              flip: ssr((G, ctx, i) => {
                G.boards[ctx.currentPlayer][i] =
                  G.secret.hands[ctx.currentPlayer][i];
                ctx.events.endTurn();
              }),
            },
          },
        },
      },
      endIf: (G, ctx) =>
        Object.entries(G.boards).some(([playerID, cards]) => {
          return cards.every((v) => v !== HIDDEN_CARD);
        }),
      onEnd: (G, ctx) => {
        Object.entries(G.secret.hands).forEach(([playerID, cards]) => {
          G.scores[playerID] += addCards(cards);
        });
      },
      next: "startup",
    },
  },
};
