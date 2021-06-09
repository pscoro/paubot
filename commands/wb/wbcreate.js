const Commando = require('discord.js-commando');
const Discord = require('discord.js');

let db;

let facetTypes = [
    "location", "entity", "object", "event", "other"
];

(async () => {
    db = await require("../../util/db");
})();

module.exports = class WBCreateCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: "wbcreate",
            aliases: ['wbc'],
            group: "wb",
            memberName: "wbcreate",
            description: "Creates new worldbuilding facet",
            details: "%wbcreate [type] [name (can be multiple words)]; [tags(s) (multiword, seperate with comma space)]; [description (multiword)].\nDon't forget to the trailing semicolon space on the specified arguments.\nType can be any one of [location, entity, object, event, other].\nMake sure you confirm the facet on the following prompt to create it.\nDescriptions can only be 1000 characters however, to add additional information, create a seperate section with %wbcreate section [ID of facet] [name of section]; [body text]",
            argsType: "multiple"
        })
    }

    async run(message, args) {
        try{
            await db.query(`SELECT * FROM users WHERE userId = '${message.author.id}'`).then(userResult => {
                if (userResult[0] && userResult[0].length > 0) { // do command

                    if (args.length > 2) {
                        // %wbcreate world [name]; [description]
                        if (args[0] === "world") {
                            db.query(`SELECT * FROM worlds WHERE guildId = '${message.guild.id}'`).then(result => {
                                if (result[0].length > 0) {
                                    if (result[0]) message.channel.send("A world has already been created for this server.");
                                } else {
                                    db.query(`SELECT * FROM users WHERE userId = '${message.author.id}'`).then(result => {
                                        if (result[0].length > 0) {
                                            if (result[0] && result[0][0].energy < 100) message.channel.send("Insufficient energy to create world. You need 100 energy points to create a world. You currently have " + JSON.stringify(result[0][0].energy));
                                            else {
                                                let nameText = "";
                                                let descText = "";
                                                let current = 1;
                                                
                                                while (current < args.length && !args[current].toString().endsWith(";")) {
                                                    args[current] = args[current].toString().replace(/'/g, "\\'");;
                                                    nameText += args[current].toString() + " ";
                                                    current++;
                                                }
                                                if (current < args.length) nameText += args[current].toString().substring(0,args[current].length-1);
                                                console.log(nameText);
                                                current++;
                                                while (current < args.length) {
                                                    args[current] = args[current].toString().replace(/'/g, "\\'");;
                                                    descText += args[current].toString() + " ";
                                                    current++;
                                                }
                                                descText = descText.trim();
                                            
                                                console.log(descText);
                                                db.query(`INSERT INTO worlds (guildId, worldName, worldDesc) VALUES('${message.guild.id}', '${nameText}', '${descText}')`);
                                                var createTable = "CREATE TABLE IF NOT EXISTS guild_" + message.guild.id.toString() + " (facetId INT NOT NULL PRIMARY KEY AUTO_INCREMENT, facetAuthor VARCHAR(100) NOT NULL, facetType VARCHAR(100) NOT NULL, facetName VARCHAR(100) NOT NULL, facetTags TEXT, facetDesc TEXT, facetLinks TEXT, facetMedia TEXT)";
                                                db.query(createTable);
                                                let newEnergy = result[0][0].energy - 100;
                                                db.query(`UPDATE users SET energy = '${newEnergy}' WHERE userId = '${message.author.id}'`);
                                                message.channel.send("World " + args[1] + " created for this server. Use %wbcreate to add facets to your new world. Use %help for more information.");
                                            }
                                        } else {
                                            message.channel.send("You must register before using PauBot's worldbuilding commands. Start by reading %wbrules carefully.");
                                        }
                                    }).catch(err => console.log(err));
        
                                    
                                }
                            }).catch(err => console.log(err));
                        }
                        
                        // %wbcreate [type] [name]; [tag(s)]; [description text]
                        else if (facetTypes.includes(args[0])) {
                            db.query(`SELECT * FROM users WHERE userId = '${message.author.id}'`).then(result => {
                                if (result[0].length > 0) {
                                    if (result[0] && result[0][0].energy < 5) message.channel.send("Insufficient energy to create facet. You need 5 energy points to create a facet. You currently have " + JSON.stringify(result[0][0].energy));
                                    else {
                                        let nameText = "";
                                        let tagsText = "";
                                        let descText = "";
                                        let current = 1;
                                        
                                        while (current < args.length && !args[current].toString().endsWith(";")) {
                                            args[current] = args[current].toString().replace(/'/g, "\\'");;
                                            nameText += args[current].toString() + " ";
                                            current++;
                                        }
                                        console.log(descText);
                                        if (current < args.length) nameText += args[current].toString().substring(0,args[current].length-1);
                                        current++;
        
                                        while (current < args.length && !args[current].toString().endsWith(";")) {
                                            args[current] = args[current].toString().replace(/'/g, "\\'");;
                                            tagsText += args[current].toString() + " ";
                                            current++;
                                        }
                                        if (current < args.length) tagsText += args[current].toString().substring(0,args[current].length-1);
                                        current++;
        
                                        while (current < args.length) {
                                            args[current] = args[current].toString().replace(/'/g, "\\'");;
                                            descText += args[current].toString() + " ";
                                            current++;
                                        }
                                        descText = descText.trim();

                                        if (descText.length > 1000) {
                                            message.channel.send("Body text can not be over 1000 characters because of discord embeds. Considering limiting the description section to 1000 characters and then adding additional sections with %wbcreate section [facet id] [name of section] [body text].");
                                        } else {
                                            const confirmEmbed = new Discord.MessageEmbed()
                                            .setColor('#99ff00')
                                            .setTitle('Confirm Facet Information')
                                            .setDescription('Confirm that the following information is correct by reacting with the checkmark below')
                                            .addFields(
                                                { name: 'Facet Type', value: args[0] },
                                                { name: 'Facet Name', value: nameText },                                       
                                                { name: 'Facet Tags (seperated by comma)', value: tagsText },                                       
                                                { name: 'Facet Description (first sentence should summarize the facet consicely for preview)', value: descText }                                       
                                            )
                                            message.channel.send(confirmEmbed)
                                            .then(function (botMessage) {
                                                botMessage.react("✅")
                                                botMessage.react("❌")
        
                                                const filter = (reaction, user) => {
                                                    return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
                                                };
        
                                                const collector = botMessage.createReactionCollector(filter, { time: 15000 });
        
                                                collector.on('collect', (reaction, reactionCollector) => {
                                                    if (reaction.emoji.name === '✅') {
                                                        collector.stop();
                                                        db.query(`INSERT INTO guild_${message.guild.id} (facetAuthor,facetType,facetName,facetTags,facetDesc) VALUES('${message.author.id}', '${args[0]}', '${nameText}', '${tagsText}', '${descText}')`)
                                                        .then(result => {
                                                            db.query(`SELECT * FROM guild_${message.guild.id} ORDER BY facetId DESC LIMIT 1`)   
                                                            .then(result => {
                                                                console.log(result[0]);
                                                                message.reply('Facet #' + result[0][0].facetId + ' created.');

                                                                db.query(`SELECT * FROM worlds WHERE guildId = '${message.guild.id}'`).then(guildResult => {
                                                                    if (guildResult[0] && guildResult[0].length > 0) {
                                                                        console.log(guildResult[0]);
                                                                        if (guildResult[0][0].isContestRunning == 1) {
                                                                            if(guildResult[0][0].contestType && guildResult[0][0].contestTag && guildResult[0][0].contestType.length > 0 && guildResult[0][0].contestTag.length > 0) {
                                                                                let tags = result[0][0].facetTags.split(", ");
                                                                            
                                                                                if (tags.includes(guildResult[0][0].contestTag) && result[0][0].facetType === guildResult[0][0].contestType) {
                                                                                    console.log("You got here");
                                                                                    let newContestEntriesText = "";
                                                                                    if (guildResult[0][0].contestEntries && guildResult[0][0].contestEntries.length > 0) {
                                                                                        if (guildResult[0][0].contestEntries == null || guildResult[0][0].contestEntries === "null") newContestEntriesText = result[0][0].facetId + ": 0";
                                                                                        else newContestEntriesText = guildResult[0][0].contestEntries + ", " + result[0][0].facetId + ": 0";
                                            
                                                                                        db.query(`UPDATE worlds SET contestEntries = '${newContestEntriesText}' WHERE guildId = '${message.guild.id}'`).then(() => {
                                                                                            message.reply("Your contest entry has been added.");
                                                                                        }).catch(err => console.log(err));
                                                                                    } else {
                                                                                        newContestEntriesText = result[0][0].facetId + ": 0";

                                                                                        db.query(`UPDATE worlds SET contestEntries = '${newContestEntriesText}' WHERE guildId = '${message.guild.id}'`).then(() => {
                                                                                            message.reply("Your contest entry has been added.");
                                                                                        }).catch(err => console.log(err));
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    } else {
                                                                        message.channel.send("A world has not yet been created for this server.");
                                                                    }
                                                                }).catch(err => console.log(err));
                                                            }).catch(err => console.log(err));
                                                        }).catch(err => console.log(err));
                                                        
                                                    } else if (reaction.emoji.name === '❌') {
                                                        collector.stop();
                                                        message.reply('Facet creation cancelled.');
                                                    }
                                                });
                                            }).catch(err => console.log(err));
                                        }
                                    }
                                } else {
                                    message.channel.send("You must register before using PauBot's worldbuilding commands. Start by reading %wbrules carefully.");
                                }
                            }).catch(err => console.log(err));
                        } else if (args[0] === "section") {
                            if (args.length > 3) {
                                if (Number.isInteger(parseInt(args[1]))) {
                                    db.query(`SELECT * FROM users WHERE userId = '${message.author.id}'`).then(result => {
                                        if (result[0].length > 0) {
                                            if (result[0] && result[0][0].energy < 5) message.channel.send("Insufficient energy to create section. You need 5 energy points to create a facet. You currently have " + JSON.stringify(result[0][0].energy));
                                            else {
                                                db.query(`SELECT * FROM guild_${message.guild.id} WHERE facetId = ${args[1]}`).then(result => {
                                                    if (result[0] && result[0].length > 0) {
                                                        let nameText = "";
                                                        let bodyText = "";
                                                        let current = 2;
                                                        
                                                        while (current < args.length && !args[current].toString().endsWith(";")) {
                                                            args[current] = args[current].toString().replace(/'/g, "\\'");;
                                                            nameText += args[current].toString() + " ";
                                                            current++;
                                                        }
                                                        if (current < args.length) nameText += args[current].toString().substring(0,args[current].length-1);
                                                        current++;
                                                        
                                                        while (current < args.length) {
                                                            args[current] = args[current].toString().replace(/'/g, "\\'");;
                                                            bodyText += args[current].toString() + " ";
                                                            current++;
                                                        }
                                                        bodyText = bodyText.trim();
                
                                                        if (bodyText.length > 1000) {
                                                            message.channel.send("Body text can not be over 1000 characters because of discord embeds. Considering limiting this section to 1000 characters and then adding additional sections with %wbcreate section [facet id] [name of section] [body text].");
                                                        } else {
                                                            const confirmEmbed = new Discord.MessageEmbed()
                                                            .setColor('#99ff00')
                                                            .setTitle('Confirm Section Information')
                                                            .setDescription('Confirm that the following information is correct by reacting with the checkmark below')
                                                            .addFields(
                                                                { name: 'Facet ID', value: args[1] },
                                                                { name: 'Section Name', value: nameText },                                     
                                                                { name: 'Body Text', value: bodyText }                                       
                                                            )
                                                            message.channel.send(confirmEmbed)
                                                            .then(function (botMessage) {
                                                                botMessage.react("✅")
                                                                botMessage.react("❌")
                        
                                                                const filter = (reaction, user) => {
                                                                    return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
                                                                };
                        
                                                                const collector = botMessage.createReactionCollector(filter, { time: 15000 });
                        
                                                                collector.on('collect', (reaction, reactionCollector) => {
                                                                    if (reaction.emoji.name === '✅') {
                                                                        collector.stop();
                                                                        db.query(`INSERT INTO guild_${message.guild.id} (facetAuthor,facetType,facetName,facetTags,facetDesc) VALUES('${message.author.id}', 'section', '${nameText}', '${args[1]}', '${bodyText}')`)
                                                                        .then(result => {
                                                                            db.query(`SELECT * FROM guild_${message.guild.id} ORDER BY facetId DESC LIMIT 1`)   
                                                                            .then(result => {
                                                                                console.log(result[0]);
                                                                                message.reply('Section ' + result[0][0].facetName + ' for ' + result[0][0].facetTags + ' created.');
                                                                            }).catch(err => console.log(err));
                                                                        }).catch(err => console.log(err));
                                                                        
                                                                    } else if (reaction.emoji.name === '❌') {
                                                                        collector.stop();
                                                                        message.reply('Facet creation cancelled.');
                                                                    }
                                                                });
                                                            }).catch(err => console.log(err));
                                                        }
                                                    } else {
                                                        message.channel.send("Invalid facet ID");
                                                    }
                                                }).catch(err => console.log(err));
                                            }
                                        } else {
                                            message.channel.send("You must register before using PauBot's worldbuilding commands. Start by reading %wbrules carefully.");
                                        }
                                    }).catch(err => console.log(err));
                                } else {
                                    message.channel.send("Invalid arguments");
                                }
                            } else {
                                message.channel.send("Invalid arguments");
                            }
                        } else {
                            message.channel.send("Invalid facet type specified in first argument, make sure you are using the syntax %wbcreate [type] [name]; [tag(s)]; [description text] and that type is one of location, entity, object, event, or other.");
                        }
                    } else {
                        message.channel.send("Not enough arguments!");
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

