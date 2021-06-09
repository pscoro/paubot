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

module.exports = class WBContestCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: "wbcontest",
            aliases: ['wbct'],
            group: "wb",
            memberName: "wbcontest",
            description: "Starts a wbcreate facet creation contest",
            details: "%wbcontest starts a 3 minute contest of a random type and tag from a pre-existing dictionary. %wbcontest [type] [tag] starts a contest for a user-specified type and tag. All %wbcreate entries in the 3 minutes after this command will be entered into the contest if the type matches and tag is included. After the 3 minutes are up users will have another 3 minutes to read through entries and vote on an entry with %wbcontest vote [ID] where ID is a facet ID of an entry. The winner of the contest gets awarded 50 energy points.",
            argsType: "multiple"
        })
    }



    async run(message, args) {
        try{


            let userResult = await db.query(`SELECT * FROM users WHERE userId = '${message.author.id}'`);
            if (!userResult[0] || userResult[0].length == 0) { // do command
                message.reply("You are either not registered yet or banned! Read through %wbrules to start registration");
                return;
            }
            let contestType = "";
            let contestTag = "";

            let result = await db.query(`SELECT * FROM worlds WHERE guildId = '${message.guild.id}'`);
            if (!result[0] || result[0].length == 0) {
                message.channel.send("A world has not yet been created for this server.");
                return;    
            }
            if (result[0][0].isContestRunning == 1 && args[0] != "vote") {
                message.channel.send("A contest is already running for this server");
                return;
            }

            if (args.length == 0) {
                var keys = Object.keys(contestDict);
                contestType = keys[keys.length * Math.random() << 0];
                contestTag = contestDict[contestType][contestDict[contestType].length * Math.random() << 0];

            } else if (args.length == 2) {
                if (args[0] === "vote") {
                    let guildResult = await db.query(`SELECT * FROM worlds WHERE guildId = '${message.guild.id}'`)
                    if (!guildResult[0] || guildResult[0].length == 0) {
                        message.channel.send("A world has not yet been created for this server.");
                        return;
                    }
                    if (!guildResult[0][0].contestEntries || guildResult[0][0].contestEntries.length == 0) {
                        message.channel.send("No entries exist yet for this contest.");
                        return;
                    }
                    let entriesMap = new Map();
                    for(let i = 0; i < guildResult[0][0].contestEntries.split(", ").length; i++) {
                        entriesMap[guildResult[0][0].contestEntries.split(", ")[i].split(": ")[0]] = guildResult[0][0].contestEntries.split(", ")[i].split(": ")[1];
                    }
                    var keys = Object.keys(entriesMap);
                    if(!(args[1] in entriesMap)) {
                        message.reply("No facet of that ID is a contest entry");
                        return;
                    }
                    let newValue = parseInt(entriesMap[args[1]]);
                    entriesMap[args[1]] = newValue + 1;
                    let newContestEntriesText = "";
                    for(let i = 0; i < guildResult[0][0].contestEntries.split(", ").length; i++) {
                        newContestEntriesText += guildResult[0][0].contestEntries.split(", ")[i].split(": ")[0] + ": " + entriesMap[guildResult[0][0].contestEntries.split(", ")[i].split(": ")[0]] + ", ";
                    }
                    newContestEntriesText = newContestEntriesText.substring(0, newContestEntriesText.length-2);

                    await db.query(`UPDATE worlds SET contestEntries = '${newContestEntriesText}' WHERE guildId = '${message.guild.id}'`)
                    message.reply("Your vote for " + args[1] + " has been casted.");
                      
                } else {
                    // type & tag
                    if(args[0] === "location" || args[0] === "entity" || args[0] === "object" || args[0] === "event" || args[0] === "other") {
                        contestType = args[0];
                        contestTag = args[1];
                    } 
                }
            } else if (args.length == 1) {
                // just type, random tag
                if(args[0] === "location" || args[0] === "entity" || args[0] === "object" || args[0] === "event" || args[0] === "other") {
                    contestType = args[0];
                    contestTag = contestDict[contestType][contestDict[contestType].length * Math.random() << 0];
                }                 
            } else {
                message.channel.send("Invalid arguments");
                return;
            }
            if (args[0] != "vote") {
                await db.query(`UPDATE worlds SET isContestRunning = 1, contestTag = '${contestTag}', contestType = '${contestType}' WHERE guildId = '${message.guild.id}'`);
                    
                let startEmbed = new Discord.MessageEmbed()
                    .setColor('#99ff00')
                    .setTitle("Starting %wbcreate contest")
                    .setDescription("A facet creation contest for " + result[0][0].worldName + ", read through %help wbcreate if you unfamiliar with how to use %wbcreate.")
                    .addFields(
                        {name: "Contest Facet Type", value: contestType},
                        {name: "Contest Facet Tag", value: contestTag},
                        {name: "How to play", value: "All participants have 3 minutes to use %wbcreate to create a facet of the type specified above, include the specified tag in your facet tags. After the 3 minutes are up you will be able to vote on your favorite entry. Winner gets 50 energy points."}
                    )
                    .setFooter("Start creating!")
                message.channel.send(startEmbed).then(() => {
                    setTimeout(async () => {
                        let contestResult = await db.query(`SELECT * FROM worlds WHERE guildId = '${message.guild.id}'`);
                        if (!contestResult[0] || contestResult[0].length == 0 || !contestResult[0][0].contestEntries || contestResult[0][0].contestEntries.length == 0) {
                            message.channel.send("Contest over! No entries were created, what the freakin heck guys... :(");
                            await db.query(`UPDATE worlds SET isContestRunning = 0, contestEntries = NULL, contestTag = NULL, contestType = NULL WHERE guildId = '${message.guild.id}'`);
                            return;
                        }

                        let entryIDsText = "";
                        for(let i = 0; i < contestResult[0][0].contestEntries.split(", ").length; i++) {
                            entryIDsText += contestResult[0][0].contestEntries.split(", ")[i].split(": ")[0] + ", ";
                        }
                        entryIDsText = entryIDsText.substring(0, entryIDsText.length-2);
                        
                        let entriesResult = await db.query(`SELECT * FROM guild_${message.guild.id} WHERE facetId IN (${entryIDsText})`);
                            
                        if(!entriesResult[0] || entriesResult[0].length == 0) {
                            message.channel.send("Contest over! No entries were created, what the freakin heck guys... :(");
                            db.query(`UPDATE worlds SET isContestRunning = 0, contestEntries = NULL, contestTag = NULL, contestType = NULL WHERE guildId = '${message.guild.id}'`).then(() => {
                                console.log("Somehow you have made it to the end of a contest");
                            }).catch(err => console.log(err));
                            return;
                        }
                            
                        let entriesEmbed = new Discord.MessageEmbed()
                            .setColor('#99ff00')
                            .setTitle("Contest Entries")
                            .setDescription("Contest over! Read through the following entries with %wbview [ID or name] and then vote on your favorite with %wbcontest vote [ID]. You Have 3 minutes.") // left off here, add vote check to args.length==2
                            .setFooter("Start voting!")

                        for(var i = 0; i < entriesResult[0].length; i++) {
                            let shortDesc = entriesResult[0][i].facetDesc.split(".")[0];
                            if (shortDesc.length > 128) shortDesc = shortDesc.substring(0, 127);
                            entriesEmbed.addFields(
                                {name: 'ID #' + entriesResult[0][i].facetId + ": " + entriesResult[0][i].facetName, value: "Type: " + entriesResult[0][i].facetType + "\nTags: " + entriesResult[0][i].facetTags + "\n" + shortDesc}
                            )
                        }
                        message.channel.send(entriesEmbed).then(() => {
                            setTimeout(async () => {
                                let contestResult = await db.query(`SELECT * FROM worlds WHERE guildId = '${message.guild.id}'`);
                                if (!contestResult[0] || contestResult[0].length == 0 || !contestResult[0][0].contestEntries || contestResult[0][0].contestEntries.length == 0) {
                                    message.channel.send("I honestly have no clue how this error could have happened.");
                                    return;
                                }
                                
                                let entryIDsText = "";
                                let contestResultsMap = new Map();
                                let winnerID = contestResult[0][0].contestEntries.split(", ")[0].split(": ")[0];
                                for(let i = 0; i < contestResult[0][0].contestEntries.split(", ").length; i++) {
                                    entryIDsText += contestResult[0][0].contestEntries.split(", ")[i].split(": ")[0] + ", ";
                                    contestResultsMap[contestResult[0][0].contestEntries.split(", ")[i].split(": ")[0]] = contestResult[0][0].contestEntries.split(", ")[i].split(": ")[1];
                                    if(parseInt(contestResultsMap[winnerID]) < parseInt(contestResultsMap[contestResult[0][0].contestEntries.split(", ")[i].split(": ")[0]])) winnerID = contestResult[0][0].contestEntries.split(", ")[i].split(": ")[0];
                                }
                                entryIDsText = entryIDsText.substring(0, entryIDsText.length-2);

                                let entriesResult = await db.query(`SELECT * FROM guild_${message.guild.id} WHERE facetId IN (${entryIDsText})`);
        
                                if(!entriesResult[0] || entriesResult[0].length == 0) {
                                    message.channel.send("I honestly have no clue how this error could have happened.");
                                    return;
                                }
                                    
                                let resultsEmbed = new Discord.MessageEmbed()
                                    .setColor('#99ff00')
                                    .setTitle("Contest Results")
                                    .setDescription("Voting over! Below are the voting results.") // left off here, add vote check to args.length==2
                                    .setFooter("Use %wbcontest to start another contest!")
                                
                                let indexOfWinner; //god
                                for(var i = 0; i < entriesResult[0].length; i++) {
                                    let shortDesc = entriesResult[0][i].facetDesc.split(".")[0];
                                    if (shortDesc.length > 128) shortDesc = shortDesc.substring(0, 127);
                                    resultsEmbed.addFields(
                                        {name: 'ID #' + entriesResult[0][i].facetId + ": " + entriesResult[0][i].facetName, value: "Votes: " + contestResultsMap[entriesResult[0][i].facetId]}
                                    )
                                    if (entriesResult[0][i].facetId == winnerID) indexOfWinner = i;
                                }
                                resultsEmbed.addFields(
                                    {name: "Congratulations to " + this.client.users.cache.get(entriesResult[0][indexOfWinner].facetAuthor).tag + " for winning with entry [ID: " + entriesResult[0][indexOfWinner].facetId + " Name: " + entriesResult[0][indexOfWinner].facetName + "]! Here is your 50 energy points award.", value: "Play again soon!"}
                                )
                                message.channel.send(resultsEmbed);

                                let winnerResult = await db.query(`SELECT * FROM users WHERE userId = '${entriesResult[0][indexOfWinner].facetAuthor}'`)
                                if(!winnerResult[0] || winnerResult[0].length == 0) {
                                    message.channel.send("I honestly have no clue how this error could have happened.");
                                    return;
                                }
                                let newEnergy = winnerResult[0][0].energy + 50;
                                await db.query(`UPDATE users SET energy = ${newEnergy} WHERE userId = '${winnerResult[0][0].userId}'`);
                                await db.query(`UPDATE worlds SET isContestRunning = 0, contestEntries = NULL, contestTag = NULL, contestType = NULL WHERE guildId = '${message.guild.id}'`);
                            }, 180000); 
                        });   
                    }, 180000); 
                });
            }
        } catch(err) {
            console.log(err);
        }
        
    }
};

