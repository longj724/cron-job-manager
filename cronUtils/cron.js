// External Dependencies
const { PrismaClient } = require('@prisma/client');
const { exec } = require('child_process');

const prisma = new PrismaClient();

exports.createCronJob = async (cronExpression, filePath) => {
  return new Promise(async (resolve, reject) => {
    const allCronJobs = await prisma.jobs.findMany();

    if (allCronJobs.length !== 0) {
      exec(
        `(crontab -l ; echo "${cronExpression} ${filePath}") | crontab -`,
        async (error) => {
          if (error) reject(false);
          resolve(true);
        }
      );
    } else {
      exec(`echo "${cronExpression} ${filePath}" | crontab -`, (error) => {
        if (error) reject(false);
        resolve(true);
      });
    }
  });
};

exports.deleteCronJob = async (filePath) => {
  return new Promise((resolve, reject) => {
    exec(
      `crontab -l | grep -v "${filePath}" | crontab -`,
      (error, _, stderr) => {
        if (error) {
          console.log('[ERROR] error deleting cron job', error);
          reject(false);
        }

        if (stderr) {
          console.log('[STDERROR] error deleting cron job', stderr);
          reject(false);
        }

        resolve(true);
      }
    );
  });
};

exports.updateCronJob = async (
  currentCronJob,
  newCronExpression,
  newFilePath
) => {
  await this.deleteCronJob(currentCronJob.file_path);

  const cronJobCreated = await this.createCronJob(
    newCronExpression,
    newFilePath
  );

  return cronJobCreated;
};
