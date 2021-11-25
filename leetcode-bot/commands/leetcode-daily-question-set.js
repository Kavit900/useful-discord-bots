const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

const saveDailyQuestionRegisteredChannelIdAndGuildId = async(channelId, guildId) => {
	try {

		// Read the guilds info from the file and then save it
		let guildsInfo = fs.readFileSync('./data/leetcode-daily-question-guild-info.json');

		let guilds = JSON.parse(guildsInfo);

		let guild = {
			guildId: guildId,
			channelId: channelId
		}

		guilds.push(guild);

		fs.writeFile('./data/leetcode-daily-question-guild-info.json', JSON.stringify(guilds), function(err) {
			if(err) {
				console.log("There has been an error saving Channel id and guild id.");
				console.log(err.message);
				return;
			}
			console.log('Daily leetcode question guild info saved Successfully.');
		});
	} catch(error) {
		if (error) console.error(error);
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leetcode-daily-question-set')
		.setDescription('Set current channel to update current channel with leetcode\'s daily question'),
	async execute(interaction) {

    let channelId = interaction.channelId;
    let guildId = interaction.guildId;

    saveDailyQuestionRegisteredChannelIdAndGuildId(channelId, guildId);

		interaction.reply({content: 'Current Channel set to receive daily leetcode questions updates'});
	}
};
