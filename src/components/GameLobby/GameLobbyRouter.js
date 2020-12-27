import React from 'react';

export const LobbyPhases = {
  ENTER: 'enter',
  PLAY: 'play',
  LIST: 'list',
};

export const GameLobbyRoute = ({ children }) => children;

GameLobbyRoute.displayName = "GameLobbyRoute";

export const GameLobbyRouter = ({ phase, children }) => {
  const child = React.Children.toArray(children).filter(c => {
    if (c.type && c.type.displayName === 'GameLobbyRoute') {
      return c.props.route === phase;
    }

    return false;
  })

  return child;
};
