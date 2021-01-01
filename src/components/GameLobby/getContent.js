const translations = {
  startup: {},
  reveal: {
    reveal2:
      "Everyone reveals 2 cards to find out who goes first! Click on 2 cards to reveal their values. The player with the highest score goes first",
  },
  cycle: {
    chooseActive:
      "Choose between the card on top of the discard pile and a random card from the top of the deck",
    discardOrSwap:
      "Either discard the Active Card or choose a card to swap with",
    swapOnly: "Swap the Active Card with one from your board",
    flipOver: "Click on a card on the board to reveal its value",
  },
  endround:
    "Round's finished! Ask the active player to restart the round and you'll be able to check the scores.",
};

export const getContent = ({ phase, stage }) => {
  const phaseObj = translations[phase];
  const content = [];

  if (typeof phaseObj === "string") {
    content.push(phaseObj);
  }

  if (phaseObj?.[stage]) {
    content.push(phaseObj[stage]);
  }

  return content;
};
