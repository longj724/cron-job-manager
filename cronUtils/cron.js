// External Dependencies
const { exec } = require('child_process');
const fs = require('fs');

exports.createCronJob = (cronExpression, filePath) => {
  exec('crontab -l > currentCronTab.txt', () => {
    fs.appendFile(
      'currentCronTab.txt',
      `${cronExpression} ${filePath}\n`,
      (error) => {
        if (error) throw error;
        console.log('Saved!');
      }
    );
    exec('crontab currentCronTab.txt', (error) => {
      if (!error) {
        fs.writeFile('currentCronTab.txt', '', () => {});
        return true;
      }
    });
  });
  return true;
};

exports.deleteCronJob = async (cronExpression, filePath) => {
  console.log('cronExpression is', cronExpression);
  return new Promise((resolve, reject) => {
    exec(
      `crontab -l | grep -v "${filePath}" | crontab -`,
      (error, _, stderr) => {
        if (error) {
          console.log(`[ERROR] error deleting cron job`);
          console.log(error);
          reject(false);
        }

        if (stderr) {
          console.log(`[STDERROR] error deleting cron job`);
          console.log(stderr);
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
