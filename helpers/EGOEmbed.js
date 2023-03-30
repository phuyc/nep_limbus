const { EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");
const randomColor = require("./randomColor");

let response, json, res, resDesc1 = '', resDesc2 = '', skills, skillDesc, embed, cost, costDesc = '', passiveDesc;

async function EGOEmbed(slug) {

    response = await fetch(`https://www.prydwen.gg/page-data/limbus-company/ego/${slug}/page-data.json`);
    
    // Send suggestion if can't find the character
    if (response.status != 200) return false;

    // JSONify
    json = await response.json();
    json = json.result.data.currentUnit.nodes[0];

    // Cost
    costDesc = '';
    // costDesc += json.sanityCost;
    cost = Object.entries(json.cost).filter(([key, value]) => value);
    cost.forEach(([key, value]) => {
    value = value.charAt(0).toUpperCase() + value.slice(1);
        key.endsWith('_v') ? costDesc += `x${value} ` : costDesc += `${AFFINITIES[value]} ${value}`
    });

    // RES
    res = json.resistances;
    resDesc1 = '';
    resDesc2 = '';

    // Looping through key: value pairs of res
    Object.entries(res).forEach(([key, value], index) => {
        key = key.charAt(0).toUpperCase() + key.slice(1);
        if (index < 4) resDesc1 += `${AFFINITIES[key]} **${key}**: ${value}\n`;
        if (index >= 4) resDesc2 += `${AFFINITIES[key]} **${key}**: ${value}\n`;
    })

    // Skills
    skills = json.skills;
    skillDesc = '';

    // Looping through skills
    skills.forEach(skill => {

        // Title
        skillDesc += `${AFFINITIES[skill.type]} **${skill.name.toUpperCase()}**\n`
        
        // Start block
        skillDesc += '```ini\n';

        // Details
        skillDesc += `Attack Type: [${skill.attackType}] ${' '.repeat(7 - skill.attackType.length)} Skill Power: [${skill.skillPower}]\n`
                   + `No of Coins: [${skill.numberOfCoins}] ${' '.repeat(7 - skill.numberOfCoins.length)} Coin Power:  [${skill.coinPower}]\n`
                   + `Offense Lvl: [${skill.offenseLevel}] ${' '.repeat(7 - skill.offenseLevel.length)} Growth:      [${skill.growth}]\n`

        // Skill Effect
        if (skill.skillEffect) {
            skillEffect = JSON.parse(skill.skillEffect.raw);
            skillDesc += `${skillEffect.content[0].content[0].value} ${skillEffect.content[0].content[1] ? skillEffect.content[0].content[1].value : ''}\n`
        }

        // Coin Effect
        Object.values(skill.coinEffect).filter(effect => effect).forEach((effect, index) => {
            index % 2 == 0 ? skillDesc += `[${effect}] ` : skillDesc += `${effect.replace(/<b>/g, "").replace(/<\/b>/g, "").replace(/ <br \/> /g, "\n")}\n` 
        }); 

        // End block
        skillDesc += '```\n';

    });

    passiveDesc = JSON.parse(json.passiveDesc.raw);

    // * Embed
    embed = new EmbedBuilder()
    .setTitle(`[${json.rarity}] ${json.name} ${AFFINITIES[json.affinity]}`)
    .setDescription(`[Check out our detailed ratings and reviews](https://www.prydwen.gg/limbus-company/ego/${slug})`)
    .setThumbnail(`https://prydwen.gg${json.imageSmall.localFile.childImageSharp.gatsbyImageData.images.fallback.src}`)
    .setColor(randomColor())
    .setTimestamp()
    .setFooter({ text: 'nepnep#1358', iconURL: 'https://store.playstation.com/store/api/chihiro/00_09_000/container/BE/nl/19/EP0031-CUSA03124_00-AV00000000000037/image?w=320&h=320&bg_color=000000&opacity=100&_version=00_09_000' })
    .addFields(

        // Ratings
        { name: 'RATINGS', value: `**Review is not available for this EGO yet**.\nWe will add it as soon as it is possible!` },

        // Cost
        { name: 'COMBAT INFO', value: costDesc},

        // RES 1
        { name: 'RESISTANCES', value: resDesc1, inline: true },

        // RES 2
        { name: '\u200b', value: resDesc2, inline: true},
        
        // Skills
        { name: 'SKILLS', value: skillDesc },
        
        // Passive
        { name: 'PASSIVE', value: `**${json.passiveName}**\n\`\`\`${passiveDesc.content[0].content[0].value}\`\`\``},
    )

    return embed;
}

module.exports = EGOEmbed;


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

const AFFINITIES = {
    Envy: '<:affinity_envy_big:1087400357551939734>',
    Gloom: '<:affinity_gloom_big:1087400364883587152>',
    Gluttony: '<:affinity_gluttony_big:1087400371313463430>',
    Lust: '<:affinity_lust_big:1087400379706253393>',
    Pride: '<:affinity_pride_big:1087400384928170094>',
    Sloth: '<:affinity_sloth_big:1087400389856481432>',
    Wrath: '<:affinity_wrath_big:1087400337188601888>',
};