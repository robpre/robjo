import { useEffect, useRef, useState } from "react";
import { Box, Button, IconButton } from "@chakra-ui/react";
import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import throttle from "lodash.throttle";
import { Spread } from "./Spread";

export const SpreadLayout = ({
  matchKeyed,
  boards,
  onCardClick,
  playerID,
  activePlayers,
  disabled,
  playOrder,
}) => {
  const ref = useRef();
  const [goToFirstDisabled, setGoToFirstDisabled] = useState(true);
  const [goRightDisabled, setGoRightDisabled] = useState(true);
  const playerIndex = playOrder.indexOf(playerID);
  const renderOrder = [
    ...playOrder.slice(playerIndex),
    ...playOrder.slice(0, playerIndex),
  ];
  const boardRefs = [];
  const makeAssignRef = (i) => (el) => (boardRefs[i] = el);

  const updateButtons = () => {
    if (ref.current) {
      if (ref.current.scrollLeft === 0) {
        setGoToFirstDisabled(true);
      } else {
        setGoToFirstDisabled(false);
      }
      if (
        ref.current.scrollWidth - ref.current.clientWidth ===
        ref.current.scrollLeft
      ) {
        setGoRightDisabled(true);
      } else {
        setGoRightDisabled(false);
      }
    }
  };

  useEffect(() => {
    const handler = throttle(updateButtons, 0, { trailing: true });
    window.addEventListener("resize", handler);

    return () => window.removeEventListener("resize", handler);
  }, []);

  const move = (dir) => () => {
    if (!ref.current || !boardRefs[0]) {
      return;
    }

    const boardWidth = boardRefs[0].offsetWidth;

    /* eslint-disable-next-line array-callback-return */
    boardRefs.some((bRef, i) => {
      if (bRef.offsetLeft <= ref.current.scrollLeft) {
        if (bRef.offsetLeft + boardWidth >= ref.current.scrollLeft) {
          let mod = dir;
          // usually we need to go to the i'th element when going ltr
          // but if we're exactly on the thing then forceable go back one
          if (bRef.offsetLeft === ref.current.scrollLeft && dir === 0) {
            mod = -1;
          }

          if (boardRefs[i + mod]) {
            if (boardRefs[i + mod].offsetLeft === 0) {
              setGoToFirstDisabled(true);
            }

            ref.current.scrollTo(boardRefs[i + mod].offsetLeft, 0);
            return true;
          }
        }
      }
    });
  };

  return (
    <Box position="relative">
      {!(goToFirstDisabled && goRightDisabled) && (
        <Box d="flex" justifyContent="space-between">
          {renderOrder.length > 2 && (
            <IconButton
              aria-label="go left one game board"
              disabled={goToFirstDisabled}
              icon={<ChevronLeftIcon />}
              onClick={move(0)}
              size="md"
            />
          )}
          <Button
            leftIcon={<ArrowLeftIcon />}
            aria-label="go to the first board"
            onClick={() => {
              ref.current?.scrollTo(0, 0);
              setGoToFirstDisabled(true);
            }}
            disabled={goToFirstDisabled}
          >
            Your board
          </Button>
          <IconButton
            onClick={move(1)}
            icon={<ChevronRightIcon />}
            aria-label="go right one game board"
            disabled={goRightDisabled}
          />
        </Box>
      )}
      <Box
        ref={(el) => {
          ref.current = el;
          updateButtons();
        }}
        d="flex"
        overflow="auto"
        flexWrap="nowrap"
        style={{
          scrollBehavior: "smooth",
        }}
        onScroll={throttle(updateButtons, 0, { trailing: true })}
      >
        {renderOrder.map((id, i) => (
          <Spread
            key={id}
            ref={makeAssignRef(i)}
            isActive={activePlayers.includes(id)}
            name={matchKeyed[id]?.name}
            cards={boards[id]}
            onCardClick={id === playerID ? onCardClick : undefined}
            disabled={id === playerID ? disabled : true}
          />
        ))}
      </Box>
    </Box>
  );
};
