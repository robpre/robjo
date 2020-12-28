import React from 'react';
import { Box, Button, HStack, Stack, VisuallyHidden } from '@chakra-ui/react';

const sliceRows = (cards) => {
  const output = [];

  for (let i = 0; i <= 2; i++) {
    const row = cards.slice(i * 4, i * 4 + 4);
    output.push(row);
  }

  return output;
}

const Card = ({ value, onClick, disabled }) => (
  <Box
    onClick={onClick}
    color="black"
    background="white"
    borderRadius="15%"
    height="100px"
    width="50px"
    cursor="pointer"
  >
    <VisuallyHidden>
      <button type="button" disabled={disabled} onClick={evt => {
        evt.stopPropagation();
        onClick(evt);
      }}>click to select card with value</button>
    </VisuallyHidden>
    {value}
  </Box>
);

export const CardGrid = ({ cards, onCardClick }) => (
  <Stack d="inline-flex">
    {sliceRows(cards).map((row, rowI) => (
      <HStack spacing={2}>
        {row.map((cardValue, i) => (
          <Card key={`${cardValue}${i}`} value={cardValue} onClick={evt => {
            onCardClick((rowI + 1) * i, cardValue);
          }} />
        ))}
      </HStack>
    ))}
  </Stack>
);
