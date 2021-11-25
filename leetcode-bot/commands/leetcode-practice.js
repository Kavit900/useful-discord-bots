const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

const createLeetcodeQuestionEmbed = (question) => {

  let fields = [];


  for (let i = 0; i < question.topicTags.length; i++) {
    let tag = question.topicTags[i];
    let field = {name: "Tag", value: tag.name, inline: true}
    fields.push(field);
  }

  const embed = {
  	color: 0x0099ff,
  	title: question.title,
  	url: 'https://leetcode.com/problems/' + question.titleSlug,
  	description: 'Some description here',
  	thumbnail: {
  		url: 'https://imgur.com/1yvjbXq',
  	},
  	fields: fields,
  	image: {
  		url: 'https://imgur.com/1yvjbXq',
  	},
  	timestamp: new Date(),
  	footer: {
  		text: 'Leetcode ' + question.difficultyLevel + ' question',
  		icon_url: 'https://imgur.com/1yvjbXq',
  	},
  };

  console.log(embed);


  const exampleEmbed = {
    color: 0x0099ff,
  	title: question.title,
    url: 'https://leetcode.com/problems/' + question.titleSlug,
    description: 'Solve this ' + question.difficulty + ' level problem',
  	image: {
  		url: 'https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png',
  	},
    fields: fields,
    timestamp: new Date(),
    footer: {
      text: 'Leetcode ' + question.difficulty + ' question',
      icon_url: 'https://imgur.com/1yvjbXq',
    },
  };

  return exampleEmbed;
  return embed;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leetcode-practice')
		.setDescription('Provide a difficulty level and leetcode will return a question back')
    .addStringOption(option =>
		option.setName('input')
			.setDescription('Enter a string options in lowercase:- easy, medium, hard')
			.setRequired(true)),
	async execute(interaction) {

    // Read questions from leetcode json file
    let questions = fs.readFileSync('./data/leetcode.json');

    try {
      questions = JSON.parse(questions);
      console.log(questions);
    }
    catch (err) {
      console.log('There has been an error parsing your JSON.')
      console.log(err);
    }

    let difficultyLevel = interaction.options.getString('input');

    let difficultyQuestionArray = ["easy", "medium", "hard"]

    // If user sends a wrong difficulty then randomly select one of the difficulty and send the question
    if(!difficultyQuestionArray.includes(difficultyLevel)) {
      let size  = difficultyQuestionArray.length;
      let randomDifficulty = difficultyQuestionArray[Math.floor(Math.random() * size)];
      difficultyLevel = randomDifficulty;
    }

    let relatedQuestions = [];
    let qArr = questions.data.problemsetQuestionList.questions;
    for (let i = 0; i < qArr.length; i++) {
      let question = qArr[i];
      //console.log(question.difficulty.toLowerCase());
      if(question.difficulty.toLowerCase() === difficultyLevel) {
        relatedQuestions.push(question);
      }
    }

    let sz = relatedQuestions.length;
    //console.log("Related Questions")
    //console.log(relatedQuestions);
    let randomQuestion = relatedQuestions[Math.floor(Math.random() * sz)];


    //console.log(allQuestions.data.problemsetQuestionList.questions.length);
		interaction.reply({ embeds : [createLeetcodeQuestionEmbed(randomQuestion)] });
	}
};
