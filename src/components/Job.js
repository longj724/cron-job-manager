// External Dependency
import { useState } from 'react';
import { Button, Flex, Heading } from '@chakra-ui/react';
import moment from 'moment';

// Relative Dependencies
import EditJob from './EditJob';

function Job(props) {
  const { job, setJobs } = props;
  const [isEditing, setIsEditing] = useState(false);

  const {
    created_at: createdAt,
    cron_expression: cronExpression,
    file_path: filePath,
    id,
    name,
    text_cron_expression: textCronExpression,
  } = job;

  const momentDate = moment(createdAt).toDate('DD-MM-YYYY');

  return isEditing ? (
    <EditJob
      id={id}
      cronExpression={cronExpression}
      jobFilePath={filePath}
      jobName={name}
      setIsEditing={setIsEditing}
      setJobs={setJobs}
      textCronExpression={textCronExpression}
    />
  ) : (
    <Flex
      alignSelf="center"
      bgColor="#F5F5F5"
      borderRadius="10px"
      mb="10px"
      mt="10px"
      padding={4}
      width="85%"
    >
      <Flex width="50%" height="100%" direction="column">
        <Heading size="sm" ml="10px">
          Name: {name}
        </Heading>
        <Heading size="sm" ml="10px" mt="10px">
          File Path: {filePath}
        </Heading>
        <Heading size="sm" ml="10px" mt="10px">
          Runtime Interval: {textCronExpression}
        </Heading>
      </Flex>
      <Flex width="50%" height="100%" direction="column">
        <Heading size="sm" ml="10px">
          Created At: {momentDate.toLocaleString()}
        </Heading>
        <Heading size="sm" ml="10px" mt="10px">
          Cron Expression: {cronExpression}
        </Heading>
        <Button
          alignSelf="center"
          colorScheme="teal"
          mt={4}
          onClick={() => setIsEditing(true)}
          size="sm"
          width="40%"
        >
          Edit
        </Button>
      </Flex>
    </Flex>
  );
}

export default Job;
