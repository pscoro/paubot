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
            if (args.length != 2) {
                message.channel.send("Invalid arguments.");
                return;
            }
            let result = await db.query(`SELECT * FROM users WHERE userId = '${message.author.id}'`)
            if (result[0].length == 0) {
                message.reply("You have not been registered yet! Please start by typing %wbrules and reading them carefully.");
                return;
            }
            if(args[0].toString().startsWith("<") && args[0].toString().endsWith(">")) {
                args[0] = args[0].replace(/\D/g,'');
            }
            let result2 = await db.query(`SELECT * FROM users WHERE userId = '${args[0]}'`); 
            if (!result2[0] || result2[0].length == 0) {
                message.channel.send("Invalid or unregistered user.");
                return;  
            } 
            if (!Number.isInteger(parseInt(args[1]))) {
                message.channel.send("Invalid arguments.");
                return;
            }
            if(result[0][0].energy - args[1] < 0) {
                message.channel.send("You do not have enough energy points to make that transaction.");
                return;
            }
            let user1Bal = result[0][0].energy - args[1];
            let user2Bal = result2[0][0].energy;
            await db.query(`UPDATE users SET energy = ${user1Bal} WHERE userId = '${result[0][0].userId}'`);
            await db.query(`UPDATE users SET energy = ${user2Bal} WHERE userId = '${result2[0][0].userId}'`);
            message.channel.send("Sent " + args[1] + " energy points from " + this.client.users.cache.get(result[0][0].userId).tag + " to " + this.client.users.cache.get(result2[0][0].userId).tag + ".");
            
        } catch(err) {
            console.log(err);
        }
    }
};

