import React from "react";
import { ChakraProvider, Box, extendTheme, chakra } from "@chakra-ui/react";
import { Router } from "@reach/router";
import { Global } from "@emotion/react";

import { GameLobby } from "./components/GameLobby";
import { SkyJoClient } from "./components/SkyJoClient";
import { config } from "./config";

const ChakraRouter = chakra(Router);

const theme = extendTheme({
  config: {
    useSystemColorMode: false,
    initialColorMode: "dark",
  },
  colors: {
    darkPurple: {
      50: "#D6E9ED",
      100: "#AEC7D9",
      200: "#8799C5",
      300: "#6162B0",
      400: "#553C9A",
      500: "#5A368E",
      600: "#5D3082",
      700: "#5F2B76",
      800: "#5C205D",
      900: "#501B4A",
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: "blue",
      },
    },
  },
});

const DevGame = () => (
  <Box minH="100%">
    <Box border="1px solid maroon">
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
    <Box border="1px solid maroon">
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
  </Box>
);

function App() {
  return (
    <ChakraProvider theme={theme}>
      {config.debugClient ? (
        <Global styles={{ body: { marginRight: 305 } }} />
      ) : (
        <Global
          styles={{
            "body section.debug-panel.debug-panel": { display: "none" },
          }}
        />
      )}
      <Box textAlign="center" fontSize="xl" d="flex" flexDir="column" h="100%">
        <ChakraRouter d="flex" flexDir="column" h="100%">
          <GameLobby path="/*" />
          <DevGame path="/dev" />
        </ChakraRouter>
      </Box>
    </ChakraProvider>
  );
}

export default App;
