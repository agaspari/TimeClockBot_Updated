const { Client, GatewayIntentBits } = require('discord.js');
import config from './config.json';

/* Command Setup */ 
const bot = new Client({
  intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildPresences ]
})
let channel = undefined;

/* Bot setup */
bot.on("ready", () => {
	console.log("Bot is running");
	const guild = bot.guilds.resolve(config['time-clock-guild-id']);
    channel = guild.channels.resolve(config['time-clock-channel-id']);
});

bot.on("voiceStateUpdate", function(oldState, newState){
	if (oldState.channelId != newState.channelId) { // Not sure what this check, checks for.
		// User has either left, joined or moved channels

		if (!oldState.channelId) {
			// User has joined the channel
			if (newState.channelId != config['afk-channel-id']) {
				channel.send(newState.member.displayName + " has just clocked in.");
			}
		} else if (!newState.channelId) {
			// User has left the channel
			if (oldState.channelId != config['afk-channel-id']) {
				channel.send(oldState.member.displayName + " has just clocked out (Left).");
			}
		} else {
			// User has moved channels
			console.log(newState.channel.name + " " + newState.channelId);
			if (newState.channelId == config['afk-channel-id']) {
				channel.send(oldState.member.displayName + " has just clocked out (AFK).");
			} else if (oldState.channelId == config['afk-channel-id']) {
				channel.send(newState.member.displayName + " has just clocked in.");
			}
		}
	}
});

bot.login(config.token);
