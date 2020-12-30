import React from "react";
import { ChakraProvider, Box, extendTheme } from "@chakra-ui/react";
import { Router } from "@reach/router";
import { Global } from "@emotion/react";

import { GameLobby } from "./components/GameLobby";
import { SkyJoClient } from "./components/SkyJoClient";
import { config } from "./config";

const theme = extendTheme({
  config: {
    useSystemColorMode: false,
    initialColorMode: "dark",
  },
});

const DevGame = () => (
  <>
    <Box m={4} p={4} border="1px solid" borderColor="maroon">
      <SkyJoClient
        localMode
        gameID="devgame"
        playerID="0"
        matchData={[
          { id: 0, name: "Rob" },
          { id: 1, name: "Alicia" },
        ]}
      />
    </Box>
    <Box m={4} p={4} border="1px solid" borderColor="maroon">
      <SkyJoClient
        localMode
        gameID="devgame"
        playerID="1"
        matchData={[
          { id: 0, name: "Rob" },
          { id: 1, name: "Alicia" },
        ]}
      />
    </Box>
  </>
);

function App() {
  return (
    <ChakraProvider theme={theme}>
      {config.debugClient && (
        <Global styles={{ body: { marginRight: 305 } }} />
      )}
      <Box h="100%" textAlign="center" fontSize="xl">
        <Router>
          <GameLobby path="/*" />
          <DevGame path="/dev" />
        </Router>
      </Box>
    </ChakraProvider>
  );
}

export default App;
