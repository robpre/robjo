import { keyframes } from "@chakra-ui/react";

export const ripple = keyframes`
  0% {
    box-shadow: 0 0 0 2px rgba(229, 62, 62, 1);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255,0,0, 0);
  }
  100% {
    box-shadow: 0 0 0 10px rgba(255,0,0, 0);
  }
`;
export const inwardRipple = keyframes`
  0% {
    box-shadow: inset 0 0 0 2px rgba(229, 62, 62, 1);
  }
  70% {
    box-shadow: inset 0 0 0 10px rgba(255,0,0, 0);
  }
  100% {
    box-shadow: inset 0 0 0 10px rgba(255,0,0, 0);
  }
`;
