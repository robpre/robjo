/** @jsxImportSource @emotion/react */
import { forwardRef, useRef } from "react";
import {
  Box,
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import keyBy from "lodash.keyby";

import { CardGrid } from "./SkyJoGameBoard/CardGrid";
import { SimpleRouter } from "./SimpleRouter";
import { Card } from "./Card";
import { addCards, EMPTY_CARD, HIDDEN_CARD } from "../game/cards";
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

// const makeMatcher = (needle) => ({ id }) => `${id}` === `${needle}`;

// phase + client's stage
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
  endround: "Round's finished! Ask the active player to restart the round and you'll be able to check the scores.",
};

const NextStepDescription = ({ phase, stage }) => {
  const phaseObj = translations[phase];

  return (
    <Text d="block" minH="30px">
      {typeof phaseObj === "string" && phaseObj}
      {phaseObj?.[stage]}
    </Text>
  );
};

const Spread = forwardRef(({ cards = [], name, onCardClick, isActive, disabled, ...props }, ref) => (
  <Box border="1px dotted" borderColor="grey" m={2} p={2} ml="0" {...props} ref={ref}>
    <Box m={2}>
      <Text as={isActive ? "mark" : undefined} p={2} d="inline-block">
        {name}: ({addCards(cards)})
      </Text>
    </Box>
    <CardGrid cards={cards} onCardClick={onCardClick} disabled={disabled} />
  </Box>
));

const SpreadLayout = ({
  matchKeyed,
  boards,
  onCardClick,
  playerID,
  activePlayers,
  disabled,
  playOrder,
}) => {
  const ref = useRef();
  const playerIndex = playOrder.indexOf(playerID);
  const renderOrder = [...playOrder.slice(playerIndex), ...playOrder.slice(0, playerIndex)];
  const boardRefs = [];
  const makeAssignRef = i => el => boardRefs[i] = el;

  const move = dir => () => {
    if (!ref.current || !boardRefs[0]) {
      return;
    }

    const boardWidth = boardRefs[0].offsetWidth;

    /* eslint-disable-next-line array-callback-return */
    boardRefs.some((bRef, i) => {
      if (bRef.offsetLeft <= (ref.current.scrollLeft)) {
        if (bRef.offsetLeft + boardWidth >= (ref.current.scrollLeft)) {
          if (boardRefs[i + dir]) {
            ref.current.scrollTo((i + dir) * boardWidth, 0);
            return true;
          }
        }
      }
    })
  };

  return (
    <Box
      position="relative"
    >
      <Button
        colorScheme="blue"
        leftIcon={<ArrowLeftIcon />}
        aria-label="go to the first board"
        top="0"
        onClick={() => {
          ref.current?.scrollTo(0, 0);
        }}
      >First</Button>
      <IconButton
        aria-label="go left one game board"
        colorScheme="blue"
        left="0"
        icon={<ChevronLeftIcon />}
        onClick={move(0)}
        top="0"
        size="md"
        position="absolute"
      />
      <Box
        ref={ref}
        d="flex"
        overflow="auto"
        flexWrap="nowrap"
        style={{
          scrollBehavior: "smooth",
        }}
      >
        {renderOrder.map((id, i) => (
          <Spread
            key={id}
            ref={makeAssignRef(i)}
            isActive={activePlayers.includes(id)}
            name={matchKeyed[id]?.name}
            cards={boards[id]}
            onCardClick={id === playerID ? onCardClick : undefined}
            disabled={id === playerID ? disabled : true}
          />
        ))}
      </Box>
      <IconButton
        onClick={move(1)}
        colorScheme="blue"
        icon={<ChevronRightIcon />}
        aria-label="go right one game board"
        position="absolute"
        top="0"
        right="0"
        size="md"
      />
    </Box>
  );
};

const ScoreModal = ({ onOpen, onClose, isOpen, scores, matchData }) => (
  <>
    <Button colorScheme="blue" mb={2} onClick={onOpen}>Show scores</Button>
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay onClick={onClose} />
      <ModalContent position="absolute" p={2}>
        <ModalHeader>Scores</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Table variant="striped" colorScheme="grey">
            <Thead>
              <Tr>
                <Th>
                  <Text textAlign="center">Game</Text>
                </Th>
                {matchData.map(({ id, name }) => (
                  <Th key={`${id}${name}`}>
                    <Text textAlign="center">{name}</Text>
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {(scores.length ? scores : [{}]).map((score, game, allGames) => (
                <Tr key={`${game}${JSON.stringify(score)}`}>
                  <Td>
                    <Text textAlign="center">{game + 1}</Text>
                  </Td>
                  {matchData.map(({ id }) => (
                    <Td key={`${id}${score[id]}`}>
                      <Text
                        textAlign="center"
                        as={allGames.length !== game + 1 ? "s" : undefined}
                        d="block"
                      >
                        {score[id] || "0"}
                      </Text>
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </ModalBody>
      </ModalContent>
    </Modal>
  </>
);
// const Container = ({ children }) => <>{children}</>;

export const SkyJoGameBoard = ({ G, ctx, matchData = [], moves, playerID }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const curPlayer = makeMatcher(playerID);
  const matchKeyed = keyBy(
    matchData,
    ({ id }) => id
  );
  const activePlayers = Object.keys(
    ctx.activePlayers || { [ctx.currentPlayer]: null }
  );
  const isActive = activePlayers.includes(playerID);
  const activeStage = ctx.activePlayers?.[playerID];

  return (
    <Box pt={2} d="flex" flexDirection="column" maxW="100%">
      <VStack d="inline-flex">
        <ScoreModal
          isOpen={isOpen}
          onClose={onClose}
          onOpen={onOpen}
          scores={G.scores}
          matchData={matchData}
          w="100%"
        />
        <Wrap spacing={2} flexWrap="wrap">
          <WrapItem>
            <Stack>
            <Text>Discard:</Text>
            <Card
              value={G.discard}
              disabled={activeStage !== "chooseActive"}
              onClick={() => {
                moves.chooseDiscard();
              }}
            />
            </Stack>
          </WrapItem>
          <WrapItem>
            <Stack>
            <Text>Draw:</Text>
            <Card
              disabled={activeStage !== "chooseActive"}
              value={HIDDEN_CARD}
              onClick={() => {
                moves.chooseRandom();
              }}
            />
            </Stack>
          </WrapItem>
          <WrapItem>
            <Stack>
            <Text>Active:</Text>
            <Card
              value={G.active[ctx.currentPlayer] ?? EMPTY_CARD}
              disabled
            />
            </Stack>
          </WrapItem>
          <WrapItem>
            <Stack justifyContent="center" minH="100%">
              <Button
                d="block"
                colorScheme="blue"
                disabled={activeStage !== "discardOrSwap"}
                type="button"
                onClick={() => moves.discard?.()}
              >
                Discard
              </Button>
            </Stack>
          </WrapItem>
        </Wrap>
      </VStack>
      <Box mt={2} mb={2}>
        <NextStepDescription phase={ctx.phase} stage={activeStage} />
      </Box>
      <SimpleRouter phase={ctx.phase}>
        <Box route="startup" mt={4}>
          {isActive && (
            <Button colorScheme="blue" type="button" onClick={() => moves.deal()}>
              Deal!
            </Button>
          )}
          {!isActive && (
            <Text>
              Ask {matchKeyed[ctx.currentPlayer]?.name} to deal the cards!
            </Text>
          )}
        </Box>
        <SpreadLayout
          playOrder={ctx.playOrder}
          route="reveal"
          playerID={playerID}
          matchKeyed={matchKeyed}
          onCardClick={(pos) => {
            if (activeStage === "reveal2") {
              moves.reveal(pos);
            }
          }}
          boards={G.boards}
          activePlayers={activePlayers}
        />
        <SpreadLayout
          playOrder={ctx.playOrder}
          route="cycle"
          playerID={playerID}
          matchKeyed={matchKeyed}
          disabled={
            !(
              activeStage === "swapOnly" ||
              activeStage === "flipOver" ||
              activeStage === "discardOrSwap" ||
              activeStage === "endgameReveal"
            )
          }
          onCardClick={(pos) => {
            if (activeStage === "swapOnly" || activeStage === "discardOrSwap") {
              moves.swap(pos);
            } else if (activeStage === "flipOver" || activeStage === "endgameReveal") {
              moves.flip(pos);
            }
          }}
          boards={G.boards}
          activePlayers={activePlayers}
        />
        <Box
          route="endround"
        >
          {isActive && (
            <Button colorScheme="blue" onClick={() => {
              moves.reset();
            }}>
              End round
            </Button>
          )}
          <SpreadLayout
            playOrder={ctx.playOrder}
            disabled
            playerID={playerID}
            matchKeyed={matchKeyed}
            boards={G.boards}
            activePlayers={activePlayers}
          />
        </Box>
      </SimpleRouter>
    </Box>
  );
};
