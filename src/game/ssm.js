/**
 * return a configured object for boardgame io that is a server side move
 * @param {function} move
 */
export const ssm = (move) => ({
  move,
  client: false,
});
