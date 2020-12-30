import omit from 'lodash.omit';
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
    const firstOutScore = addCards(G.secret.hands[G.playerFirstOut]);
    let hasLowest = true;

    Object.entries(omit(G.secret.hands, G.playerFirstOut)).forEach(([playerID, cards]) => {
      const s = addCards(cards);

      if (s <= firstOutScore && hasLowest) {
        hasLowest = false;
      }

      score[playerID] = (lastScores[playerID] || 0) + s;
    });

    score[G.playerFirstOut] = hasLowest ? firstOutScore : firstOutScore * 2;

    G.scores.push(score);
  },
  next: 'startup',
};
