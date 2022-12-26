// External Dependencies
const { exec } = require('child_process');
const fs = require('fs');

exports.createCronJob = async (cronExpression, filePath) => {
  return new Promise((resolve, reject) => {
    exec('crontab -l > currentCronTab.txt', (error) => {
      if (error) {
        reject(false);
      }

      fs.appendFile(
        'currentCronTab.txt',
        `${cronExpression} ${filePath}\n`,
        () => {}
      );

      exec('crontab currentCronTab.txt', (error) => {
        if (error) {
          reject(false);
        } else {
          fs.writeFile('currentCronTab.txt', '', () => {});
          resolve(true);
        }
      });
    });
  });
};

exports.deleteCronJob = async (cronExpression, filePath) => {
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

        console.log('cron job successfully deleted');
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
  await this.deleteCronJob(
    currentCronJob.cron_expression,
    currentCronJob.file_path
  );

  return this.createCronJob(newCronExpression, newFilePath);
};
