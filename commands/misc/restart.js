const Commando = require('discord.js-commando');
const Discord = require('discord.js');
let db;
let owner = '223493743162949633';
const TOKEN = process.env.TOKEN;

(async () => {
    db = await require("../../util/db");
})();

module.exports = class restartCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: "restart",
            group: "misc",
            memberName: "restart",
            description: "restarts bot, owner only.",
            argsType: "multiple"
        })
    }

    async run(message, args) {
        
        if (message.author.id.toString() != owner) {
            message.channel.send("You are not owner.");
            return;
        }
        message.channel.send('Restarting...')
            .then(() => 
                this.client.destroy())
            .then(() => 
                this.client.login(TOKEN)
            );
      
    }
};

