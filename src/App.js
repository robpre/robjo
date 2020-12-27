import React from 'react';
import {
  ChakraProvider,
  Box,
  Grid,
  theme,
} from '@chakra-ui/react';

import { GameLobby } from "./components/GameLobby/GameLobby";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box h="100%" textAlign="center" fontSize="xl">
        <GameLobby />
      </Box>
    </ChakraProvider>
  );
}

export default App;
