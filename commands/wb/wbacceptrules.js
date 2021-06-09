const Commando = require('discord.js-commando');
let db;

(async () => {
    db = await require("../../util/db");
})();

module.exports = class WBAcceptRulesCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: "wbacceptrules",
            aliases: ['wbar'],
            group: "wb",
            memberName: "wbacceptrules",
            description: "Use to accept the rules for worldbuilding and initialize your worldbuilding data",
            details: "Is this command saying you haven't read the rules? Here's a hint: read the rules and you'll find out why.",
            argsType: "multiple"
        })
    }

    async run(message, args) {
        let val = 100;
        try{
            if (args.length == 0) {
                message.channel.send("You're so silly! You didn't read the rules closely enough!");
                return;
            }
            if (args.length > 0) {
                if(args[0] != "awesomesauce") {
                    message.channel.send("You're so silly! You didn't read the rules closely enough!");
                    return;
                }
                let userResult = await db.query(`SELECT * FROM users WHERE userId = '${message.author.id}'`);
                if (userResult[0] && userResult[0].length > 0) {
                    message.channel.send("You have already accepted the rules.");
                    return;
                }
                let result = await db.query(`SELECT * FROM bans WHERE userId = '${message.author.id}'`);
                if (!result[0] || result[0].length == 0) {
                    await db.query(`INSERT INTO users VALUES('${message.author.id}', '${val}', 0, 0)`);
                    message.channel.send("Rules accepted by " + message.author.tag + "! Welcome to PauBot worldbuilding, here are 100 energy points to start.");
                    return;
                }
                if (result[0][0].banUntil - Math.round(Date.now() / 1000) > 0) {
                    message.reply("You are still banned! LOLOLOLOLOL");
                    return;
                }
                await db.query(`DELETE FROM bans WHERE userId = '${message.author.id}'`);
                await db.query(`INSERT INTO users VALUES('${message.author.id}', '${val}', 0, 0)`);
                message.channel.send("Rules accepted by " + message.author.tag + "! Welcome to PauBot worldbuilding, here are 100 energy points to start.");  
            }
        } catch(err) {
            console.log(err);
        }
    }
};

