import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

export const ScoreModal = ({ onOpen, onClose, isOpen, scores, matchData }) => (
  <>
    <Button colorScheme="blue" onClick={onOpen}>
      Show scores
    </Button>
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay onClick={onClose} />
      <ModalContent position="absolute" p={2}>
        <ModalHeader>Scores</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Table variant="striped" colorScheme="gray">
            <Thead>
              <Tr>
                <Th>
                  <Text textAlign="center">Game</Text>
                </Th>
                {matchData.map(({ id, name }) => (
                  <Th key={`${id}${name}`}>
                    <Text textAlign="center">{name}</Text>
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {(scores.length ? scores : [{}]).map((score, game, allGames) => (
                <Tr key={`${game}${JSON.stringify(score)}`}>
                  <Td>
                    <Text textAlign="center">{game + 1}</Text>
                  </Td>
                  {matchData.map(({ id }) => (
                    <Td key={`${id}${score[id]}`}>
                      <Text
                        textAlign="center"
                        as={allGames.length !== game + 1 ? "s" : undefined}
                        d="block"
                      >
                        {score[id] || "0"}
                      </Text>
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </ModalBody>
      </ModalContent>
    </Modal>
  </>
);
