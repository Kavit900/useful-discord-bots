const fs = require('fs');
var axios = require('axios');

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

      channel.send(todaysQuestion.link);

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
