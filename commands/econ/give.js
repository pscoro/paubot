const Commando = require('discord.js-commando');
let db;

(async () => {
    db = await require("../../util/db");
})();

module.exports = class giveCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: "give",
            group: "econ",
            memberName: "give",
            description: "Gives a user energy points from your balance.",
            details: "%give [user ID or tag] [number of points (int)] inserts into users balance number of points subtracted from your balance.",
            argsType: "multiple"
        })
    }

    async run(message, args) {
        try{
            if (args.length === 2) {
                await db.query(`SELECT * FROM users WHERE userId = '${message.author.id}'`).then(result => {
                    if (result[0].length == 0) {
                        message.reply("You have not been registered yet! Please start by typing %wbrules and reading them carefully.");
                    } else {
                        if(args[0].toString().startsWith("<") && args[0].toString().endsWith(">")) {
                            args[0] = args[0].replace(/\D/g,'');
                        }
                        db.query(`SELECT * FROM users WHERE userId = '${args[0]}'`).then(result2 => {
                            if (result2[0] && result2[0].length > 0) {
                                if (Number.isInteger(parseInt(args[1]))) {
                                    if(result[0][0].energy - args[1] >= 0) {
                                        let user1Bal = result[0][0].energy - args[1];
                                        let user2Bal = result2[0][0].energy
                                        db.query(`UPDATE users SET energy = ${user1Bal} WHERE userId = '${result[0][0].userId}'`).then(result3 => {
                                            db.query(`UPDATE users SET energy = ${user2Bal} WHERE userId = '${result2[0][0].userId}'`).then(result4 => {
                                                message.channel.send("Sent " + args[1] + " energy points from " + this.client.users.cache.get(result[0][0].userId).tag + " to " + this.client.users.cache.get(result2[0][0].userId).tag + ".");
                                            }).catch(err => console.log(err));
                                        }).catch(err => console.log(err));
                                    } else {
                                        message.channel.send("You do not have enough energy points to make that transaction.");
                                    }
                                } else {
                                    message.channel.send("Invalid arguments.");
                                }
                            } else {
                                message.channel.send("Invalid or unregistered user.");
                            }
                        }).catch(err => console.log(err));
                    }
                    
                }).catch(err => console.log(err));
            } else {
                message.channel.send("Invalid arguments.");
            }
        } catch(err) {
            console.log(err);
        }
        
    }
};

