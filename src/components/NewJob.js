// External Dependencies
import { useState } from 'react';
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  Input,
  Text,
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

// Relative Dependencies

function NewJob(props) {
  const { setJobs, setShowNewJobForm } = props;
  const [jobFilePath, setJobFilePath] = useState(null);

  const handleUploadFileClick = async () => {
    const filePath = await window.electronAPI.showFileDialog();
    setJobFilePath(filePath);
  };

  const handleCancelCreateCronJob = () => {
    setShowNewJobForm(false);
  };

  return (
    <Flex
      width="85%"
      padding={4}
      bgColor="#F5F5F5"
      alignSelf="center"
      mt="10px"
      mb="10px"
      borderRadius="10px"
    >
      <Formik
        initialValues={{
          jobTitle: '',
          cronExpression: '',
        }}
        onSubmit={async (values, actions) => {
          if (!jobFilePath) {
            actions.setSubmitting(false);
            alert('No file specified!');
            return;
          }

          const { jobTitle, cronExpression } = values;

          const newCronJob = await window.electronAPI.createCronJob(
            jobTitle,
            jobFilePath,
            cronExpression
          );

          if (newCronJob) {
            actions.setSubmitting(false);
            setShowNewJobForm(false);
            setJobs((prevJobs) => [...prevJobs, newCronJob]);
          } else {
            alert('Error creating cron job');
          }
        }}
        validationSchema={Yup.object({
          jobTitle: Yup.string().required('Required'),
          cronExpression: Yup.string().required('Required'),
        })}
      >
        {(props) => (
          <Form style={{ width: '100%' }}>
            <Grid gridTemplateColumns="1fr 1fr">
              <Flex direction="column">
                <Field name="jobTitle">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={form.errors.jobTitle && form.touched.jobTitle}
                      width="85%"
                    >
                      <FormLabel ml={2}>Job Name</FormLabel>
                      <Input
                        {...field}
                        bgColor="gray.100"
                        size="sm"
                        ml={2}
                        placeholder="Name this job"
                      />
                      <FormErrorMessage>
                        {form.errors.jobTitle}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="cronExpression">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={
                        form.errors.cronExpression &&
                        form.touched.cronExpression
                      }
                      width="85%"
                    >
                      <FormLabel ml={2} mt={2}>
                        {'Cron Expression - In Plain English'}
                      </FormLabel>
                      <Input
                        {...field}
                        bgColor="gray.100"
                        size="sm"
                        ml={2}
                        placeholder={'On weekdays at noon'}
                      />
                      <FormErrorMessage>
                        {form.errors.cronExpression}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Flex>
                  <Text ml={2} mt={2}>
                    Cron Job File:{' '}
                    {jobFilePath ? jobFilePath : 'No file selected'}
                  </Text>
                </Flex>
                <Button
                  width="50%"
                  colorScheme="blue"
                  mt={4}
                  ml={2}
                  size="sm"
                  onClick={handleUploadFileClick}
                >
                  Upload File
                </Button>
              </Flex>
              <Flex
                direction="column"
                alignItems="center"
                justifyContent="center"
              >
                <Button
                  colorScheme="teal"
                  isLoading={props.isSubmitting}
                  type="submit"
                  size="sm"
                  width="50%"
                >
                  Create Job
                </Button>
                <Button
                  mt={4}
                  colorScheme="red"
                  size="sm"
                  width="50%"
                  onClick={handleCancelCreateCronJob}
                >
                  Cancel
                </Button>
              </Flex>
            </Grid>
          </Form>
        )}
      </Formik>
    </Flex>
  );
}

export default NewJob;
