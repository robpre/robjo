import { TurnOrder } from "boardgame.io/core";
import { addCards, EMPTY_CARD, HIDDEN_CARD } from "../cards";
import { ssm } from "../ssm";

const swapActive = (G, ctx, i) => {
  const oldCard = G.secret.hands[ctx.currentPlayer][i];

  G.discard = oldCard;
  G.secret.hands[ctx.currentPlayer][i] = G.active[ctx.currentPlayer];
  G.boards[ctx.currentPlayer][i] = G.active[ctx.currentPlayer];

  G.active[ctx.currentPlayer] = EMPTY_CARD;

  ctx.events.endTurn();
};

export const cycle = {
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
  turn: {
    order: TurnOrder.CONTINUE,
    onBegin: (G, ctx) => {
      ctx.events.setActivePlayers({ moveLimit: 1, currentPlayer: "chooseActive" });
    },
    stages: {
      chooseActive: {
        moves: {
          chooseRandom: ssm((G, ctx) => {
            G.active[ctx.currentPlayer] = G.secret.deck.pop();
            ctx.events.setActivePlayers({ moveLimit: 1, currentPlayer: "discardOrSwap" });
          }),
          chooseDiscard: ssm((G, ctx) => {
            G.active[ctx.currentPlayer] = G.discard;
            G.discard = EMPTY_CARD;
            ctx.events.setActivePlayers({ moveLimit: 1, currentPlayer: "swapOnly" });
          }),
        },
      },
      discardOrSwap: {
        moves: {
          swap: ssm(swapActive),
          discard: ssm((G, ctx) => {
            G.discard = G.active[ctx.currentPlayer];
            G.active[ctx.currentPlayer] = EMPTY_CARD;
            ctx.events.setActivePlayers({ moveLimit: 1, currentPlayer: "flipOver" });
          }),
        },
      },
      swapOnly: {
        moves: {
          swap: ssm(swapActive),
        },
      },
      flipOver: {
        moves: {
          flip: ssm((G, ctx, i) => {
            G.boards[ctx.currentPlayer][i] =
              G.secret.hands[ctx.currentPlayer][i];
            ctx.events.endTurn();
          }),
        },
      },
    },
    onEnd: (G, ctx) => {
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
  },
}
