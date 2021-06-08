const Commando = require("discord.js-commando");
const Discord = require("discord.js");
let db;

const infoEmbed = new Discord.MessageEmbed()
  .setColor("#99ff00")
  .setTitle("PauBot WorldBuilding Information")
  .setDescription(
    "Below is a description of how to use PauBot's worldbuilding capabilities"
  )
  .setThumbnail(
    "https://cdn.discordapp.com/app-icons/592736284816965663/8223af4828cc8d2db1c5fffcca3acfa0.png?size=512"
  )
  .addFields(
    {
      name: "What is worldbuilding?",
      value:
        "Wikipedia defines it as 'Worldbuilding is the process of constructing an imaginary world, sometimes associated with a whole fictional universe. Developing an imaginary setting with coherent qualities such as a history, geography, and ecology is a key task for many science fiction or fantasy writers.'",
    },
    {
      name: "What is the purpose of PauBot Worldbuilding?",
      value:
        "The purpose is to provide functionality to have an entire discord server create and manage all the resources they would need to create their own worldbuilding universe. This includes the capabilities to create aspects, view and browse aspects, build upon other peoples ideas, link ideas together, provide feedback for ideas and promote a community experience.",
    },
    {
      name: "What does PauBot offer?",
      value:
        "PauBot offers commands to facilitate the premises described above as well as database hosting for all the content created. PauBot will allow only 1 world to be created per server it is in in order to encourage everyone to work together on the same project.",
    },
    {
      name: "What commands are there?",
      value:
        "All worldbuilding commands start with the prefix %wb to seperate them from other commands. The most common commands you will likely use are %wbcreate [type] [name]; [tag(s)]; [description text] to create things in your world, %wbview [name or id] to view a thing, or %wblink [name or id]; [name or id]; [description of relationship] to link a relationship between any two things. More information on these commands as well as all the others is available through %help",
    },
    {
      name: "What things can I make?",
      value:
        "There is no limit on things you can make in your world. When creating a thing (commonly referred to as a facet), you will have to specify a type, all things fall into one of 5 categories, location, entity, object, event, or other (which may include abilities spells or whatever you can think of). When you are creating a facet you will also be asked to specify tag(s) which is where you can clarify more specifically what the facet is (such as a town, animal, person, book, etc). If your facet is a plural, simply make sure that this is evident through the name and/or description of the object, try to keep plurals outside of tags unless absolutely necessary as tags will be used to search for and list facets.",
    },
    {
      name: "What if I don't like something that someone else made",
      value:
        "All users must agree to the rules before using wb commands, details on fairplay are provided there. If you think someone elses facet is off-topic or ill-spirited consider flagging it for review with %wbflag [id] [description of request] whereupon you and everyone can use %wbreview to review and vote upon these requests. If a user is blatantly breaking the worldbuilding rules, use %wbreport [user] [reason] to send the bot owner a personalized moderation request, at which point will review whether the user broke any rules and possibly remove his wb permissions.",
    },
    {
      name: "How do I get started?",
      value:
        "Start by registering for the bot in order for the necessary data to be created. To do this you must carefully read %wbrules (the bot will know if you haven't ;) ) and then use %wbacceptrules to accept them and register. Have fun!",
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

module.exports = class WBInfoCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "wbinfo",
      aliases: ["wbi"],
      group: "wb",
      memberName: "wbinfo",
      description:
        "Displays information on how to use PauBot's worldbuilding abilities as well as relevant commands",
      argsType: "multiple",
    });
  }

  async run(message, args) {
    try {
      message.author.send(infoEmbed);
      message.channel.send("Sent you info in DMs.");
    } catch (err) {
      console.log(err);
    }
  }
};
