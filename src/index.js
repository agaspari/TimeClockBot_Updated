import Discord from 'discord.js';
import config from './config.json';

/* Command Setup */ 
export const bot = new Discord.Client();

let channel = undefined;

/* Bot setup */
bot.on("ready", () => {
	console.log("Bot is running");
	const guild = bot.guilds.resolve(config['time-clock-guild-id']);
    channel = guild.channels.resolve(config['time-clock-channel-id']);
});

bot.on("voiceStateUpdate", function(oldState, newState){
	if (oldState.channelID != newState.channelID) { // Not sure what this check, checks for.
		// User has either left, joined or moved channels

		if (!oldState.channelID) {
			// User has joined the channel
			if (newState.channelID != config['afk-channel-id']) {
				channel.send(newState.member.displayName + " has just clocked in.");
			}
		} else if (!newState.channelID) {
			// User has left the channel
			if (oldState.channelID != config['afk-channel-id']) {
				channel.send(oldState.member.displayName + " has just clocked out (Left).");
			}
		} else {
			// User has moved channels
			console.log(newState.channel.name + " " + newState.channelID);
			if (newState.channelID == config['afk-channel-id']) {
				channel.send(oldState.member.displayName + " has just clocked out (AFK).");
			} else if (oldState.channelID == config['afk-channel-id']) {
				channel.send(newState.member.displayName + " has just clocked in.");
			}
		}
	}
});

bot.login(config.token);
