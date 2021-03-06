import { EMPTY_CARD, HIDDEN_CARD, newDeck } from "../cards";

export const deal = {
  move: (G, ctx) => {
    G.secret.deck = ctx.random.Shuffle(newDeck());
    G.secret.hands = {};
    G.discard = EMPTY_CARD;
    G.playerFirstOut = null;
    G.active = {};
    G.boards = {};

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
      G.active[playerID] = EMPTY_CARD;
    });

    G.discard = G.secret.deck.pop();

    ctx.events.endPhase();
  },
  client: false,
};

export const startup = {
  start: true,
  moves: {
    deal,
  },
  next: "reveal",
};
