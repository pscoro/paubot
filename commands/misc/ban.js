const Commando = require('discord.js-commando');
const Discord = require('discord.js');

let db;
let owner = '223493743162949633';

(async () => {
    db = await require("../../util/db");
})();

module.exports = class banCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: "ban",
            group: "misc",
            memberName: "ban",
            description: "bans a user from using bot commands, owner only.",
            argsType: "multiple"
        })
    }

    async run(message, args) {
        try {
            if (message.author.id.toString() != owner) {
                message.channel.send("You are not the owner.");
                return;
            }
            if (args[0] === "remove") {
                if(args[1].toString().startsWith("<") && args[1].toString().endsWith(">")) {
                    args[1] = args[1].replace(/\D/g,'');
                }
                let result = await db.query(`SELECT * FROM bans WHERE userId = '${args[1]}'`);
                if (!result[0] || result[0].length == 0) {
                    if (this.client.users.cache.get(args[1])) message.channel.send("User " + this.client.users.cache.get(args[1]).tag + " is not banned.");
                    else message.channel.send("User " + args[1] + " is not banned.");
                    return;
                } 
                await db.query(`DELETE FROM bans WHERE userId = '${args[1]}'`);
                if (this.client.users.cache.get(args[1])) message.channel.send("User " + this.client.users.cache.get(args[1]).tag + " has been unbanned.");
                else message.channel.send("User " + args[1] + " has been unbanned.");
            } else {
                if(args[0].toString().startsWith("<") && args[0].toString().endsWith(">")) {
                    args[0] = args[0].replace(/\D/g,'');
                }
    
                let result = await db.query(`SELECT * FROM bans WHERE userId = '${args[0]}'`)
                if (result[0] && result[0].length > 0) {
                    if (this.client.users.cache.get(args[0])) message.channel.send("User " + this.client.users.cache.get(args[0]).tag + " is already banned.");
                    else message.channel.send("User " + args[0] + " is already banned.");
                    return;  
                }
                let banUntil = Number.MAX_SAFE_INTEGER;
                if (args.length > 1) {
                    banUntil = Math.round(Date.now() / 1000) + (args[1].includes("d") ? parseInt(args[1].split("d")[0])*86400 : args[1].includes("h") ? parseInt(args[1].split("h")[0])*3600 : args[1].includes("m")*60 ? parseInt(args[1].split("m")[0]) : banUntil);
                }
                var d = new Date(0);
                d.setUTCSeconds(banUntil);
    
                if(args.length > 2) {
                    let banDesc = "";
                    let current = 2;
                    while (current < args.length) {
                        args[current] = args[current].toString().replace(/'/g, "\\'");;
                        banDesc += args[current].toString() + " ";
                        current++;
                    }
                    banDesc = banDesc.trim();
                    
                    await db.query(`INSERT INTO bans VALUES ('${args[0]}', ${banUntil}, '${banDesc}')`)
                    if (this.client.users.cache.get(args[0])) message.channel.send("User " + this.client.users.cache.get(args[0]).tag + " has been banned until " + d.toString() + " for reason: " + banDesc + ".");
                    else message.channel.send("User " + args[0] + " has been banned.");
                    await db.query(`DELETE FROM users WHERE userId = '${args[0]}'`);
                } else {
                    await db.query(`INSERT INTO bans (userId, banUntil) VALUES ('${args[0]}', ${banUntil})`)
                    if (this.client.users.cache.get(args[0])) message.channel.send("User " + this.client.users.cache.get(args[0]).tag + " has been banned until " + d.toString() + ".");
                    else message.channel.send("User " + args[0] + " has been banned.");
                    await db.query(`DELETE FROM users WHERE userId = '${args[0]}'`);
                }   
            }
        } catch(err) {
            console.log(err);
        } 
    }
};

