const makeSuit = (count, value) => new Array(count).fill(value);

export const newDeck = () => [
  ...makeSuit(5, -2),
  ...makeSuit(10, -1),
  ...makeSuit(15, 0),
  ...makeSuit(10, 1),
  ...makeSuit(10, 2),
  ...makeSuit(10, 3),
  ...makeSuit(10, 4),
  ...makeSuit(10, 5),
  ...makeSuit(10, 6),
  ...makeSuit(10, 7),
  ...makeSuit(10, 8),
  ...makeSuit(10, 9),
  ...makeSuit(10, 10),
  ...makeSuit(10, 11),
  ...makeSuit(10, 12),
];
