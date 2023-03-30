const { Events, PermissionsBitField, EmbedBuilder } = require("discord.js");
const messages = require('../helpers/messages');

let id, embed, buttons, selectMenu, type;

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        // Check for permissions
        if (!interaction.isButton()) return;
        if (!interaction.guild.members.me.permissionsIn(interaction.channel).has([PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.UseExternalEmojis])) {
            await interaction.reply("nep does not have permission to send messages here.");
            return;
        }
        
        interaction.deferUpdate();

        id = interaction.message.id;
        if (!messages[id]) return;
        
        type = interaction.customId.replace('Button', '');
        embed = messages[id][type];
        buttons = messages[id].buttons;

        if (['egoButton', 'identitiesButton'].includes(interaction.customId)) {
            selectMenu = messages[id][`${type}SelectMenu`]
            interaction.message.edit({ embeds: [embed], components: [buttons, selectMenu] })
            return;
        }

        interaction.message.edit({ embeds: [embed], components: [buttons] });
    }
}