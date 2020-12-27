import React from 'react';

export const SkyJoGameBoard = ({ G }) => (
  <div>
    {JSON.stringify(G.boards, null, '  ')}
  </div>
);
