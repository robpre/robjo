/** @jsxImportSource @emotion/react */
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Collapse,
  HStack,
  Stack,
  Text,
  useDisclosure,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import keyBy from "lodash.keyby";

import { SimpleRouter } from "./SimpleRouter";
import { Card } from "./Card";
import { EMPTY_CARD, HIDDEN_CARD } from "../game/cards";
import { SpreadLayout } from "./GameLobby/SpreadLayout";
import { ScoreModal } from "./GameLobby/ScoreModal";
import { DeleteIcon, QuestionIcon } from "@chakra-ui/icons";
import { getContent } from "./GameLobby/getContent";
import { ripple, rippleBoxShadow } from "../keyframes/ripple";

export const SkyJoGameBoard = ({ G, ctx, matchData = [], moves, playerID }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: helpIsOpen, onToggle: onToggleHelp } = useDisclosure();
  // const curPlayer = makeMatcher(playerID);
  const matchKeyed = keyBy(matchData, ({ id }) => id);
  const activePlayers = Object.keys(
    ctx.activePlayers || { [ctx.currentPlayer]: null }
  );
  const isActive = activePlayers.includes(playerID);
  const activeStage = ctx.activePlayers?.[playerID];
  const content = getContent({ phase: ctx.phase, stage: activeStage });

  return (
    <Box pt={2} d="flex" flexDirection="column" maxW="100%">
      <VStack d="inline-flex">
        <HStack w="100%" justifyContent="flex-end">
          <ScoreModal
            isOpen={isOpen}
            onClose={onClose}
            onOpen={onOpen}
            scores={G.scores}
            matchData={matchData}
          />
          {content.length > 0 && (
            <Button
              rightIcon={<QuestionIcon />}
              aria-label="show help text"
              children="Help"
              onClick={onToggleHelp}
            />
          )}
        </HStack>
        <Collapse
          mt={2}
          in={content.length > 0 && helpIsOpen}
          animateOpacity
          w="100%"
        >
          <Box color="white" bg="blue.500" rounded="md" shadow="md">
            <Alert status="info">
              <AlertIcon />
              {content}
            </Alert>
          </Box>
        </Collapse>
        <Wrap
          spacing={2}
          flexWrap="wrap"
          borderRadius="5px"
          p={2}
          boxShadow={
            activeStage === "chooseActive" || activeStage === "discardOrSwap"
              ? `inset ${rippleBoxShadow}`
              : undefined
          }
        >
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
              <Text>Deck:</Text>
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
                animation={
                  activeStage === "discardOrSwap"
                    ? `${ripple} 2s infinite`
                    : undefined
                }
                disabled={activeStage !== "discardOrSwap"}
                rightIcon={<DeleteIcon />}
                type="button"
                onClick={() => moves.discard?.()}
              >
                Discard
              </Button>
            </Stack>
          </WrapItem>
        </Wrap>
      </VStack>
      <Box mt={4}>
        <SimpleRouter phase={ctx.phase}>
          <Box route="startup">
            {isActive && (
              <Button
                colorScheme="blue"
                type="button"
                onClick={() => moves.deal()}
              >
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
            route="reveal"
            playOrder={ctx.playOrder}
            playerID={playerID}
            matchKeyed={matchKeyed}
            disabled={activeStage !== "reveal2"}
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
              if (
                activeStage === "swapOnly" ||
                activeStage === "discardOrSwap"
              ) {
                moves.swap(pos);
              } else if (
                activeStage === "flipOver" ||
                activeStage === "endgameReveal"
              ) {
                moves.flip(pos);
              }
            }}
            boards={G.boards}
            activePlayers={activePlayers}
          />
          <Box route="endround">
            {isActive && (
              <Button
                colorScheme="blue"
                onClick={() => {
                  moves.reset();
                }}
              >
                End round
              </Button>
            )}
            <SpreadLayout
              disabled
              playOrder={ctx.playOrder}
              playerID={playerID}
              matchKeyed={matchKeyed}
              boards={G.boards}
              activePlayers={activePlayers}
            />
          </Box>
        </SimpleRouter>
      </Box>
    </Box>
  );
};
