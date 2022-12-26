// External Dependencies
import { useEffect, useState } from 'react';
import { Button, Flex, Heading } from '@chakra-ui/react';

// Absolute Dependencies

// Relative Dependencies
import Job from './components/Job';
import NewJob from './components/NewJob';
import NoJobs from './components/NoJobs';

function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [showNewJobForm, setShowNewJobForm] = useState(false);

  useEffect(() => {
    getJobs();
  }, []);

  const getJobs = async () => {
    await window.electronAPI.getJobs().then((jobs) => {
      setJobs(jobs);
    });
  };

  const handleNewJobOnClick = () => {
    setShowNewJobForm(true);
  };

  return (
    <Flex direction="column" padding={4}>
      <Heading ml={4}>Cron Job Manager</Heading>
      <Heading size="md" ml={4} mt={2}>
        Create Cron Jobs Using Plain English
      </Heading>
      <Heading size="md" ml="20px" mt="20px">
        Jobs
      </Heading>
      {jobs.length !== 0 &&
        jobs.map((job) => <Job key={job.id} job={job} setJobs={setJobs} />)}
      {!jobs.length && <NoJobs />}
      {showNewJobForm && (
        <NewJob setShowNewJobForm={setShowNewJobForm} setJobs={setJobs} />
      )}
      <Button
        width="50%"
        alignSelf="center"
        onClick={handleNewJobOnClick}
        disabled={showNewJobForm}
        mt={2}
        colorScheme="blue"
      >
        New Job
      </Button>
    </Flex>
  );
}

export default JobsPage;
