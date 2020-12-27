import { Client } from 'boardgame.io/react';
import { SocketIO } from 'boardgame.io/multiplayer';
import {SkyJo } from '../game/skyjo';
import { SkyJoGameBoard } from './SkyJoGameBoard';

export const SkyJoClient = new Client({
  game: SkyJo,
  board: SkyJoGameBoard,
  debug: process.env.NODE_ENV === "development",
  multiplayer: SocketIO({
    server: `${window.location.protocol}//${window.location.hostname}:${window.location.port}/`
  }),
});
