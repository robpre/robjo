import React from "react";
import { Box, useTheme, VisuallyHidden } from "@chakra-ui/react";
import { EMPTY_CARD, HIDDEN_CARD } from "../game/cards";
import { ripple } from "../keyframes/ripple";

const backgroundPicker = (value) => {
  switch (value) {
    case HIDDEN_CARD:
      return "linear-gradient(45deg, #fff722, #ff26f9),linear-gradient(142deg, transparent, white),linear-gradient(108deg, red, transparent)";
    case EMPTY_CARD:
      return "transparent";
    default:
      // 0
      if (value === 0) {
        return "#8cc2d1";
      }
      // -2, -1
      if (value < 0) {
        return "#5a5c8e";
      }
      // 9, 10, 11, 12
      if (value > 8) {
        return "#b73b45";
      }
      // 5, 6, 7, 8
      if (value > 4) {
        return "#dbc753";
      }
      // 1, 2, 3, 4
      return "#77a24b";
  }
};

export const Card = ({ value, onClick = () => {}, disabled }) => {
  const { colors } = useTheme();

  return (
    <Box
      border={`5px solid ${!disabled ? colors.blue["100"] : "#ccc"}`}
      animation={!disabled ? `${ripple} 2s infinite` : undefined}
      onClick={(evt) => {
        if (!disabled && onClick) {
          onClick(evt);
        }
      }}
      background={backgroundPicker(value)}
      borderRadius="15%"
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
          disabled={disabled ? "disabled" : undefined}
          onClick={(evt) => {
            evt.stopPropagation();
            if (!disabled && onClick) {
              onClick(evt);
            }
          }}
        >
          click to select card with value
        </button>
      </VisuallyHidden>
      <Box
        w="50PX"
        h="50px"
        d="flex"
        borderRadius="50%"
        background="white"
        color="black"
        border="2px solid black"
        justifyContent="center"
        alignItems="center"
        cursor={disabled ? "auto" : "pointer"}
      >
        {value}
      </Box>
    </Box>
  );
};
