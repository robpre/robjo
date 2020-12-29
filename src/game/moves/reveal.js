export const reveal = {
  move: (G, ctx, i) => {
    G.boards[ctx.playerID][i] = G.secret.hands[ctx.playerID][i];
  },
  client: false,
};
