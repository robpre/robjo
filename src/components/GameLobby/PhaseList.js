import React, { useState } from "react";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Select,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

const makeRange = (min, max) => {
  const r = [];

  for (let i = min; i <= max; i++) {
    r.push(i);
  }

  return r;
};

const LobbyCreateMatchForm = ({ games, onCreateMatch }) => {
  const [selectedGame, setSelectedGame] = useState(0);
  const game = games[selectedGame].game;
  const [numPlayers, setNumPlayers] = useState(game.minPlayers);

  return (
    <Stack
      spacing={2}
      as="form"
      onSubmit={(e) => {
        e.preventDefault();
        onCreateMatch(game.name, parseInt(numPlayers));
      }}
    >
      <HStack spacing={2}>
        <FormControl id="lobby-select-game">
          <FormLabel>Select a game</FormLabel>
          <Select
            value={selectedGame}
            onChange={(e) => {
              const game = games[e.target.value].game;
              setSelectedGame(e.target.value);
              setNumPlayers(game.minPlayers);
            }}
          >
            {games.map(({ game }, i) => (
              <option key={game.name} value={i}>
                {game.name}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl id="lobby-select-players">
          <FormLabel>Players:</FormLabel>
          <Select
            value={numPlayers}
            onChange={(e) => setNumPlayers(e.target.value)}
          >
            {makeRange(game.minPlayers, game.maxPlayers).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </Select>
        </FormControl>
      </HStack>

      <Box>
        <Button p={4} pt={2} pb={2} colorScheme="pink" type="submit">
          Create a new game!
        </Button>
      </Box>
    </Stack>
  );
};

const MatchButton = ({
  match,
  playerName,
  onClickLeave,
  onClickJoin,
  onClickPlay,
}) => {
  const playerSeat = match.players.find((player) => player.name === playerName);
  const freeSeat = match.players.find((player) => !player.name);
  const leaveButton = (
    <Button
      type="button"
      onClick={() => onClickLeave(match.gameName, match.matchID)}
    >
      Leave
    </Button>
  );

  if (playerSeat && freeSeat) {
    // already seated: waiting for match to start
    return leaveButton;
  }
  if (freeSeat) {
    // at least 1 seat is available
    return (
      <Button
        type="button"
        onClick={() =>
          onClickJoin(match.gameName, match.matchID, "" + freeSeat.id)
        }
      >
        Join
      </Button>
    );
  }
  // match is full
  if (playerSeat) {
    return (
      <HStack spacing={4}>
        <Button
          type="button"
          onClick={() =>
            onClickPlay(match.gameName, {
              matchID: match.matchID,
              playerID: "" + playerSeat.id,
              numPlayers: match.players.length,
            })
          }
        >
          Play
        </Button>
        {leaveButton}
      </HStack>
    );
  }
  // allow spectating
  return (
    <Button
      type="button"
      onClick={() =>
        onClickPlay(match.gameName, {
          matchID: match.matchID,
          numPlayers: match.players.length,
        })
      }
    >
      Spectate
    </Button>
  );
};

export const PhaseList = ({
  playerName,
  errorMsg,
  gameComponents,
  onCreateMatch,
  matches,
  onClickLeave,
  onClickJoin,
  onClickPlay,
}) => (
  <Stack spacing={2} justifyContent="space-between" flex="1">
    <Stack spacing={2}>
      <Heading as="h2" size="l">
        Game list
      </Heading>
      <Box pr={2} pl={2}>
        <Text textAlign="left">Create a match:</Text>
        <LobbyCreateMatchForm
          games={gameComponents}
          onCreateMatch={(x, y) => onCreateMatch(x, y)}
        />
      </Box>
      <Divider mr={2} ml={2} spacing={2} />
      <Text pr={2} pl={2} textAlign="left">
        Join a match:
      </Text>
      <Table variant="striped" colorScheme="teal">
        <Thead>
          <Tr>
            <Th textAlign="center" p={2}>game name</Th>
            <Th textAlign="center" p={2}>status</Th>
            <Th textAlign="center" p={2}>players</Th>
            <Th textAlign="center" p={2}>join</Th>
          </Tr>
        </Thead>
        <Tbody>
          {matches.map((m) => (
            <Tr key={m.matchID}>
              <Td p={2}>{m.gameName}</Td>
              <Td p={2}>{m.players.find((p) => !p.name) ? "OPEN" : "RUNNING"}</Td>
              <Td p={2}>
                <Text>
                  {m.players.map((p) => p.name || "[free]").join(", ")}
                </Text>
              </Td>
              <Td p={2}>
                <MatchButton
                  match={m}
                  playerName={playerName}
                  onClickLeave={onClickLeave}
                  onClickJoin={onClickJoin}
                  onClickPlay={onClickPlay}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Stack>
    <Stack spacing={1}>
      {errorMsg && (
        <Alert status="error">
          <AlertIcon />
          {errorMsg}
        </Alert>
      )}

      <Alert status="warning">
        <AlertIcon />
        Matches that become empty are automatically deleted.
      </Alert>
    </Stack>
  </Stack>
);
