import React from "react";
import { Box, Button, HStack, Text } from "@chakra-ui/react";
import keyBy from "lodash.keyby";

import { CardGrid } from "./SkyJoGameBoard/CardGrid";
import { SimpleRouter } from "./SimpleRouter";
import { Card } from "./Card";
import { addCards, EMPTY_CARD, HIDDEN_CARD } from "../game/cards";

const makeMatcher = (needle) => ({ id }) => `${id}` === `${needle}`;
const omit = (keyedObj, key) => {
  const output = {};

  Object.entries(keyedObj).forEach(([k, v]) => {
    if (`${key}` !== `${k}`) {
      output[k] = v;
    }
  });

  return output;
};

const Spread = ({ cards = [], name, onCardClick, isActive, disabled }) => (
  <Box border="1px dotted" borderColor="grey" m={2} p={2}>
    <Box m={2}>
      <Text as={isActive ? "mark" : undefined} p={2} d="inline-block">
        {name}: ({addCards(cards)})
      </Text>
    </Box>
    <CardGrid cards={cards} onCardClick={onCardClick} disabled={disabled} />
  </Box>
);

const SpreadLayout = ({
  otherData,
  otherCards,
  name,
  cards,
  onCardClick,
  playerID,
  activePlayers,
  disabled,
}) => (
  <Box d="flex" mt={2}>
    <Spread
      isActive={activePlayers.includes(playerID)}
      name={name}
      cards={cards}
      onCardClick={onCardClick}
      disabled={disabled}
    />
    {Object.entries(otherCards).map(([id, cards]) => (
      <Spread
        key={`${id}${cards}`}
        isActive={activePlayers.includes(id)}
        name={otherData[id]?.name}
        cards={cards}
      />
    ))}
  </Box>
);

// const Container = ({ children }) => <>{children}</>;

export const SkyJoGameBoard = ({ G, ctx, matchData = [], moves, playerID }) => {
  const curPlayer = makeMatcher(playerID);
  const data = matchData.find(curPlayer) || {};
  const otherData = keyBy(
    matchData.filter((p) => !curPlayer(p)),
    ({ id }) => id
  );
  const cards = G.boards[playerID];
  const otherCards = omit(G.boards, playerID);
  const activePlayers = Object.keys(
    ctx.activePlayers || { [ctx.currentPlayer]: null }
  );
  const isActive = activePlayers.includes(playerID);
  const activeStage = ctx.activePlayers?.[playerID];

  return (
    <Box textAlign="left" p={2}>
      <HStack spacing={4}>
        <Box>
          <Text>Discard:</Text>
          <Card
            value={G.discard}
            disabled={activeStage !== "chooseActive"}
            onClick={() => {
              moves.chooseDiscard();
            }}
          />
        </Box>
        <Box>
          <Text>Draw deck:</Text>
          <Card
            disabled={activeStage !== "chooseActive"}
            value={HIDDEN_CARD}
            onClick={() => {
              moves.chooseRandom();
            }}
          />
        </Box>
        <HStack spacing={2}>
          <Box>
            <Text>Selected Card:</Text>
            <Card
              value={G.phase !== "startup" ? G.active[playerID] : EMPTY_CARD}
              disabled
            />
          </Box>
          <Button
            disabled={activeStage !== 'discardOrSwap'}
            type="button"
            onClick={() => moves.discard?.()}
          >
            Discard
          </Button>
        </HStack>
      </HStack>
      <SimpleRouter phase={ctx.phase}>
        <Box route="startup" mt={4}>
          {isActive && (
            <Button type="button" onClick={() => moves.deal()}>
              Deal!
            </Button>
          )}
          {!isActive && (
            <Text>
              Ask {otherData[ctx.currentPlayer]?.name} to deal the cards!
            </Text>
          )}
        </Box>
        <SpreadLayout
          route="reveal"
          cards={cards}
          name={data.name}
          playerID={playerID}
          otherData={otherData}
          onCardClick={(pos) => {
            moves.reveal(pos);
          }}
          otherCards={otherCards}
          activePlayers={activePlayers}
        />
        <SpreadLayout
          route="cycle"
          cards={cards}
          name={data.name}
          playerID={playerID}
          otherData={otherData}
          disabled={!(activeStage === "swapOnly" || activeStage === "flipOver" || activeStage === "discardOrSwap")}
          onCardClick={(pos) => {
            if (activeStage === "swapOnly" || activeStage === "discardOrSwap") {
              moves.swap(pos);
            } else if(activeStage === "flipOver") {
              moves.flip(pos);
            }
          }}
          otherCards={otherCards}
          activePlayers={activePlayers}
        />
      </SimpleRouter>
    </Box>
  );
};
