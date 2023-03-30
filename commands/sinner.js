const { SlashCommandBuilder } = require("discord.js");
const sinnerEmbed = require("../helpers/sinnerEmbed");
const bestMatch = require('../helpers/bestMatch');
const messages = require("../helpers/messages");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sinner')
        .setDescription('Displays the information of a sinner')
        .addStringOption(option => 
            option.setName('name')
                .setDescription('The name of the sinner')
                .setRequired(true)),
    async execute(interaction) {
        // Get the queries
        const name = interaction.options.getString('name').toLowerCase().trim();

        // Find best match
        let match = bestMatch(name);

        // Create embed if found character
        if (match) {
            // Send embed
            let profile = await sinnerEmbed(match);

            if (match === 'Dante') {
                await interaction.editReply({ embeds: [profile.about] });
                return;
            }

            await interaction.editReply({ embeds: [profile.about], components: [profile.buttons] });

            // Store embeds for further uses
            let reply = await interaction.fetchReply();
            messages[reply.id] = profile;
            setTimeout(() => delete messages[reply.id], 120000);
            
            return;
        }

        // Return message if couldn't fine one
        await interaction.editReply({ content: "Couldn't find the character!", ephemeral: true });
        return;
    }
}