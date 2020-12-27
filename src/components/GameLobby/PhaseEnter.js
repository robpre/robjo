import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Heading, Input, Text } from '@chakra-ui/react';

export const PhaseEnter = ({ playerName, onEnter }) => {
  const [name, setName] = useState(playerName);

  return (
    <Box as="form" flex="1" onSubmit={(e) => {
      e.preventDefault();
      onEnter(name);
    }}>
      <Heading as="h2" size="l">
        Enter a name
      </Heading>

      <Text>Choose a name to join games with</Text>

      <FormControl id="set-player-name" isRequired>
        <FormLabel>Choose a player name:</FormLabel>
        <Input onChange={e => setName(e.target.value)} value={name} placeholder="Name" />
      </FormControl>

      <Button colorScheme="pink" type="submit">
        Submit
      </Button>
    </Box>
  );
};
