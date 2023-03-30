const { EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");
const randomColor = require("./randomColor");

let response, json, aff, skills, embed, skillDesc = '', skillEffect, passiveDesc = '', passiveJsonDesc;

async function identityEmbed(slug) {

    response = await fetch(`https://www.prydwen.gg/page-data/limbus-company/identities/${slug}/page-data.json`);
    
    // Send suggestion if can't find the character
    if (response.status != 200) return false;

    // JSONify
    json = await response.json();
    json = json.result.data.currentUnit.nodes[0];

    aff = json.affinityDetailed;

    passiveDesc = '';
    // Passive
    json.passives.forEach(passive => {
        // Title
        passiveDesc += `${AFFINITIES[passive.type]} **${passive.name} [${passive.passiveType}] [${AFFINITIES[passive.type]}x${passive.cost}]**\n`

        // Desc
        passiveJsonDesc = JSON.parse(passive.description.raw);
        passiveDesc += `\`\`\`${passiveJsonDesc.content[0].content[0].value}\`\`\`\n`;
    })

    // * Skill embed
    embed = new EmbedBuilder()
        .setTitle(`[${json.rarity}] ${json.name}`)
        .setDescription(`[Check out our detailed ratings and reviews](https://www.prydwen.gg/limbus-company/identities/${slug})`)
        .setThumbnail(`https://prydwen.gg${json.imageSmall.localFile.childImageSharp.gatsbyImageData.images.fallback.src}`)
        .setColor(randomColor())
        .setTimestamp()
        .setFooter({ text: 'nepnep#1358', iconURL: 'https://store.playstation.com/store/api/chihiro/00_09_000/container/BE/nl/19/EP0031-CUSA03124_00-AV00000000000037/image?w=320&h=320&bg_color=000000&opacity=100&_version=00_09_000' })
        .addFields(
            // Field 1 (Profile)
            { 
                name: 'AFFINITY', 
                value: `${AFFINITIES[aff.affinity_1]} **${aff.affinity_1}**x${aff.affinity_1_v}`
                    + ` ${AFFINITIES[aff.affinity_2]} **${aff.affinity_2}**x${aff.affinity_2_v}` 
                    + ` ${AFFINITIES[aff.affinity_3]} **${aff.affinity_3}**x${aff.affinity_3_v}` 
            }, 

            // Field 2 (Ratings)               
            { name: 'RATINGS', value: `**PVE**: ${RATINGS[json.ratings.pve] ?? '?'}` },
            
            // Field 3.1 (Stats/Status)
            { 
                name: 'STATS (LVL 30)',
                value: `<:stat_hp:1087400351080128532> **Max HP**: ${json.status.hp_30}`
                     + `\n<:stat_def:1087400347842129980> **Speed Range**: ${json.status.def_30}`
                     + `\n<:stat_speed:1087400352833343598> **Defense**: ${json.status.speed_30}`,
                inline: true, 
            },

            // Field 3.2 (Stats/Res)
            {
                name: '\u200b',
                value: `<:attackt_slash:1087400345744973894> **Slash RES**: ${json.resistances.slash}`
                     + `\n<:attackt_pierce:1087400342511165461> **Pierce RES**: ${json.resistances.pierce}`
                     + `\n<:attackt_blunt:1087400340728578078> **Blunt RES**: ${json.resistances.blunt}`,
                inline: true,
            },
        );

    // Skills
    skills = json.skills;
    skills.forEach((skill, index) => {

        // Reset skillDesc
        skillDesc = '';
        
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
            skillDesc += `${skillEffect.content[0].content[0].value} ${skillEffect.content[0].content[1] ? skillEffect.content[0].content[1].value : ''}\n`;
        }

        // Coin Effect
        if (skill.coinEffect) {
            Object.values(skill.coinEffect).filter(effect => effect).forEach((effect, index) => {
                index % 2 == 0 ? skillDesc += `[${effect}] ` : skillDesc += `${effect.replace(/<b>/g, "").replace(/<\/b>/g, "").replace(/ <br \/> /g, "\n")}\n`;
            }); 
        }

        // End block
        skillDesc += '```\n';

        // * Field 4.index (Skills)
        embed.addFields({ name: index === 0 ? 'SKILLS' : '\u200b', value: skillDesc });
    });

    // * Field 5 (PASSIVES)
    embed.addFields({ name: 'PASSIVES', value: passiveDesc })

    return embed;
}


module.exports = identityEmbed;


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