const Commando = require('discord.js-commando');
let db;

(async () => {
    db = await require("../../util/db");
})();

module.exports = class balCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: "bal",
            group: "econ",
            memberName: "bal",
            description: "Returns current energy balance of a user",
            details: "%bal returns your balance. %bal [ID] or %bal [user tag] returns the balance of a user.",
            argsType: "multiple"
        })
    }

    async run(message, args) {
        console.log(this.client.owner);
        let val = 0;
        try{
            if (args.length == 0) {
                await db.query(`SELECT * FROM users WHERE userId = '${message.author.id}'`).then(result => {
                    if (result[0].length == 0) {
                        message.reply("You have not been registered yet! Please start by typing %wbrules and reading them carefully.");
                    } else {
                        message.channel.send("Balance for " + message.author.tag + ": " + result[0][0].energy + " energy points.");
                    }
                    
                }).catch(err => console.log(err));
            } else if (args.length > 0) {
                console.log(args[0].toString());
                if(args[0].toString().startsWith("<") && args[0].toString().endsWith(">")) {
                    args[0] = args[0].replace(/\D/g,'');
                    console.log(args[0]);
                }
                await db.query(`SELECT * FROM users WHERE userId = '${args[0]}'`).then(result => {
                    if (result[0].length == 0) {
                        message.channel.send("Invalid or unregistered user.");
                    } else {
                        message.channel.send("Balance for " + this.client.users.cache.get(args[0]).tag + ": " + result[0][0].energy + " energy points.");
                    }
                }).catch(err => console.log(err));
            }
        } catch(err) {
            console.log(err);
        }
        
    }
};

