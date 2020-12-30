import { EMPTY_CARD } from "./cards";

export const initialState = (ctx) => ({
  secret: {
    deck: [],
    hands: {},
  },
  discard: EMPTY_CARD,
  boards: {},
  scores: [],
  active: {},
  playerFirstOut: null,
});
