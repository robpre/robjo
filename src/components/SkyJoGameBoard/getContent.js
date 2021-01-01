const translations = {
  startup: {
    undefined: "Time to start the round by dealing the cards",
  },
  reveal: {
    reveal2:
      "Everyone reveals 2 cards to find out who goes first! Click on 2 cards to reveal their values",
  },
  cycle: {
    undefined: "It's activePlayerName's turn, check the name in yellow",
    chooseActive:
      "Choose between the card on top of the discard pile and a random card from the top of the deck",
    discardOrSwap:
      "Either discard the Active Card or choose a card to swap with",
    swapOnly: "Swap the Active Card with one from your board",
    flipOver: "Click on a card on the board to reveal its value",
    endgameReveal: "Now everyone needs to reveal their remaining cards",
  },
  endround:
    "Round's finished! Ask the active player to restart the round and you'll be able to check the scores",
};

const tips = {
  // startup: {},
  reveal: {
    reveal2: "The player with the highest score goes first",
  },
  cycle: {
    undefined: "Keep an eye out for who's going out first",
    // chooseActive: "",
    discardOrSwap:
      "Being out first isn't always the best! If you go out first and you don't have the lowest score it will be doubled at the end of the round",
    // swapOnly: "Swap the Active Card with one from your board",
    // flipOver: "Click on a card on the board to reveal its value",
    // endgameReveal: "Now everyone needs to reveal their remaining cards",
  },
  endround:
    "When a player first reaches 100 the game will end! Make sure your score is lowest by then",
};

export const getContent = ({
  phase,
  stage,
  activePlayerName = "someone else",
}) => {
  const phaseObj = translations[phase];
  const tipsObj = tips[phase];
  const content = [];

  if (phaseObj?.[stage]) {
    content.push(phaseObj[stage].replace("activePlayerName", activePlayerName));
  }

  if (tipsObj?.[stage]) {
    content.push(tipsObj[stage].replace("activePlayerName", activePlayerName));
  }

  return content;
};
