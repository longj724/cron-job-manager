// External Dependencies
const { PrismaClient } = require('@prisma/client');
const { exec } = require('child_process');
const fs = require('fs');

const prisma = new PrismaClient();

exports.createCronJob = async (cronExpression, filePath) => {
  return new Promise(async (resolve, reject) => {
    const allCronJobs = await prisma.jobs.findMany();

    if (allCronJobs.length !== 0) {
      exec('crontab -l > currentCronTab.txt', async (error) => {
        if (error) reject(false);
        const addCronJobSuccessful = await appendCronJobToCrontab(
          cronExpression,
          filePath
        );
        if (addCronJobSuccessful) {
          resolve(true);
        } else {
          reject(false);
        }
      });
    } else {
      const addCronJobSuccessful = await appendCronJobToCrontab(
        cronExpression,
        filePath
      );
      if (addCronJobSuccessful) {
        resolve(true);
      } else {
        reject(false);
      }
    }
  });
};

const appendCronJobToCrontab = async (cronExpression, filePath) => {
  fs.appendFile(
    'currentCronTab.txt',
    `${cronExpression} ${filePath}\n`,
    () => {}
  );

  return new Promise((resolve, reject) => {
    exec('crontab currentCronTab.txt', (error) => {
      if (error) {
        reject(false);
      } else {
        fs.writeFile('currentCronTab.txt', '', () => {});
        resolve(true);
      }
    });
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
