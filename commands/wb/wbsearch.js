const Commando = require('discord.js-commando');
const Discord = require('discord.js');
let db;

(async () => {
    db = await require("../../util/db");
})();

module.exports = class WBSearchCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: "wbsearch",
            aliases: ['wbs'],
            group: "wb",
            memberName: "wbsearch",
            description: "Search for facets by tag, name, type, or author.",
            details: "%wbsearch tag [tag (multiword)] to search for near matches by tag, will return results with an exact or similar tag.\n%wbsearch name [name (multiword)], will return results with the exact or similar name.\n%wbsearch type [type], will return results of the exact type.\n%wbsearch author [tag or user ID], will return results authored by the exact user.",
            argsType: "multiple"
        })
    }

    async run(message, args) {
        try{
            await db.query(`SELECT * FROM users WHERE userId = '${message.author.id}'`).then(userResult => {
                if (userResult[0] && userResult[0].length > 0) { // do command
                    if (args.length > 1) {
                        if (args[0] === "tag") {
                            let tagText = "";
                            let current = 1;
                            while (current < args.length) {
                                args[current] = args[current].toString().replace(/'/g, "\\'");;
                                tagText += args[current].toString() + " ";
                                    current++;
                            }
                            tagText = tagText.trim();
                            tagText = tagText.replace(/[^\w\s]/gi, '');
                            tagText = tagText.toLowerCase();
        
                            db.query(`SELECT * FROM guild_${message.guild.id}`).then(result => {
                                let matchIDs = [];
                                if (result[0] && result[0].length > 0) {
        
                                    // loop entries
                                    for(var i = 0; i < result[0].length; i++) {

                                        if(result[0][i].facetType != "section") {
                                              // if have tags
                                            if (result[0][0].facetTags && result[0][i].facetTags.length > 0) {
                                            
            
            
                                                // loop tags in entry
                                                loop1:
                                                for (var j = 0; j < result[0][i].facetTags.split(", ").length; j++) {
                                                    let currentTag = result[0][i].facetTags.split(", ")[j].replace(/[^\w\s]/gi, '').toLowerCase();
            
                                                    console.log(tagText + " " + currentTag);
            
                                                    if (currentTag === tagText || // exact match
                                                        currentTag.substring(0, currentTag.length-1) === tagText || // match minus trailing "s" in one of the two
                                                        currentTag === tagText.substring(0, tagText.length-1)
                                                        ) {
                                                            matchIDs.push(result[0][i].facetId);
                                                            break loop1;                                            
                                                    }
            
                                                    // loop words in tag
                                                    for (var k = 1; k < currentTag.split(" ").length; k++) {
                                                        if (currentTag.split(" ")[k] === tagText || // exact match
                                                            currentTag.split(" ")[k].substring(0, currentTag.length-1) === tagText || // match minus trailing "s" in one of the two
                                                            currentTag.split(" ")[k] === tagText.substring(0, tagText.length-1)
                                                            ) {
                                                                matchIDs.push(result[0][i].facetId);
                                                                break loop1;                                            
                                                        }
                                                    }
            
                                                    // loop args
                                                    for (var k = 1; k < args.length; k++) {
                                                        
                                                    console.log("arg " + args[k] + " " + currentTag);
            
            
                                                        // all tag match possibilit
                                                        if (currentTag === args[k].toLowerCase() ||
                                                            currentTag.substring(0, currentTag-1) === args[k].toLowerCase() || // match minus trailing "s" in one of the two
                                                            currentTag === args[k].substring(0, args[k].length-1).toLowerCase() ||
                                                            currentTag === args[k].replace(/[^\w\s]/gi, '').toLowerCase() || // match minus trailing "s" in one of the two
                                                            currentTag === args[k].substring(0, args[k].length-1).replace(/[^\w\s]/gi, '').toLowerCase() ||
                                                            currentTag.substring(0, currentTag-1) === args[k].replace(/[^\w\s]/gi, '').toLowerCase() || // match minus trailing "s" in one of the two
                                                            currentTag === args[k].substring(0, args[k].length-1).replace(/[^\w\s]/gi, '').toLowerCase()
                                                        ) {
                                                                matchIDs.push(result[0][i].facetId);
                                                                break loop1;
                                                        }
            
                                                        for (var l = 1; l < currentTag.split(" ").length; l++) {
                                                            if (currentTag.split(" ")[l] === args[k].toLowerCase() ||
                                                                currentTag.split(" ")[l].substring(0, currentTag-1) === args[k].toLowerCase() || // match minus trailing "s" in one of the two
                                                                currentTag.split(" ")[l] === args[k].substring(0, args[k].length-1).toLowerCase() ||
                                                                currentTag.split(" ")[l] === args[k].replace(/[^\w\s]/gi, '').toLowerCase() || // match minus trailing "s" in one of the two
                                                                currentTag.split(" ")[l] === args[k].substring(0, args[k].length-1).replace(/[^\w\s]/gi, '').toLowerCase() ||
                                                                currentTag.split(" ")[l].substring(0, currentTag-1) === args[k].replace(/[^\w\s]/gi, '').toLowerCase() || // match minus trailing "s" in one of the two
                                                                currentTag.split(" ")[l] === args[k].substring(0, args[k].length-1).replace(/[^\w\s]/gi, '').toLowerCase()
                                                            ) {
                                                                matchIDs.push(result[0][i].facetId);
                                                                break loop1;
                                                            }
                                                        }
                                                    }
                                                }
                                            }              
                                        }
                                    }
        
                                    if (matchIDs.length > 0) {
                                        let IDsText = "";
                                        for(var i = 0; i < matchIDs.length; i++) {
                                            IDsText += matchIDs[i] + ", ";
                                        }
                                        IDsText = IDsText.substring(0, IDsText.length-2);
                                        db.query(`SELECT * FROM guild_${message.guild.id} WHERE facetId IN (${IDsText})`).then((result2) => {
                                            if(result2[0] && result2[0].length > 0) {
        
                                                let searchEmbed = new Discord.MessageEmbed()
                                                    .setColor('#99ff00')
                                                    .setTitle("Search results for tag " + tagText)
                                                    .setDescription('Includes exact or similar results')
                                                    .setFooter('You can use %wbview to view any of these facets', 'https://cdn.discordapp.com/app-icons/592736284816965663/8223af4828cc8d2db1c5fffcca3acfa0.png?size=512');
                                                
        
                                                for(var i = 0; i < result2[0].length; i++) {
                                                    let shortDesc = result2[0][i].facetDesc.split(".")[0];
                                                    if (shortDesc.length > 128) shortDesc = shortDesc.substring(0, 127);
                                                    searchEmbed.addFields(
                                                        {name: 'ID #' + result2[0][i].facetId + ": " + result2[0][i].facetName, value: "Type: " + result2[0][i].facetType + "\nTags: " + result2[0][i].facetTags + "\n" + shortDesc}
                                                    )
                                                }
                                                message.channel.send(searchEmbed);
                                            } else {
                                                message.channel.send("No search results were found.");
                                            }
                                        }).catch(err => console.log(err));
                                    } else {
                                        message.channel.send("No search results were found.");
                                    }
                                } else {
                                    message.channel.send("No results found");
                                }
                            }).catch(err => console.log(err));
        
                        } else if (args[0] === "name") {
                            let nameText = "";
                            let current = 1;
                            while (current < args.length) {
                                args[current] = args[current].toString().replace(/'/g, "\\'");;
                                nameText += args[current].toString() + " ";
                                    current++;
                            }
                            nameText = nameText.trim();
                            nameText = nameText.replace(/[^\w\s]/gi, '').toLowerCase();
        
                            db.query(`SELECT * FROM guild_${message.guild.id}`).then(result => {
                                let matchIDs = [];
                                if (result[0] && result[0].length > 0) {
        
                                    // loop entries
                                    for(var i = 0; i < result[0].length; i++) {
                                        if(result[0][i].facetType != "section") {
                                            // if has name
                                            if (result[0][0].facetName && result[0][i].facetName.length > 0) {
                                                let name = result[0][i].facetName.replace(/[^\w\s]/gi, '').toLowerCase();
            
                                                console.log(nameText + " " + name);
            
                                                if (name === nameText || // exact match
                                                    name.substring(0, name.length-1) === nameText || // match minus trailing "s" in one of the two
                                                    name === nameText.substring(0, nameText.length-1)
                                                    ) {
                                                        matchIDs.push(result[0][i].facetId);              
                                                }
            
                                                // loop words in name
                                                for (var k = 1; k < name.split(" ").length; k++) {
                                                    if (name.split(" ")[k] === nameText || // exact match
                                                        name.split(" ")[k].substring(0, name.length-1) === nameText || // match minus trailing "s" in one of the two
                                                        name.split(" ")[k] === nameText.substring(0, nameText.length-1)
                                                        ) {
                                                            matchIDs.push(result[0][i].facetId);
                                                            break;                                            
                                                    }
                                                }
            
                                                // loop args
                                                for (var k = 1; k < args.length; k++) {
                                                    
                                                console.log("arg " + args[k] + " " + name);
            
            
                                                    // all tag match possibilit
                                                    if (name === args[k].toLowerCase() ||
                                                        name.substring(0, name-1) === args[k].toLowerCase() || // match minus trailing "s" in one of the two
                                                        name === args[k].substring(0, args[k].length-1).toLowerCase() ||
                                                        name === args[k].replace(/[^\w\s]/gi, '').toLowerCase() || // match minus trailing "s" in one of the two
                                                        name === args[k].substring(0, args[k].length-1).replace(/[^\w\s]/gi, '').toLowerCase() ||
                                                        name.substring(0, name-1) === args[k].replace(/[^\w\s]/gi, '').toLowerCase() || // match minus trailing "s" in one of the two
                                                        name === args[k].substring(0, args[k].length-1).replace(/[^\w\s]/gi, '').toLowerCase()
                                                    ) {
                                                            matchIDs.push(result[0][i].facetId);
                                                            break;
                                                    }
            
                                                    for (var l = 1; l < name.split(" ").length; l++) {
                                                        if (name.split(" ")[l] === args[k].toLowerCase() ||
                                                            name.split(" ")[l].substring(0, name-1) === args[k].toLowerCase() || // match minus trailing "s" in one of the two
                                                            name.split(" ")[l] === args[k].substring(0, args[k].length-1).toLowerCase() ||
                                                            name.split(" ")[l] === args[k].replace(/[^\w\s]/gi, '').toLowerCase() || // match minus trailing "s" in one of the two
                                                            name.split(" ")[l] === args[k].substring(0, args[k].length-1).replace(/[^\w\s]/gi, '').toLowerCase() ||
                                                            name.split(" ")[l].substring(0, name-1) === args[k].replace(/[^\w\s]/gi, '').toLowerCase() || // match minus trailing "s" in one of the two
                                                            name.split(" ")[l] === args[k].substring(0, args[k].length-1).replace(/[^\w\s]/gi, '').toLowerCase()
                                                        ) {
                                                            matchIDs.push(result[0][i].facetId);
                                                            break;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
        
                                    if (matchIDs.length > 0) {
                                        let IDsText = "";
                                        for(var i = 0; i < matchIDs.length; i++) {
                                            IDsText += matchIDs[i] + ", ";
                                        }
                                        IDsText = IDsText.substring(0, IDsText.length-2);
                                        db.query(`SELECT * FROM guild_${message.guild.id} WHERE facetId IN (${IDsText})`).then((result2) => {
                                            if(result2[0] && result2[0].length > 0) {
        
                                                let searchEmbed = new Discord.MessageEmbed()
                                                    .setColor('#99ff00')
                                                    .setTitle("Search results for name " + nameText)
                                                    .setDescription('Includes exact or similar results')
                                                    .setFooter('You can use %wbview to view any of these facets', 'https://cdn.discordapp.com/app-icons/592736284816965663/8223af4828cc8d2db1c5fffcca3acfa0.png?size=512');
                                                
        
                                                for(var i = 0; i < result2[0].length; i++) {
                                                    let shortDesc = result2[0][i].facetDesc.split(".")[0];
                                                    if (shortDesc.length > 128) shortDesc = shortDesc.substring(0, 127);
                                                    searchEmbed.addFields(
                                                        {name: 'ID #' + result2[0][i].facetId + ": " + result2[0][i].facetName, value: "Type: " + result2[0][i].facetType + "\nTags: " + result2[0][i].facetTags + "\n" + shortDesc}
                                                    )
                                                }
                                                message.channel.send(searchEmbed);
                                            } else {
                                                message.channel.send("No search results were found.");
                                            }
                                        }).catch(err => console.log(err));
                                    } else {
                                        message.channel.send("No search results were found.");
                                    }
        
                                    
        
                                    
        
                                    
                                    // for (var i = 0; i < result[0].length; i++) {
                                    //     let shortDesc = result[0][i].facetDesc.split(".")[0];
                                    //     if (shortDesc.length > 128) shortDesc = shortDesc.substring(0, 127);
                                    //     searchEmbed.addFields(
                                    //         {name: 'ID #' + result[0][i].facetId, value: "Type: " + result[0][i].facetType + "\nTags: " + result[0][i].facetTags + "\n" + shortDesc}
                                    //     )
                                    // }
        
        
                                    // message.channel.send(searchEmbed);
                                } else {
                                    message.channel.send("No results found");
                                }
                            }).catch(err => console.log(err));
        
        
                        } else if (args[0] === "type") {
                            if(args[1] === "location" || args[1] === "entity" || args[1] === "object" || args[1] === "event" || args[1] === "other") {
                                db.query(`SELECT * FROM guild_${message.guild.id} WHERE facetType = '${args[1]}'`).then(result => {
                                    if (result[0] && result[0].length > 0) {
                                        let searchEmbed = new Discord.MessageEmbed()
                                            .setColor('#99ff00')
                                            .setTitle("Search results for type " + args[1])
                                            .setDescription('Includes exact results')
                                            .setFooter('You can use %wbview to view any of these facets', 'https://cdn.discordapp.com/app-icons/592736284816965663/8223af4828cc8d2db1c5fffcca3acfa0.png?size=512');
                                        
        
                                        for(var i = 0; i < result[0].length; i++) {
                                            let shortDesc = result[0][i].facetDesc.split(".")[0];
                                            if (shortDesc.length > 128) shortDesc = shortDesc.substring(0, 127);
                                            searchEmbed.addFields(
                                                {name: 'ID #' + result[0][i].facetId + ": " + result[0][i].facetName, value: "Type: " + result[0][i].facetType + "\nTags: " + result[0][i].facetTags + "\n" + shortDesc}
                                            )
                                        }
                                        message.channel.send(searchEmbed);
                                    } else {
                                        message.channel.send("No facets exist of that type.");
                                    }
                                }).catch(err => console.log(err));
                            } else {
                                message.channel.send("Invalid type.");
                            }
        
                        } else if (args[0] === "author") {
                            if(args[1].toString().startsWith("<") && args[1].toString().endsWith(">")) {
                                args[1] = args[1].replace(/\D/g,'');
                            }
        
                            db.query(`SELECT * FROM guild_${message.guild.id} WHERE facetAuthor = '${args[1]}'`).then(result => {
                                if (result[0] && result[0].length > 0) {
                                    let searchEmbed = new Discord.MessageEmbed()
                                        .setColor('#99ff00')
                                        .setTitle("Search results for author " + args[1])
                                        .setDescription('Includes exact results')
                                        .setFooter('You can use %wbview to view any of these facets', 'https://cdn.discordapp.com/app-icons/592736284816965663/8223af4828cc8d2db1c5fffcca3acfa0.png?size=512');
                                    
        
                                    for(var i = 0; i < result[0].length; i++) {
                                        let shortDesc = result[0][i].facetDesc.split(".")[0];
                                        if (shortDesc.length > 128) shortDesc = shortDesc.substring(0, 127);
                                        searchEmbed.addFields(
                                            {name: 'ID #' + result[0][i].facetId + ": " + result[0][i].facetName, value: "Type: " + result[0][i].facetType + "\nTags: " + result[0][i].facetTags + "\n" + shortDesc}
                                        )
                                    }
                                    message.channel.send(searchEmbed);
                                } else {
                                    message.channel.send("No facets exist of that author.");
                                }
                            }).catch(err => console.log(err));
                        } else {
                            message.channel.send("Invalid arguments.");
                        }
                    } else {
                        message.channel.send("Invalid arguments.");
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

