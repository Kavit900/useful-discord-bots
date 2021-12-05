const fs = require('fs');
var axios = require('axios');

const createDailyLeetcodeQuestionEmbed = (question) => {

  const embed = {
    color: 0x0099ff,
  	title: question.question.title,
    url: 'https://leetcode.com/problems/' + question.question.titleSlug,
    description: 'Daily Leetcode Question',
  	image: {
  		url: 'https://cdn.iconscout.com/icon/free/png-128/leetcode-3628885-3030025.png',
  	},
    timestamp: new Date(),
  };

  return embed;
}

const leetcodeDailyQuestion = async() => {

  const date = new Date();
  console.log("Entered here");
  var data = JSON.stringify({
  query: `query dailyCodingQuestionRecords($year: Int!, $month: Int!) {
    dailyCodingChallengeV2(year: $year, month: $month) {
      challenges {
        date
        userStatus
        link
        question {
          questionFrontendId
          title
          titleSlug
        }
      }
      weeklyChallenges {
        date
        userStatus
        link
        question {
          questionFrontendId
          title
          titleSlug
        }
      }
    }
  }`,
    variables: {"year":date.getFullYear(),"month":date.getMonth()+1}
  });

  var config = {
    method: 'get',
    url: 'https://leetcode.com/graphql/',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': 'csrftoken=5FRc2xY8d160BrkQixbWxibBO7ubmlIClcTdLdyE9y2oeOCTtPxuQYCUPCazPCsV'
    },
    data : data
  };

  let response = axios(config)
  .then(function (response) {
    console.log("Response is:- ");
    console.log(JSON.stringify(response.data));
    return JSON.parse(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });

  return response;
}

const leetcodeDailyQuestionUpdate = async(client) => {

  try {
    if (fs.existsSync('./data/leetcode-daily-question-guild-info.json')) {
      //file exists
    } else {
      return;
    }
  } catch(err) {
    console.log(err)
    return;
  }


  // Read questions from leetcode json file
  let guildsInfo = fs.readFileSync('./data/leetcode-daily-question-guild-info.json');

  let guilds = JSON.parse(guildsInfo);

  let dailyQuestions = await leetcodeDailyQuestion();

  let challenges = dailyQuestions.data.dailyCodingChallengeV2.challenges;

  let todaysQuestion = challenges[challenges.length - 1];

  try {
    for(let i=0; i<guilds.length; i++) {

      // Now send the daily question to each set channel of the quilds in which bot is running
      let guildId = guilds[i].guildId;
      let channelId = guilds[i].channelId;

      const g = await client.guilds.fetch(guildId);

      const channel = g.channels.cache.get(channelId);

      // Send the embed regarding the message
      channel.send({ embeds : [createDailyLeetcodeQuestionEmbed(todaysQuestion)] }).then(embedMessage => {
          // Bot can react to the message using any emoji
      });

      console.log(guilds[i]);
    }
  }
  catch (err) {
    console.log('There has been an error parsing your JSON.')
    console.log(err);
  }
}

module.exports = {
  leetcodeDailyQuestionUpdate
};
