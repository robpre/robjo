import { TurnOrder, INVALID_MOVE } from "boardgame.io/core";
import { addCards, HIDDEN_CARD } from "../cards";
import { ssm } from "../ssm";

export const reveal = {
  onBegin: (G, ctx) => {
    ctx.events.setActivePlayers({ all: "reveal2", moveLimit: 2 });
  },
  next: "cycle",
  turn: {
    order: TurnOrder.CONTINUE,
    stages: {
      reveal2: {
        moves: {
          reveal: ssm((G, ctx, i) => {
            if (G.boards[ctx.playerID][i] !== HIDDEN_CARD) {
              return INVALID_MOVE;
            }
            G.boards[ctx.playerID][i] = G.secret.hands[ctx.playerID][i];
          }),
        },
      },
    },
    endIf: (G, ctx) => {
      const everyRevealed = Object.entries(G.boards).every(([id, cards]) => {
        const countNonHidden = cards.reduce(
          (c, n) => c + (n !== HIDDEN_CARD ? 1 : 0),
          0
        );

        return countNonHidden === 2;
      });

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
};
