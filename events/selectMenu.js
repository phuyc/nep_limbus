const { Events } = require('discord.js');
const EGOEmbed = require('../helpers/EGOEmbed');
const identityEmbed = require('../helpers/identityEmbed');

let type, character, embed;

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isStringSelectMenu()) return;
		if (!interaction.inGuild()) {
			await interaction.reply("Don't try to casually slide into my DM! Add me to your server in order to use my commands.");
			return;
        }

        interaction.deferUpdate();

        type = interaction.customId;
        character = interaction.values[0];

        embed = type === 'identitiesSelectMenu' ? await identityEmbed(character) : await EGOEmbed(character);

        await interaction.message.edit({ embeds: [embed] });
    }
}