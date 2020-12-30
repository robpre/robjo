import React from "react";
import {
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
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
      "Either discard the Selected Card or choose a card to swap with",
    swapOnly: "Swap the Selected Card with one from your board",
    flipOver: "Click on a card on the board to reveal its value",
  },
};

const NextStepDescription = ({ phase, stage }) => {
  return <Text d="block" minH="30px">{translations[phase]?.[stage]}</Text>;
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

const ScoreModal = ({ onOpen, onClose, isOpen, scores, matchData }) => (
  <>
    <Button onClick={onOpen}>Show scores</Button>
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay onClick={onClose} />
      <ModalContent>
        <ModalHeader>Scores</ModalHeader>
        <ModalCloseButton />
        <ModalBody p={2}>
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
    <Box textAlign="left" p={2} pl={0}>
      <ScoreModal
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
        scores={G.scores}
        matchData={matchData}
      />
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
            disabled={activeStage !== "discardOrSwap"}
            type="button"
            onClick={() => moves.discard?.()}
          >
            Discard
          </Button>
        </HStack>
      </HStack>
      <Box mt={2} mb={2}>
        <NextStepDescription phase={ctx.phase} stage={activeStage} />
      </Box>
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
          otherData={otherData}
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
            <Button onClick={() => {
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
            otherData={otherData}
            otherCards={otherCards}
            activePlayers={activePlayers}
          />
        </Box>
      </SimpleRouter>
    </Box>
  );
};
