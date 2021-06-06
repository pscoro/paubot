const Commando = require('discord.js-commando');
const Discord = require('discord.js');
let db;
let firstImage = "https://cdn.discordapp.com/attachments/848984519763034185/850184565661237269/wbmedia.png";

let viewEmbed = new Discord.MessageEmbed();
let searchEmbed = new Discord.MessageEmbed();

(async () => {
    db = await require("../../util/db");
})();

module.exports = class WBViewCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: "wbview",
            aliases: ['wbv'],
            group: "wb",
            memberName: "wbview",
            description: "Displays a facet, can find a facet by ID or name",
            details: "%wbview [ID] to view a facet by ID.\n%wbview [name (multiword)] to view a facet by name, if multiple facets with the same name exist a search result embed will prompt you to use %wbview [ID] with one of the options.",
            argsType: "multiple"
        })
    }

    async run(message, args) {
        try{
            await db.query(`SELECT * FROM users WHERE userId = '${message.author.id}'`).then(userResult => {
                if (userResult[0] && userResult[0].length > 0) { // do command

                    if (Number.isInteger(parseInt(args[0]))) {
                        db.query(`SELECT * FROM guild_${message.guild.id} WHERE facetId = ${args[0]}`).then(result => {
                            console.log(result[0]);
                            if (result[0] && result[0].length > 0) {
                                if (result[0][0].facetType == "section") {
                                    message.channel.send("Oop! You searched for the ID of a facet section, to view this section simply search for the ID of the actual facet instead (Hint: section IDs are hidden anyway)");
                                } else {
                                    if(result[0][0].facetMedia && result[0][0].facetMedia.length > 0) {
                                        firstImage = result[0][0].facetMedia.split(", ")[0].split(": ")[0];
                                    } else {
                                        firstImage = "https://cdn.discordapp.com/attachments/848984519763034185/850184565661237269/wbmedia.png";
                                    }
        
                                    let linksText = "No links provided. Consider adding one with %wblink [first ID] [second ID] [description of relationship]";
                                    if(result[0][0].facetLinks && result[0][0].facetLinks.length > 0) {
                                        linksText = " ";
                                        let links = result[0][0].facetLinks.split(", ");
                                        let linkIDsList = "";
                                        let linkMap = new Map();
                                        for(var i = 0; i < links.length; i++) {
                                            linkIDsList += links[i].split(": ")[0] + ", ";
                                            linkMap[parseInt(links[i].split(": ")[0])] = links[i].split(": ")[1];
                                        }
                                        linkIDsList = linkIDsList.substring(0, linkIDsList.length-2);
                                        console.log(linkIDsList);
                                        db.query(`SELECT * FROM guild_${message.guild.id} WHERE facetId IN (${linkIDsList})`).then((result2) => {
                                            console.log("TEST");
                                            if(result2[0] && result2[0].length > 0) {
                                                for(var i = 0; i < result2[0].length; i++) {
                                                    linksText += "ID #" + result2[0][i].facetId + " " + result2[0][i].facetName + ": " + linkMap[result2[0][i].facetId] + "\n";
                                                    
                                                    console.log(linksText);
                                                }
                                                
                                            }
                                            viewEmbed = new Discord.MessageEmbed()
                                                .setColor('#99ff00')
                                                .setTitle(result[0][0].facetName)
                                                .setDescription('ID #' + result[0][0].facetId)
                                                .addFields(
                                                    { name: 'Author', value: this.client.users.cache.get(result[0][0].facetAuthor).tag },
                                                    { name: 'Type', value: result[0][0].facetType },
                                                    { name: 'Tag(s)', value: result[0][0].facetTags },
                                                    { name: 'Description', value: result[0][0].facetDesc },
                                                    { name: 'Related Links', value: linksText}
                                                )
                                                .setImage(firstImage)
                                                .setFooter('Consider using imgur to host media', 'https://cdn.discordapp.com/app-icons/592736284816965663/8223af4828cc8d2db1c5fffcca3acfa0.png?size=512');
                                                
                                            db.query(`SELECT * FROM guild_${message.guild.id} WHERE facetTags = '${result[0][0].facetId}' AND facetType = 'section'`).then(sectionResult => {
                                                if (sectionResult[0] && sectionResult[0].length > 0) {
                                                    for(var i = 0; i < sectionResult[0].length; i++) {
                                                        viewEmbed
                                                            .addFields(
                                                                {name: sectionResult[0][0].facetName, value: sectionResult[0][0].facetDesc }
                                                            )
                                                    }
                                                    message.channel.send(viewEmbed);

                                                } else {
                                                    message.channel.send(viewEmbed);
                                                }
                                            }).catch(err => console.log(err));

                                            
                                        }).catch(err => console.log(err));
                                    } else {
                                        viewEmbed = new Discord.MessageEmbed()
                                                .setColor('#99ff00')
                                                .setTitle(result[0][0].facetName)
                                                .setDescription('ID #' + result[0][0].facetId)
                                                .addFields(
                                                    { name: 'Author', value: this.client.users.cache.get(result[0][0].facetAuthor).tag },
                                                    { name: 'Type', value: result[0][0].facetType },
                                                    { name: 'Tag(s)', value: result[0][0].facetTags },
                                                    { name: 'Description', value: result[0][0].facetDesc },
                                                    { name: 'Related Links', value: linksText}
                                                )
                                                .setImage(firstImage)
                                                .setFooter('Consider using imgur to host media', 'https://cdn.discordapp.com/app-icons/592736284816965663/8223af4828cc8d2db1c5fffcca3acfa0.png?size=512');
        
                                            message.channel.send(viewEmbed);
                                    }
                                }
                            } else {
                                message.channel.send("No facet with that ID found.");
                            }
                        }).catch(err => console.log(err));
                    } else {
                        let nameText = "";
                        let current = 0;
                        
                        while (current < args.length) {
                            args[current] = args[current].toString().replace(/'/g, "\\'");;
                            nameText += args[current].toString() + " ";
                            current++;
                        }
                        nameText = nameText.trim();
        
                        db.query(`SELECT * FROM guild_${message.guild.id} WHERE LOWER(facetName) = '${nameText.toLowerCase()}'`).then(result => {
                            console.log(result[0]);
                            if (result[0].length > 1) {
                                if(result[0]) {
                                    searchEmbed = new Discord.MessageEmbed()
                                        .setColor('#99ff00')
                                        .setTitle("There are multiple facets with the name " + nameText)
                                        .setDescription('Please use %wbview [ID] with one of the ID\'s below')
                                        .setFooter('You can also use %wbsearch for additional searching options', 'https://cdn.discordapp.com/app-icons/592736284816965663/8223af4828cc8d2db1c5fffcca3acfa0.png?size=512');
                                    
                                    for (var i = 0; i < result[0].length; i++) {
                                        let shortDesc = result[0][i].facetDesc.split(".")[0];
                                        if (shortDesc.length > 128) shortDesc = shortDesc.substring(0, 127);
                                        searchEmbed.addFields(
                                            {name: 'ID #' + result[0][i].facetId, value: "Type: " + result[0][i].facetType + "\nTags: " + result[0][i].facetTags + "\n" + shortDesc}
                                        )
                                    }
                                    message.channel.send(searchEmbed);
                                }
                            } else if (result[0].length > 0) {
                                if (result[0]) {
                                    if(result[0][0].facetMedia && result[0][0].facetMedia.length > 0) {
                                        firstImage = result[0][0].facetMedia.split(", ")[0].split(": ")[0];
                                    } else {
                                        firstImage = "https://cdn.discordapp.com/attachments/848984519763034185/850184565661237269/wbmedia.png";
                                    }
                                    let linksText = "No links provided. Consider adding one with %wblink [first ID] [second ID] [description of relationship]";
                                    if(result[0][0].facetLinks && result[0][0].facetLinks.length > 0) {
                                        linksText = "";
                                        let links = result[0][0].facetLinks.split(", ");
                                        let linkIDsList = "";
                                        let linkMap = new Map();
                                        for(var i = 0; i < links.length; i++) {
                                            linkIDsList += links[i].split(": ")[0] + ", ";
                                            linkMap[parseInt(links[i].split(": ")[0])] = links[i].split(": ")[1];
                                        }
                                        linkIDsList = linkIDsList.substring(0, linkIDsList.length-2);
                                        console.log(linkIDsList);
                                        db.query(`SELECT * FROM guild_${message.guild.id} WHERE facetId IN (${linkIDsList})`).then((result2) => {
                                            if(result2[0] && result2[0].length > 0) {
                                                if(result2[0] && result2[0].length > 0) {
                                                    for(var i = 0; i < result2[0].length; i++) {
                                                        linksText += "ID #" + result2[0][i].facetId + " " + result2[0][i].facetName + ": " + linkMap[result2[0][i].facetId] + "\n";
                                                        
                                                        console.log(linksText);
                                                    }
                                                    
                                                }
                                            }
                                            viewEmbed = new Discord.MessageEmbed()
                                                .setColor('#99ff00')
                                                .setTitle(result[0][0].facetName)
                                                .setDescription('ID #' + result[0][0].facetId)
                                                .addFields(
                                                    { name: 'Author', value: this.client.users.cache.get(result[0][0].facetAuthor).tag },
                                                    { name: 'Type', value: result[0][0].facetType },
                                                    { name: 'Tag(s)', value: result[0][0].facetTags },
                                                    { name: 'Description', value: result[0][0].facetDesc },
                                                    { name: 'Related Links', value: linksText}
                                                )
                                                .setImage(firstImage)
                                                .setFooter('Consider using imgur to host media', 'https://cdn.discordapp.com/app-icons/592736284816965663/8223af4828cc8d2db1c5fffcca3acfa0.png?size=512');
                
                                                db.query(`SELECT * FROM guild_${message.guild.id} WHERE facetTags = '${result[0][0].facetId}' AND facetType = 'section'`).then(sectionResult => {
                                                    if (sectionResult[0] && sectionResult[0].length > 0) {
                                                        for(var i = 0; i < sectionResult[0].length; i++) {
                                                            viewEmbed
                                                                .addFields(
                                                                    {name: sectionResult[0][0].facetName, value: sectionResult[0][0].facetDesc }
                                                                )
                                                        }
                                                        message.channel.send(viewEmbed);
    
                                                    } else {
                                                        message.channel.send(viewEmbed);
                                                    }
                                                }).catch(err => console.log(err));
                                            
                                        }).catch(err => console.log(err));
                                    }
                                }
                            } else {
                                message.channel.send("No facets with that name found.");
                            }
                        }).catch(err => console.log(err));
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

