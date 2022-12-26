// External Dependencies
import { useState } from 'react';
import {
  Button,
  Flex,
  FormLabel,
  FormControl,
  FormErrorMessage,
  Grid,
  Input,
  Text,
} from '@chakra-ui/react';
import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';

// Relative Dependencies

function EditJob(props) {
  const {
    cronExpression,
    id,
    jobFilePath: initialFilePath,
    jobName: initialJobName,
    setIsEditing,
    setJobs,
    textCronExpression: initialTextCronExpression,
  } = props;
  const [jobFilePath, setJobFilePath] = useState(initialFilePath);

  const handleDeleteJob = async () => {
    const successfulDelete = await window.electronAPI.deleteJob(
      id,
      cronExpression,
      initialFilePath
    );

    if (!successfulDelete.error) {
      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== id));
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleUploadFileClick = async () => {
    const filePath = await window.electronAPI.showFileDialog();
    setJobFilePath(filePath);
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
          jobName: initialJobName,
          cronExpression: initialTextCronExpression,
        }}
        onSubmit={async (values, actions) => {
          const { jobName, cronExpression } = values;

          const updatedCronJob = await window.electronAPI.updateJob(
            id,
            jobName,
            jobFilePath,
            cronExpression
          );

          if (!updatedCronJob.error) {
            setJobs((prevJobs) => {
              return prevJobs.map((job) => {
                if (job.id === id) {
                  return updatedCronJob;
                }
                return job;
              });
            });
            setIsEditing(false);
          } else {
            alert('Error updating cron job.');
          }
        }}
        validationSchema={Yup.object({
          jobName: Yup.string().required('Required'),
          cronExpression: Yup.string().required('Required'),
        })}
      >
        {(props) => (
          <Form style={{ width: '100%' }}>
            <Grid gridTemplateColumns="1fr 1fr">
              <Flex direction="column">
                <Field name="jobName">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={form.errors.jobName && form.touched.jobName}
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
                      <FormErrorMessage>{form.errors.jobName}</FormErrorMessage>
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
                  Update Job
                </Button>
                <Button
                  colorScheme="teal"
                  isLoading={props.isSubmitting}
                  type="submit"
                  size="sm"
                  width="50%"
                  mt={4}
                  onClick={handleDeleteJob}
                >
                  Delete Job
                </Button>
                <Button
                  mt={4}
                  colorScheme="red"
                  size="sm"
                  width="50%"
                  onClick={handleCancelEdit}
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

export default EditJob;
