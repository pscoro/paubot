const Commando = require("discord.js-commando");
const Discord = require("discord.js");
let db;

const rulesEmbed = new Discord.MessageEmbed()
  .setColor("#99ff00")
  .setTitle("PauBot WorldBuilding Rules")
  .setDescription(
    "Please read the entirety of the rules carefully and then reply with %wbacceptrules to begin using PauBot's worldbuilding features."
  )
  .setThumbnail(
    "https://cdn.discordapp.com/app-icons/592736284816965663/8223af4828cc8d2db1c5fffcca3acfa0.png?size=512"
  )
  .addFields(
    {
      name: "Do not spam commands",
      value:
        "PauBot does not throttle the speed at which you can submit new facets, instead it uses an economy system with energy points to control and incentivize users to submit good content. As such, do not spam the bot mercilessly, all the bots content is privately hosted so try to not clog the database.",
    },
    {
      name: "Submit valuable relevant on-topic content",
      value:
        "Avoid submitting unrelated topics or topics that make joke of or otherwise lessen the overall experience of the bot.",
    },
    {
      name: "Submit content that abides by the server rules",
      value:
        "Make sure you do not submit content that would be against the rules of the server the bot is currently in, such as excessive gore or NSFW, where applicable.",
    },
    {
      name: "Respect other peoples creations",
      value:
        "PauBot allows you to add stories and influence other peoples additions in many unregulated ways, however please keep in mind to respect your fellow creators. Ask permission if you want to make a major change to a character/location/line of stories. Don't just decide to kill off characters you did not create with no regard for the creator's opinion. To prove you have read these rules thoroughly, the actual accept command is %wbacceptrules awesomesauce.",
    },
    {
      name: "Keep in touch with the lore",
      value:
        "Before adding content that interacts with aspects of the world, read up on the lore of the aspects you are interacting with. This is vital to prevent conflictions in story. Nobody wants to read a story where a character dies and then for some reason he is alive again in the next story.",
    },
    {
      name: "Provide input on content and users",
      value:
        "In order to self-moderate, PauBot offers commands like %wbflag to flag content you wish to see changes to/removed for review, as well as %wbupvote to show your appreciation for the content and its author. Also offered is %wbreport to report users not abiding by the rules of the bot. Please use these resources for your own benefit, they are there to make the experience more enjoyable.",
    },
    {
      name: "Have fun",
      value:
        "Obligatory have fun rule. Enjoy this bot or get banned. Use %wbinfo for information on PauBot worldbuilding and %help  for additional information on all PauBot commands.",
    }
  )
  .setImage(
    "https://thumbs.gfycat.com/GregariousNeglectedArcherfish-size_restricted.gif"
  )
  .setFooter(
    "Consider donating to keep the servers running %donate",
    "https://cdn.discordapp.com/app-icons/592736284816965663/8223af4828cc8d2db1c5fffcca3acfa0.png?size=512"
  );

(async () => {
  db = await require("../../util/db");
})();

module.exports = class WBRulesCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "wbrules",
      group: "wb",
      memberName: "wbrules",
      description:
        "Displays the rules all users must accept to use PauBot worldbuilding",
      argsType: "multiple",
    });
  }

  async run(message, args) {
    try {
      message.channel.send(rulesEmbed);
    } catch (err) {
      console.log(err);
    }
  }
};
