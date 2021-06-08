const Commando = require('discord.js-commando');
const Discord = require('discord.js');
let db;

let contestDict = {
    "location": [
        "planet",
        "region",
        "country",
        "continent",
        "lake",
        "sea",
        "valley",
        "mountain",
        "territory",
        "city",
        "town",
        "village",
        "hideout",
        "dwelling",
        "castle",
        "house",
        "haunted house",
        "cave",
        "forest",
        "beach",
        "headquarters",
        "secret base",
        "campsite",
        "settlement",
        "road",
        "tower",
        "building",
        "graveyard",
        "park",
        "canyon",
        "tunnel",
        "dungeon",
        "room",
        "well",
        "playground",
        "ravine",
        "island",
        "farm",
        "jungle",
        "sewer",

    ],
    "entity": [
        "character",
        "person",
        "deity",
        "god",
        "creature",
        "cryptid",
        "animal",
        "people",
        "civilization",
        "society",
        "colony",
        "race",
        "villain",
        "demon",
        "angel",
        "ghost",
        "species",
        "ruler",
        "king",
        "sage",
        "witch",
        "wizard",
        "child",
        "adventurer",
        "explorer",
        "rebel",
        "outlaw",
        "wise man",
        "hero",
        "warrior",
        "soldier",
        "army",
        "troll",
        "criminal",
        "abomination",
        "virus",
        "bacteria"

    ],
    "object": [
        "book",
        "weapon",
        "sword",
        "wand",
        "gun",
        "car",
        "tank",
        "potion",
        "mineral",
        "element",
        "boat",
        "aircraft",
        "spacecraft",
        "tree",
        "cloak",
        "armor",
        "food",
        "scroll",
        "tool",
        "ancient technology",
        "technology",
        "illegal good",
        "pollutant",
        "medication",

    ],
    "event": [
        "outbreak",
        "war",
        "battle",
        "apocalypse",
        "famine",
        "party",
        "pilgrimage",
        "eruption",
        "natural disaster",
        "storm",
        "asteroid impact"

    ],
    "other": [
        "spell",
        "foundation",
        "company",
        "institution",
        "philosophy",
        "ability",
        "myth",
        "folklore",
        "symbol",

    ]


};

(async () => {
    db = await require("../../util/db");
})();

module.exports = class WBPromptCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: "wbprompt",
            aliases: ['wbp'],
            group: "wb",
            memberName: "wbprompt",
            description: "Prompts user with random ideas for facet creation",
            details: "%wbprompt returns a random type and tag. %wbprompt [type] returns a random tag from that type.",
            argsType: "multiple"
        })
    }



    async run(message, args) {
        try{
            await db.query(`SELECT * FROM users WHERE userId = '${message.author.id}'`).then(userResult => {
                if (userResult[0] && userResult[0].length > 0) { // do command

                    let contestType = "";
                    let contestTag = "";

                    // random type and tag
                    if (args.length == 0) {
                        var keys = Object.keys(contestDict);
                        contestType = keys[keys.length * Math.random() << 0];
                        contestTag = contestDict[contestType][contestDict[contestType].length * Math.random() << 0];

                        message.channel.send("Consider creating a facet of type '" + contestType + "' and with the tag '" + contestTag + "'.");
                    } else if (args.length == 1) {
                        if (args[0] === "location" || args[0] === "entity" || args[0] === "object" || args[0] === "event" || args[0] === "other") {
                            var keys = Object.keys(contestDict);
                            contestType = args[0];
                            contestTag = contestDict[contestType][contestDict[contestType].length * Math.random() << 0];

                            message.channel.send("Consider creating a facet of type '" + contestType + "' and with the tag '" + contestTag + "'.");
                        } else {
                            message.channel.send("Invalid type.");
                        }
                    } else {
                        message.channel.send("Invalid arguments");
                    }
                } else {
                    message.reply("You are either not registered yet or banned! Read through %wbrules to start registration");
                }
            }).catch(err => console.log(err));
        } catch(err) {
            console.log(err);
        }
        
    }
};

