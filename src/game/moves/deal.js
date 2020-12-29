import { EMPTY_CARD, HIDDEN_CARD } from "../cards";

export const deal = {
  move: (G, ctx) => {
    for (let i = 0; i < 12; i++) {
      ctx.playOrder.forEach((playerID) => {
        if (!G.secret.hands[playerID]) {
          G.secret.hands[playerID] = [];
        }
        G.secret.hands[playerID].push(G.secret.deck.pop());
      });
    }

    ctx.playOrder.forEach((playerID) => {
      G.secret.hands[playerID] = ctx.random.Shuffle(G.secret.hands[playerID]);
      G.boards[playerID] = new Array(12).fill(HIDDEN_CARD);
      G.scores[playerID] = 0;
      G.active[playerID] = EMPTY_CARD;
    });

    G.discard = G.secret.deck.pop();

    ctx.events.endPhase();
  },
  client: false,
};
