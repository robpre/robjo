import React from "react";
import { HStack, Stack } from "@chakra-ui/react";
import { Card } from "../Card";

const sliceRows = (cards) => {
  const output = [];

  for (let i = 0; i <= 2; i++) {
    const row = cards.slice(i * 4, i * 4 + 4);
    output.push(row);
  }

  return output;
};

export const CardGrid = ({ cards, onCardClick }) => (
  <Stack d="inline-flex" spacing={4}>
    {sliceRows(cards).map((row, rowI) => (
      <HStack spacing={4} key={`${rowI}${row}`}>
        {row.map((cardValue, i) => (
          <Card
            key={`${cardValue}${i}`}
            value={cardValue}
            disabled={!onCardClick}
            onClick={() => {
              if (onCardClick) {
                onCardClick(rowI * 4 + i, cardValue);
              }
            }}
          />
        ))}
      </HStack>
    ))}
  </Stack>
);
