import React, { Fragment } from 'react';
import { Box, Button, Text } from '@chakra-ui/react';
import keyBy from 'lodash.keyby';

import { CardGrid } from './SkyJoGameBoard/CardGrid';
import { SimpleRouter } from './SimpleRouter';

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

const Spread = ({ cards, name }) => (
  <Box>
    <Text>{name}</Text>
    <CardGrid cards={cards} />
  </Box>
);

const SpreadLayout = ({ otherData, otherCards, name, cards }) => (
  <Box>
    <Spread name={name} cards={cards} />
    {Object.entries(otherCards).map(([id, cards]) => (
      <Spread name={otherData[id]?.name} cards={cards} />
    ))}
  </Box>
);

const Container = ({ children }) => <>{children}</>;

export const SkyJoGameBoard = ({ G, playerID, ctx, matchData = [], moves, ...props }) => {
  const curPlayer = makeMatcher(playerID);
  const data = matchData.find(curPlayer) || {};
  const otherData = keyBy(matchData.filter(p => !curPlayer(p)), ({ id }) => id);

  const cards = G.boards[playerID];
  const otherCards = omit(G.boards, playerID);

  return (
    <Box
      textAlign="left"
      p={2}
    >
      <SimpleRouter phase={ctx.phase}>
        <Container route="startup">
          {curPlayer({ id: ctx.currentPlayer }) && (<Button type="button" onClick={() => moves.deal()}>Deal!</Button>)}
          {!curPlayer({ id: ctx.currentPlayer }) && (
            <Text>Ask {otherData[ctx.currentPlayer]?.name} to deal the cards!</Text>
          )}
        </Container>
        <SpreadLayout
          route="cycle"
          otherData={otherData}
          otherCards={otherCards}
          name={data.name}
          cards={cards}
        />
      </SimpleRouter>
    </Box>
  );
};
