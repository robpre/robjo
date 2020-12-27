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
  Text,
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
        onCreateMatch(game.name, numPlayers);
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

export const PhaseList = ({
  playerName,
  errorMsg,
  gameComponents,
  onCreateMatch,
  matches,
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
      <Divider pr={2} pl={2} spacing={2} />
      <Text pr={2} pl={2} textAlign="left">Join a match:</Text>
      {matches.map((match) => (
        <Box>hi</Box>
      ))}
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
