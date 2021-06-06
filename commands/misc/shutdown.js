const Commando = require('discord.js-commando');
const Discord = require('discord.js');
let db;
let owner = '223493743162949633';

(async () => {
    db = await require("../../util/db");
})();

module.exports = class shutdownCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: "shutdown",
            group: "misc",
            memberName: "shutdown",
            description: "shuts down bot, owner only.",
            argsType: "multiple"
        })
    }

    async run(message, args) {
        
        if (message.author.id.toString() === owner) {
            message.channel.send('Shutting down...').then(m => {
                this.client.destroy();
            });
        } else {
            message.channel.send("You are not owner.");
        }
      
    }
};

