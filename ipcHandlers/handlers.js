// External Dependencies
const { dialog } = require('electron');
const { PrismaClient } = require('@prisma/client');

// Relative Dependencies
const {
  generateCronExpression,
} = require('../cronUtils/generateCronExpression');
const {
  createCronJob,
  deleteCronJob,
  updateCronJob,
} = require('../cronUtils/cron.js');

const prisma = new PrismaClient();

exports.handleShowFileDialog = async (event) => {
  const { canceled, filePaths } = await dialog.showOpenDialog();
  if (canceled) {
    return;
  } else {
    return filePaths[0];
  }
};

exports.handleGetJobs = async () => {
  const jobs = await prisma.jobs.findMany();
  return jobs;
};

exports.handleCreateCronJob = async (_, title, filePath, textExpression) => {
  console.log('title is', title);
  console.log('filePath is', filePath);
  console.log('textExpression is', textExpression);
  console.log('at start of function');

  // const cronExpression = await generateCronExpression(textExpression);
  // console.log('cron Expression is', cronExpression);
  const cronExpression = '3 * * * *';

  const createJobSuccessful = createCronJob(cronExpression, filePath);
  console.log('createJobSuccessful is', createJobSuccessful);

  if (createJobSuccessful) {
    const cronJob = await prisma.jobs.create({
      data: {
        name: title,
        file_path: filePath,
        cron_expression: cronExpression,
        text_cron_expression: textExpression,
      },
    });
    return cronJob;
  }

  return { error: 'Error creating cron job' };
};

exports.handleDeleteJob = async (_, id, cronExpression, filePath) => {
  console.log('inputs are', {
    id,
    cronExpression,
    filePath,
  });
  const deleteSuccessful = await deleteCronJob(cronExpression, filePath);

  console.log('deleteSuccessful is', deleteSuccessful);

  if (deleteSuccessful) {
    const deletedCronJob = await prisma.jobs.delete({
      where: {
        id: id,
      },
    });

    return deletedCronJob;
  }

  return { error: 'Error deleting cron job' };
};

exports.handleUpdateJob = async (_, id, name, filePath, textExpression) => {
  // Get current cron job info
  const currentCronJob = await prisma.jobs.findUnique({
    where: {
      id: id,
    },
  });

  let newCronExpression = currentCronJob.cron_expression;

  if (textExpression !== currentCronJob.text_cron_expression) {
    // newCronExpression = await generateCronExpression(textExpression);
  }

  const updateCronJobSuccessful = updateCronJob(
    currentCronJob,
    newCronExpression,
    filePath
  );

  if (updateCronJobSuccessful) {
    const updatedJob = await prisma.jobs.update({
      where: {
        id: id,
      },
      data: {
        cron_expression: newCronExpression,
        file_path: filePath,
        name: name,
        text_cron_expression: textExpression,
      },
    });

    return updatedJob;
  }

  return { error: 'Error updating cron job' };
};
