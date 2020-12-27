import { Lobby } from "boardgame.io/react";
import { CloseIcon } from '@chakra-ui/icons';
import { Button, HStack, Stack } from "@chakra-ui/react";
import { SkyJo } from "../game/skyjo";
import { ColourModeSwitcher } from "../ColourModeSwitcher";
import { SkyJoGameBoard } from "./SkyJoGameBoard";
import {
  LobbyPhases,
  GameLobbyRouter,
  GameLobbyRoute,
} from "./GameLobby/GameLobbyRouter";
import { PhaseEnter } from "./GameLobby/PhaseEnter";
import { PhaseList } from "./GameLobby/PhaseList";

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
      handleRefreshMatches,
      handleStartMatch,
    }) => (
      <Stack minHeight="100%" flex="1">
        <HStack spacing={2} w="100%" justifyContent="flex-end" p={1}>
          {phase !== LobbyPhases.ENTER && (
            <Button onClick={handleExitLobby} type="button" rightIcon={<CloseIcon />}>Exit lobby</Button>
          )}
          <ColourModeSwitcher justifySelf="flex-end" />
        </HStack>
        <Stack flex="1" flexGrow="1">
          <GameLobbyRouter phase={phase}>
            <GameLobbyRoute route={LobbyPhases.ENTER}>
              <PhaseEnter playerName={playerName} onEnter={handleEnterLobby} />
            </GameLobbyRoute>
            <GameLobbyRoute route={LobbyPhases.LIST}>
              <PhaseList
                matches={matches}
                errorMsg={errorMsg}
                gameComponents={gameComponents}
                playerName={playerName}
                onCreateMatch={handleCreateMatch}
                onClickLeave={handleLeaveMatch}
                onClickJoin={handleJoinMatch}
                onClickPlay={handleStartMatch}
              />
            </GameLobbyRoute>
            <GameLobbyRoute route={LobbyPhases.PLAY}>
            </GameLobbyRoute>
          </GameLobbyRouter>
        </Stack>
      </Stack>
    )}
  />
);
