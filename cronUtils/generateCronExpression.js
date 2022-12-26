// External Dependencies
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const configuration = new Configuration({
  organization: process.env.OPENAI_ORGANIZATION,
  apiKey: process.env.OPENAI_APIKEY,
});
const openai = new OpenAIApi(configuration);

exports.generateCronExpression = async (textExpression) => {
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `Generate the cron job expression for the following statement: "${textExpression}"`,
  });

  const choices = response.data.choices;
  const text = choices[0].text.replace(/(\r\n|\n|\r)/gm, '');
  return text;
};
