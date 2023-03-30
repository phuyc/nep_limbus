const Database = require("better-sqlite3");
const fetch = require("node-fetch");
const db = new Database("./limbus.db");

async function autoUpdate() {
    // identities
    let identities = await fetch("https://www.prydwen.gg/page-data/limbus-company/identities/page-data.json");
    let identitiesJson = await identities.json();
    identitiesJson = identitiesJson.result.data.allCharacters.nodes;
    
    const CurrentChar1 = db.prepare("SELECT name FROM identities;").all();
    
    for (let i = 0; i < identitiesJson.length; i++) {
        if (!CurrentChar1.some(char => char.name === identitiesJson[i].name)) {
            db.prepare("INSERT OR IGNORE INTO identities (name, slug, rarity, ratingPVE, base) VALUES (?, ?, ?, ?, ?);")
                .run(identitiesJson[i].name, identitiesJson[i].slug, identitiesJson[i].rarity, identitiesJson[i].ratings.pve, identitiesJson[i].baseCharacter);
        }
    }
    
    // EGO
    let EGO = await fetch("https://www.prydwen.gg/page-data/limbus-company/ego/page-data.json");
    let EGOjson = await EGO.json();
    EGOjson = EGOjson.result.data.allCharacters.nodes;

    const CurrentChar2 = db.prepare("SELECT name FROM EGO;").all();

    for (let i = 0; i < EGOjson.length; i++) {
        if (!CurrentChar2.some(char => char.name === EGOjson[i].name)) {
            db.prepare("INSERT OR IGNORE INTO EGO (name, slug, rarity, ratingPVE, base) VALUES (?, ?, ?, ?, ?);")
                .run(EGOjson[i].name, EGOjson[i].slug, EGOjson[i].rarity, EGOjson[i].ratings ? EGOjson[i].ratings.pve : '', EGOjson[i].character);
        }
    }

}

(async () => await autoUpdate())();
module.exports = autoUpdate