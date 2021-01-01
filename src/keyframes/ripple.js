import { keyframes } from "@chakra-ui/react";

export const rippleBoxShadow = "0 0 0 3px rgb(49, 130, 206, 0.5)";

export const ripple = keyframes`
  0% {
    box-shadow: 0 0 0 2px rgb(49, 130, 206);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255,0,0, 0);
  }
  100% {
    box-shadow: 0 0 0 10px rgba(255,0,0, 0);
  }
`;
