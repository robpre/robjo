import React from 'react';

export const GameBoard = ({ G }) => (
  <div>
    {JSON.stringify(G.boards, null, '  ')}
  </div>
);
