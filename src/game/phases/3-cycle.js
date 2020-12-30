import { TurnOrder } from "boardgame.io/core";
import { EMPTY_CARD, HIDDEN_CARD } from "../cards";
import { ssm } from "../ssm";

const revealAllButOne = (G, ctx) => {
  let skipped = 0;
  Object.entries(G.boards).forEach(([id, cards]) => {
    G.boards[id] = cards.map((oldVal, i) => {
      if (oldVal !== HIDDEN_CARD) {
        return oldVal;
      }

      if (skipped < 3 && ctx.currentPlayer!== id) {
        skipped++;
        return HIDDEN_CARD;
      }

      return G.secret.hands[id][i];
    })
  });
}

const swapActive = (G, ctx, i) => {
  const oldCard = G.secret.hands[ctx.playerID][i];

  G.discard = oldCard;
  G.secret.hands[ctx.playerID][i] = G.active[ctx.playerID];
  G.boards[ctx.playerID][i] = G.active[ctx.playerID];

  G.active[ctx.playerID] = EMPTY_CARD;

  ctx.events.endTurn();
};

const disposeMatchingCol = (G, playerID) => {
  const cards = G.boards[playerID];
  const isV = (v) => v !== HIDDEN_CARD && v !== EMPTY_CARD;

  for (let i = 0; i < 4; i++) {
    const x = cards[i];
    const y = cards[i + 4];
    const z = cards[i + 8];

    if (isV(x) && isV(y) && isV(z)) {
      if (x === y && y === z) {
        G.boards[playerID][i] = EMPTY_CARD;
        G.boards[playerID][i + 4] = EMPTY_CARD;
        G.boards[playerID][i + 8] = EMPTY_CARD;
        G.secret.hands[playerID][i] = EMPTY_CARD;
        G.secret.hands[playerID][i + 4] = EMPTY_CARD;
        G.secret.hands[playerID][i + 8] = EMPTY_CARD;
      }
    }
  }
}

export const cycle = {
  endIf: (G, ctx) => Object.entries(G.boards).every(([playerID, cards]) =>
    cards.every((v) => v !== HIDDEN_CARD)
  ),
  next: "endround",
  turn: {
    order: TurnOrder.CONTINUE,
    onBegin: (G, ctx) => {
      if (G.playerFirstOut !== null) {
        if (G.playerFirstOut === ctx.currentPlayer) {
          const playersToReveal = {};
          ctx.playOrder.forEach(id => {
            if (G.playerFirstOut !== id) {
              playersToReveal[id] = "endgameReveal";
            }
          });

          ctx.events.setActivePlayers({
            value: playersToReveal,
          });
          return;
        }
      }

      ctx.events.setActivePlayers({ moveLimit: 1, currentPlayer: "chooseActive" });
    },
    stages: {
      chooseActive: {
        moves: {
          chooseRandom: ssm((G, ctx) => {
            G.active[ctx.playerID] = G.secret.deck.pop();
            ctx.events.setActivePlayers({ moveLimit: 1, currentPlayer: "discardOrSwap" });
          }),
          chooseDiscard: ssm((G, ctx) => {
            G.active[ctx.playerID] = G.discard;
            G.discard = EMPTY_CARD;
            ctx.events.setActivePlayers({ moveLimit: 1, currentPlayer: "swapOnly" });
          }),
        },
      },
      discardOrSwap: {
        moves: {
          swap: ssm(swapActive),
          discard: ssm((G, ctx) => {
            G.discard = G.active[ctx.playerID];
            G.active[ctx.playerID] = EMPTY_CARD;
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
            G.boards[ctx.playerID][i] =
              G.secret.hands[ctx.playerID][i];
            ctx.events.endTurn();
          }),
        },
      },
      endgameReveal: {
        moves: {
          flip: ssm((G, ctx, i) => {
            G.boards[ctx.playerID][i] =
              G.secret.hands[ctx.playerID][i];

            disposeMatchingCol(G, ctx.playerID);
          }),
        },
      },
    },
    onEnd: (G, ctx) => {
      if (G.playerFirstOut === null) {
        revealAllButOne(G, ctx);
      }
      // calculate columns of the same value
      disposeMatchingCol(G, ctx.currentPlayer);

      const cards = G.boards[ctx.currentPlayer];

      if (cards.every((v) => v !== HIDDEN_CARD) && G.playerFirstOut === null) {
        G.playerFirstOut = ctx.currentPlayer;
      }
    },
  },
}
