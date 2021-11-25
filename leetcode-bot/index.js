const fs = require('fs');
var axios = require('axios');
var CronJob = require('cron').CronJob;

const leetcodeUtils = require('./utils/leetcode-utils.js')

const {
	REST
} = require('@discordjs/rest');
const {
	Routes
} = require('discord-api-types/v9');
// Require the necessary discord.js classes
const {
	Client,
	Intents,
	Collection
} = require('discord.js');

// Create a new client instance
const client = new Client({
	intents: [Intents.FLAGS.GUILDS]
});

// Loading commands from the commands folder
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Loading the token from .env file
const dotenv = require('dotenv');
const envFILE = dotenv.config();
const TOKEN = process.env['TOKEN'];


// Edit your TEST_GUILD_ID here in the env file for development
const TEST_GUILD_ID = envFILE.parsed['TEST_GUILD_ID'];


// Creating a collection for commands in client
client.commands = new Collection();

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
	client.commands.set(command.data.name, command);
}

// Fetch all Leetcode questions and store them in a file called leetcode.json
const getAllLeetcodeQuestions = async () => {

  var data = JSON.stringify({
    query: `query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
    problemsetQuestionList: questionList(
      categorySlug: $categorySlug
      limit: $limit
      skip: $skip
      filters: $filters
    ) {
      total: totalNum
      questions: data {
        acRate
        difficulty
        freqBar
        frontendQuestionId: questionFrontendId
        isFavor
        paidOnly: isPaidOnly
        status
        title
        titleSlug
        topicTags {
          name
          id
          slug
        }
        hasSolution
        hasVideoSolution
      }
    }
  }`,
    variables: {"categorySlug":"","skip":0,"limit":10000,"filters":{}}
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

  let response = await axios(config)
  .then(function (response) {
    //console.log(JSON.stringify(response.data));
    //console.log(JSON.parse(JSON.stringify(response.data)));
    return JSON.parse(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });

  return response;
}

const leetcodeDailyQuestionJob = async() => {
	var job = new CronJob('* * * * * *', function() {
  	//console.log('You will see this message every second');
		leetcodeUtils.leetcodeDailyQuestionUpdate(client);
	}, null, true, 'America/Los_Angeles');

	return job;
}

const startCronJobs = async() => {
	var lcJob = leetcodeDailyQuestionJob();
	lcJob.start;
}

const saveLeetCodeQuestions = async() => {
	try {
		let questions = JSON.stringify(await getAllLeetcodeQuestions());

		fs.writeFile('./data/leetcode.json', questions, function(err) {
			if(err) {
				console.log("There has been an error saving leetcode questions.");
				console.log(err.message);
				return;
			}
			console.log('Leetcode questions saved Successfully.');
		});
	} catch(error) {
		if (error) console.error(error);
	}
}

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
	// Registering the commands in the client
	const CLIENT_ID = client.user.id;
	const rest = new REST({
		version: '9'
	}).setToken(TOKEN);
	(async () => {
		try {
			if (!TEST_GUILD_ID) {
				await rest.put(
					Routes.applicationCommands(CLIENT_ID), {
						body: commands
					},
				);
				console.log('Successfully registered application commands globally');
			} else {
				await rest.put(
					Routes.applicationGuildCommands(CLIENT_ID, TEST_GUILD_ID), {
						body: commands
					},
				);
				console.log('Successfully registered application commands for development guild');
			}
			try {
				 startCronJobs();
			   if (!fs.existsSync('./data/leetcode.json')) {
			      saveLeetCodeQuestions();
						console.log("File doesn't exist");
			   } else {
					 console.log("File does exist");
				 }
			} catch (err) {
			   console.error(err)
			}

		} catch (error) {
			if (error) console.error(error);
		}
	})();
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
	const command = client.commands.get(interaction.commandName);
	if (!command) return;
	try {
		await command.execute(interaction);
	} catch (error) {
		if (error) console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});


// Login to Discord with your client's token
client.login(TOKEN);
