import { forwardRef } from "react";
import { Box, Text } from "@chakra-ui/react";
import { CardGrid } from "../SkyJoGameBoard/CardGrid";
import { addCards } from "../../game/cards";
import { rippleBoxShadow } from "../../keyframes/ripple";

export const Spread = forwardRef(
  ({ cards = [], name, onCardClick, isActive, disabled, ...props }, ref) => (
    <Box
      borderRadius="5px"
      borderStyle="dotted"
      borderWidth="2px"
      borderColor={disabled ? "gray.100" : "yellow.600"}
      boxShadow={!disabled ? `inset ${rippleBoxShadow}` : undefined}
      m={2}
      p={2}
      ml="0"
      ref={ref}
      {...props}
    >
      <Box m={2}>
        <Text as={isActive ? "mark" : undefined} p={2} d="inline-block">
          {name}: ({addCards(cards)})
        </Text>
      </Box>
      <CardGrid cards={cards} onCardClick={onCardClick} disabled={disabled} />
    </Box>
  )
);
