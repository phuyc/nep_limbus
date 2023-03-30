const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require("discord.js");
const randomColor = require("./randomColor");
const Database = require("better-sqlite3");

const db = new Database("./limbus.db")

let identitiesEmbed, sinner, about, identities, EGOs, identityDesc, egoDesc, egoEmbed, identitiesSelectMenu, EGOSelectMenu;

const egoOptions = [];
const identitiesOptions = [];

const buttons = new ActionRowBuilder()
    .addComponents(
        // 1
        new ButtonBuilder()
            .setCustomId('about')
            .setLabel(`About`)
            .setStyle(ButtonStyle.Primary),
        // 2
        new ButtonBuilder()
            .setCustomId('identitiesButton')
            .setLabel(`Identities`)
            .setStyle(ButtonStyle.Primary),
        // 3
        new ButtonBuilder()
            .setCustomId('egoButton')
            .setLabel(`EGO`)
            .setStyle(ButtonStyle.Primary),
    );


async function sinnerEmbed(name) {

    // Sinner
    sinner = db.prepare("SELECT * FROM sinners WHERE name=?;").get(name);

    // Identities
    identities = db.prepare("SELECT name, slug, rarity, ratingPVE FROM identities WHERE base=?;").all(sinner.name);
    identityDesc = '';
    identitiesOptions.length = 0;

    // * Add each identity to identitiesEmbed and identities SelectMenu option
    if (identities.length === 0) {
        identityDesc = "This sinner doesn't have any identity.";
    } else {
        identities.forEach((identity, index) => {
            identityDesc += `**${index + 1}. [${[identity.rarity]}] ${identity.name}** ${RATINGS[identity.ratingPVE] ?? ''}\n`;
            identitiesOptions.push({ label: identity.name, value: identity.slug });
        })
    }

    // EGO
    EGOs = db.prepare("SELECT name, slug, rarity, ratingPVE FROM EGO WHERE base=?;").all(sinner.name);
    egoDesc = '';
    egoOptions.length = 0;

    // * Add each EGO to EGOEmbed and EGO SelectMenu option
    if (EGOs.length === 0) {
        egoDesc = "This sinner doesn't have any EGO.";
    } else {
        EGOs.forEach((ego, index) => {
            egoDesc += `**${index + 1}. [${ego.rarity}] ${ego.name} ${RATINGS[ego.ratingPVE] ?? ''}**\n`;
            egoOptions.push({ label: ego.name, value: ego.slug });
        })
    }

    // Identities and EGO Select Menu
    identitiesSelectMenu = new ActionRowBuilder().addComponents(new StringSelectMenuBuilder().setCustomId('identitiesSelectMenu').setOptions(identitiesOptions))
    EGOSelectMenu = new ActionRowBuilder().addComponents(new StringSelectMenuBuilder().setCustomId('egoSelectMenu').setOptions(egoOptions))

    // About
    about = new EmbedBuilder()
        .setTitle(`${sinner.name}`)
        .setDescription(`[Check out the lore behind all of the sinners](https://www.prydwen.gg/limbus-company/guides/characters-lore)`)
        .setColor(randomColor())
        .setTimestamp()
        .setThumbnail(`https://www.prydwen.gg/static/${sinner.imageSmall}`)
        .setFooter({ text: 'nepnep#1358', iconURL: 'https://store.playstation.com/store/api/chihiro/00_09_000/container/BE/nl/19/EP0031-CUSA03124_00-AV00000000000037/image?w=320&h=320&bg_color=000000&opacity=100&_version=00_09_000' })
        .addFields({ name: '\u200b', value: sinner.about });
    
    // Identities
    identitiesEmbed = new EmbedBuilder()
        .setTitle(`${sinner.name}`)
        .setDescription(`[Check out the lore behind all of the sinners](https://www.prydwen.gg/limbus-company/guides/characters-lore)`)
        .setColor(randomColor())
        .setTimestamp()
        .setThumbnail(`https://www.prydwen.gg/static/${sinner.imageSmall}`)
        .setFooter({ text: 'nepnep#1358', iconURL: 'https://store.playstation.com/store/api/chihiro/00_09_000/container/BE/nl/19/EP0031-CUSA03124_00-AV00000000000037/image?w=320&h=320&bg_color=000000&opacity=100&_version=00_09_000' })
        .addFields({ name: 'AVAILABLE IDENTITIES', value: identityDesc })

    // EGO
    egoEmbed = new EmbedBuilder()
        .setTitle(`${sinner.name}`)
        .setDescription(`[Check out the lore behind all of the sinners](https://www.prydwen.gg/limbus-company/guides/characters-lore)`)
        .setColor(randomColor())
        .setThumbnail(`https://www.prydwen.gg/static/${sinner.imageSmall}`)
        .setTimestamp()
        .setFooter({ text: 'nepnep#1358', iconURL: 'https://store.playstation.com/store/api/chihiro/00_09_000/container/BE/nl/19/EP0031-CUSA03124_00-AV00000000000037/image?w=320&h=320&bg_color=000000&opacity=100&_version=00_09_000' })
        .addFields({ name: 'AVAILABLE EGO', value: egoDesc })

    return {
        about: about, 
        identities: identitiesEmbed,
        identitiesSelectMenu: identitiesSelectMenu,
        ego: egoEmbed,
        egoSelectMenu: EGOSelectMenu,
        buttons: buttons,
    };
}

module.exports = sinnerEmbed;

const RATINGS = {
    "1": "?",
    "4": "<:F_:1037311733833928704>",
    "5": "<:D_:1024285330217640038>",
    "6": "<:C_:1024285328246313041>",
    "7": "<:B_:1024285326270808094>",
    "8": "<:A_:1024285324345622529>",
    "9": "<:S_:1024285317643108383>",
    "10": "<:SS:1024285320268746762>",
    "11": "<:SSS:1024285322433015858>",
};