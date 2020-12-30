import { addCards } from "../cards";
import { ssm } from "../ssm";

export const endround = {
  moves: {
    reset: ssm((G, ctx) => {
      ctx.events.endPhase();
    }),
  },
  onEnd: (G, ctx) => {
    const score = {};
    const lastScores = G.scores[G.scores.length - 1] || {};
    Object.entries(G.secret.hands).forEach(([playerID, cards]) => {
      score[playerID] = (lastScores[playerID] || 0) + addCards(cards);
    });

    G.scores.push(score);
  },
  next: 'startup',
};
