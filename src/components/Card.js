import React from "react";
import { Box, VisuallyHidden } from "@chakra-ui/react";
import { EMPTY_CARD, HIDDEN_CARD } from "../game/cards";

const backgroundPicker = (value) => {
  switch (value) {
    case HIDDEN_CARD:
      return "linear-gradient(45deg, #fff722, #ff26f9),linear-gradient(142deg, transparent, white),linear-gradient(108deg, red, transparent)";
    case EMPTY_CARD:
      return "transparent";
    default:
      if (value === 0) {
        return "#8cc2d1";
      }
      if (value < 0) {
        return "#5a5c8e";
      }
      if (value > 9) {
        return "#b73b45";
      }
      if (value > 4) {
        return "#dbc753";
      }

      return "#77a24b";
  }
};

export const Card = ({ value, onClick = () => {}, disabled }) => (
  <Box
    onClick={evt => { if (!disabled && onClick) { onClick(evt)} }}
    background={backgroundPicker(value)}
    borderRadius="15%"
    border="5px solid white"
    height="100px"
    width="70px"
    cursor={disabled ? "auto" : "pointer"}
    d="flex"
    justifyContent="center"
    alignItems="center"
  >
    <VisuallyHidden>
      <button
        type="button"
        disabled={disabled ? "disabled": undefined}
        onClick={(evt) => {
          evt.stopPropagation();
          if (!disabled && onClick) { onClick(evt)}
        }}
      >
        click to select card with value
      </button>
    </VisuallyHidden>
    <Box
      w="50PX"
      h="50px"
      borderRadius="50%"
      background="white"
      color="black"
      border="2px solid black"
      d="flex"
      justifyContent="center"
      alignItems="center"
    >
      {value}
    </Box>
  </Box>
);
