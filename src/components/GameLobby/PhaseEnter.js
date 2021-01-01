import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";

export const PhaseEnter = ({ playerName, onEnter }) => {
  const [name, setName] = useState(playerName);

  return (
    <Stack
      spacing={2}
      as="form"
      p={2}
      onSubmit={(e) => {
        e.preventDefault();
        onEnter(name);
      }}
    >
      <Heading as="h2" size="l">
        Enter a name
      </Heading>

      <Text>Choose a name to join games with</Text>

      <HStack spacing={2} alignItems="flex-end">
        <FormControl id="set-player-name" isRequired>
          <FormLabel>Choose a player name:</FormLabel>
          <Input
            onChange={(e) => setName(e.target.value)}
            value={name}
            placeholder="Name"
          />
        </FormControl>

        <Button colorScheme="darkPurple" type="submit">
          Submit
        </Button>
      </HStack>
    </Stack>
  );
};
