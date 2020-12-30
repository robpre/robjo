/** @jsxImportSource @emotion/react */
import { useRef, useState } from "react";
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
import ScrollMenu from "react-horizontal-scrolling-menu";
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

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
  endround: "Rounds finished! Ask the active player to restart the round and you'll be able to check the scores.",
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

const Spread = ({ cards = [], name, onCardClick, isActive, disabled }) => (
  <Box border="1px dotted" borderColor="grey" m={2} p={2} ml="0">
    <Box m={2}>
      <Text as={isActive ? "mark" : undefined} p={2} d="inline-block">
        {name}: ({addCards(cards)})
      </Text>
    </Box>
    <CardGrid cards={cards} onCardClick={onCardClick} disabled={disabled} />
  </Box>
);

const SpreadLayout = ({
  otherMatches,
  otherCards,
  name,
  cards,
  onCardClick,
  playerID,
  activePlayers,
  disabled,
}) => {
  const [selected, setSelected] = useState(playerID);
  const ref = useRef();
  const spreads = [
    <Spread
      key={playerID}
      isActive={activePlayers.includes(playerID)}
      name={name}
      cards={cards}
      onCardClick={onCardClick}
      disabled={disabled}
    />,
    ...Object.entries(otherCards).map(([id, cards]) => (
      <Spread
        key={id}
        isActive={activePlayers.includes(id)}
        name={otherMatches[id]?.name}
        cards={cards}
      />
    ))
  ];

  return (
    <Box
      css={{
        ".scroll-menu-arrow": {
          position: "absolute",
          zIndex: 1,
          right: 0,
          ":first-of-type": {
            left: 0,
            right: "auto",
          },
        }
      }}
    >
      <Button
        leftIcon={<ArrowLeftIcon />}
        aria-label="go to the first board"
        onClick={() => {
          setSelected(playerID);
          ref.current?.scrollTo(playerID);
        }}
      >First</Button>
      <ScrollMenu
        data={spreads}
        scrollToSelected
        useButtonRole={false}
        onSelect={key => setSelected(key)}
        ref={ref}
        arrowLeft={<IconButton icon={<ChevronLeftIcon />} aria-label="go left one game board" />}
        arrowRight={<IconButton icon={<ChevronRightIcon />} aria-label="go right one game board" />}
        selected={selected}
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
  const curPlayer = makeMatcher(playerID);
  const data = matchData.find(curPlayer) || {};
  const otherMatches = keyBy(
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
    <Box pt={2} d="flex" flexDirection="column" w="fit-content" maxW="100%">
      <VStack d="inline-flex" width="fit-content">
        <ScoreModal
          isOpen={isOpen}
          onClose={onClose}
          onOpen={onOpen}
          scores={G.scores}
          matchData={matchData}
          w="100%"
        />
        <Wrap spacing={2} w="fit-content" flexWrap="wrap">
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
              value={G.active[playerID] ?? EMPTY_CARD}
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
              Ask {otherMatches[ctx.currentPlayer]?.name} to deal the cards!
            </Text>
          )}
        </Box>
        <SpreadLayout
          route="reveal"
          cards={cards}
          name={data.name}
          playerID={playerID}
          otherMatches={otherMatches}
          onCardClick={(pos) => {
            if (activeStage === "reveal2") {
              moves.reveal(pos);
            }
          }}
          otherCards={otherCards}
          activePlayers={activePlayers}
        />
        <SpreadLayout
          route="cycle"
          cards={cards}
          name={data.name}
          playerID={playerID}
          otherMatches={otherMatches}
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
          otherCards={otherCards}
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
            disabled
            cards={cards}
            name={data.name}
            playerID={playerID}
            otherMatches={otherMatches}
            otherCards={otherCards}
            activePlayers={activePlayers}
          />
        </Box>
      </SimpleRouter>
    </Box>
  );
};
