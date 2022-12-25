// External Dependencies
import { Flex, Heading } from '@chakra-ui/react';

function NoJobs() {
  return (
    <Flex
      width="85%"
      height="50px"
      alignSelf="center"
      mt="10px"
      mb="10px"
      borderRadius="10px"
    >
      <Heading size="sm" mt={4} ml={4}>
        No Jobs Created
      </Heading>
    </Flex>
  );
}

export default NoJobs;
