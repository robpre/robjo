import React from "react";
import { Lobby } from "boardgame.io/react";
import { CloseIcon } from "@chakra-ui/icons";
import { Button, HStack, Stack } from "@chakra-ui/react";
import { SkyJo } from "../game/skyjo";
import { SkyJoGameBoard } from "./SkyJoGameBoard";
import { SimpleRouter } from "./SimpleRouter";
import { PhaseEnter } from "./GameLobby/PhaseEnter";
import { PhaseList } from "./GameLobby/PhaseList";

const LobbyPhases = {
  ENTER: "enter",
  PLAY: "play",
  LIST: "list",
};

const Container = ({ children }) => <>{children}</>;

export const GameLobby = () => (
  <Lobby
    gameServer={`${window.location.protocol}//${window.location.hostname}:${window.location.port}/`}
    lobbyServer={`${window.location.protocol}//${window.location.hostname}:${window.location.port}/`}
    gameComponents={[{ game: SkyJo, board: SkyJoGameBoard }]}
    debug={process.env.NODE_ENV === "development"}
    renderer={({
      errorMsg,
      gameComponents,
      matches,
      phase,
      playerName,
      runningMatch,
      handleEnterLobby,
      handleExitLobby,
      handleCreateMatch,
      handleJoinMatch,
      handleLeaveMatch,
      handleExitMatch,
      // handleRefreshMatches,
      handleStartMatch,
    }) => (
      <>
        <Stack h="100%" flex="1">
          <HStack spacing={2} w="100%" justifyContent="flex-end" p={1}>
            {phase === LobbyPhases.PLAY && (
              <Button
                onClick={handleExitMatch}
                type="button"
                rightIcon={<CloseIcon />}
                colorScheme="darkPurple"
                _active={{ color: "gray.100" }}
                _hover={{ color: "gray.100" }}
              >
                Exit game
              </Button>
            )}
            {phase !== LobbyPhases.ENTER && phase !== LobbyPhases.PLAY && (
              <Button
                onClick={handleExitLobby}
                type="button"
                rightIcon={<CloseIcon />}
                colorScheme="darkPurple"
                _active={{ color: "gray.100" }}
                _hover={{ color: "gray.100" }}
              >
                Exit lobby
              </Button>
            )}
            {/* <ColourModeSwitcher justifySelf="flex-end" /> */}
          </HStack>
          <Stack flex="1" flexGrow="1">
            <SimpleRouter phase={phase}>
              <PhaseEnter
                route={LobbyPhases.ENTER}
                playerName={playerName}
                onEnter={handleEnterLobby}
              />
              <PhaseList
                route={LobbyPhases.LIST}
                matches={matches}
                errorMsg={errorMsg}
                gameComponents={gameComponents}
                playerName={playerName}
                onCreateMatch={handleCreateMatch}
                onClickLeave={handleLeaveMatch}
                onClickJoin={handleJoinMatch}
                onClickPlay={handleStartMatch}
              />
              <Container route={LobbyPhases.PLAY}>
                {runningMatch && (
                  <runningMatch.app
                    matchID={runningMatch.matchID}
                    playerID={runningMatch.playerID}
                    credentials={runningMatch.credentials}
                  />
                )}
              </Container>
            </SimpleRouter>
          </Stack>
        </Stack>
      </>
    )}
  />
);
