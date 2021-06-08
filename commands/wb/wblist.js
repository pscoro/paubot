const Commando = require("discord.js-commando");
const Discord = require("discord.js");
let db;

let listEmbed = new Discord.MessageEmbed();

(async () => {
  db = await require("../../util/db");
})();

module.exports = class WBListCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "wblist",
      aliases: ["wbls"],
      group: "wb",
      memberName: "wblist",
      description: "Lists all facets in order of ID on multiple pages",
      details:
        "%wblist to start listing, %wblist [page] to skip to a certain page",
      argsType: "multiple",
    });
  }

  async run(message, args) {
    try {
      await db
        .query(`SELECT * FROM users WHERE userId = '${message.author.id}'`)
        .then((userResult) => {
          if (userResult[0] && userResult[0].length > 0) {
            // do command
            db.query(`SELECT * FROM guild_${message.guild.id}`)
              .then((result) => {
                if (result[0] && result[0].length > 0) {
                  let currentPage = 0;
                  let totalPages = Math.ceil(result[0].length / 5);

                  if (
                    args.length > 0 &&
                    Number.isInteger(parseInt(args[0])) &&
                    parseInt(args[0]) <= totalPages
                  ) {
                    currentPage = parseInt(args[0]) - 1;
                    listEmbed = new Discord.MessageEmbed()
                      .setColor("#99ff00")
                      .setTitle("Facet List")
                      .setDescription(
                        "Page " + (currentPage + 1) + "/" + totalPages
                      )
                      .setFooter(
                        "You can use %wbview to view any of these facets",
                        "https://cdn.discordapp.com/app-icons/592736284816965663/8223af4828cc8d2db1c5fffcca3acfa0.png?size=512"
                      );

                    let len =
                      currentPage == totalPages - 1
                        ? result[0].length % 5 == 0
                          ? 5
                          : result[0].length % 5
                        : 5;
                    for (var i = 0; i < len; i++) {
                      let shortDesc = result[0][
                        currentPage * 5 + i
                      ].facetDesc.split(".")[0];
                      if (shortDesc.length > 128)
                        shortDesc = shortDesc.substring(0, 127);
                      listEmbed.addFields({
                        name:
                          "ID #" +
                          result[0][currentPage * 5 + i].facetId +
                          ": " +
                          result[0][currentPage * 5 + i].facetName,
                        value:
                          "Type: " +
                          result[0][currentPage * 5 + i].facetType +
                          "\nTags: " +
                          result[0][currentPage * 5 + i].facetTags +
                          "\n" +
                          shortDesc,
                      });
                    }
                    message.channel
                      .send(listEmbed)
                      .then(function (botMessage) {
                        console.log("HIHI");
                        botMessage.react("⬅️");
                        botMessage.react("➡️");

                        const filter = (reaction, user) => {
                          return (
                            ["⬅️", "➡️"].includes(reaction.emoji.name) &&
                            user.id != botMessage.author.id
                          );
                        };

                        const collector = botMessage.createReactionCollector(
                          filter,
                          { time: 150000 }
                        );

                        collector.on(
                          "collect",
                          (reaction, reactionCollector) => {
                            console.log("Reaction");
                            if (
                              reaction.emoji.name === "⬅️" &&
                              currentPage > 0
                            ) {
                              console.log("yep");
                              currentPage--;
                              listEmbed = new Discord.MessageEmbed()
                                .setColor("#99ff00")
                                .setTitle("Facet List")
                                .setDescription(
                                  "Page " + (currentPage + 1) + "/" + totalPages
                                )
                                .setFooter(
                                  "You can use %wbview to view any of these facets",
                                  "https://cdn.discordapp.com/app-icons/592736284816965663/8223af4828cc8d2db1c5fffcca3acfa0.png?size=512"
                                );

                              let len =
                                currentPage == totalPages - 1
                                  ? result[0].length % 5 == 0
                                    ? 5
                                    : result[0].length % 5
                                  : 5;
                              for (var i = 0; i < len; i++) {
                                let shortDesc = result[0][
                                  currentPage * 5 + i
                                ].facetDesc.split(".")[0];
                                if (shortDesc.length > 128)
                                  shortDesc = shortDesc.substring(0, 127);
                                listEmbed.addFields({
                                  name:
                                    "ID #" +
                                    result[0][currentPage * 5 + i].facetId +
                                    ": " +
                                    result[0][currentPage * 5 + i].facetName,
                                  value:
                                    "Type: " +
                                    result[0][currentPage * 5 + i].facetType +
                                    "\nTags: " +
                                    result[0][currentPage * 5 + i].facetTags +
                                    "\n" +
                                    shortDesc,
                                });
                              }
                              botMessage.edit(listEmbed);
                            } else if (
                              reaction.emoji.name === "➡️" &&
                              currentPage < totalPages - 1
                            ) {
                              console.log("yepy");
                              currentPage++;
                              listEmbed = new Discord.MessageEmbed()
                                .setColor("#99ff00")
                                .setTitle("Facet List")
                                .setDescription(
                                  "Page " + (currentPage + 1) + "/" + totalPages
                                )
                                .setFooter(
                                  "You can use %wbview to view any of these facets",
                                  "https://cdn.discordapp.com/app-icons/592736284816965663/8223af4828cc8d2db1c5fffcca3acfa0.png?size=512"
                                );

                              let len =
                                currentPage == totalPages - 1
                                  ? result[0].length % 5 == 0
                                    ? 5
                                    : result[0].length % 5
                                  : 5;
                              for (var i = 0; i < len; i++) {
                                let shortDesc = result[0][
                                  currentPage * 5 + i
                                ].facetDesc.split(".")[0];
                                if (shortDesc.length > 128)
                                  shortDesc = shortDesc.substring(0, 127);
                                listEmbed.addFields({
                                  name:
                                    "ID #" +
                                    result[0][currentPage * 5 + i].facetId +
                                    ": " +
                                    result[0][currentPage * 5 + i].facetName,
                                  value:
                                    "Type: " +
                                    result[0][currentPage * 5 + i].facetType +
                                    "\nTags: " +
                                    result[0][currentPage * 5 + i].facetTags +
                                    "\n" +
                                    shortDesc,
                                });
                              }
                              botMessage.edit(listEmbed);
                            }
                          }
                        );
                      })
                      .catch((err) => console.log(err));
                  } else if (args.length === 0) {
                    listEmbed = new Discord.MessageEmbed()
                      .setColor("#99ff00")
                      .setTitle("Facet List")
                      .setDescription(
                        "Page " + (currentPage + 1) + "/" + totalPages
                      )
                      .setFooter(
                        "You can use %wbview to view any of these facets",
                        "https://cdn.discordapp.com/app-icons/592736284816965663/8223af4828cc8d2db1c5fffcca3acfa0.png?size=512"
                      );

                    let len =
                      currentPage == totalPages - 1
                        ? result[0].length % 5 == 0
                          ? 5
                          : result[0].length % 5
                        : 5;
                    for (var i = 0; i < len; i++) {
                      console.log(len);
                      let shortDesc = result[0][
                        currentPage * 5 + i
                      ].facetDesc.split(".")[0];
                      if (shortDesc.length > 128)
                        shortDesc = shortDesc.substring(0, 127);
                      listEmbed.addFields({
                        name:
                          "ID #" +
                          result[0][currentPage * 5 + i].facetId +
                          ": " +
                          result[0][currentPage * 5 + i].facetName,
                        value:
                          "Type: " +
                          result[0][currentPage * 5 + i].facetType +
                          "\nTags: " +
                          result[0][currentPage * 5 + i].facetTags +
                          "\n" +
                          shortDesc,
                      });
                    }
                    message.channel
                      .send(listEmbed)
                      .then(function (botMessage) {
                        console.log("HIHI");
                        botMessage.react("⬅️");
                        botMessage.react("➡️");

                        const filter = (reaction, user) => {
                          return (
                            ["⬅️", "➡️"].includes(reaction.emoji.name) &&
                            user.id != botMessage.author.id
                          );
                        };

                        const collector = botMessage.createReactionCollector(
                          filter,
                          { time: 150000 }
                        );

                        collector.on(
                          "collect",
                          (reaction, reactionCollector) => {
                            console.log("Reaction");
                            if (
                              reaction.emoji.name === "⬅️" &&
                              currentPage > 0
                            ) {
                              console.log("yep");
                              currentPage--;
                              listEmbed = new Discord.MessageEmbed()
                                .setColor("#99ff00")
                                .setTitle("Facet List")
                                .setDescription(
                                  "Page " + (currentPage + 1) + "/" + totalPages
                                )
                                .setFooter(
                                  "You can use %wbview to view any of these facets",
                                  "https://cdn.discordapp.com/app-icons/592736284816965663/8223af4828cc8d2db1c5fffcca3acfa0.png?size=512"
                                );

                              let len =
                                currentPage == totalPages - 1
                                  ? result[0].length % 5 == 0
                                    ? 5
                                    : result[0].length % 5
                                  : 5;
                              for (var i = 0; i < len; i++) {
                                let shortDesc = result[0][
                                  currentPage * 5 + i
                                ].facetDesc.split(".")[0];
                                if (shortDesc.length > 128)
                                  shortDesc = shortDesc.substring(0, 127);
                                listEmbed.addFields({
                                  name:
                                    "ID #" +
                                    result[0][currentPage * 5 + i].facetId +
                                    ": " +
                                    result[0][currentPage * 5 + i].facetName,
                                  value:
                                    "Type: " +
                                    result[0][currentPage * 5 + i].facetType +
                                    "\nTags: " +
                                    result[0][currentPage * 5 + i].facetTags +
                                    "\n" +
                                    shortDesc,
                                });
                              }
                              botMessage.edit(listEmbed);
                            } else if (
                              reaction.emoji.name === "➡️" &&
                              currentPage < totalPages - 1
                            ) {
                              console.log("yepy");
                              currentPage++;
                              listEmbed = new Discord.MessageEmbed()
                                .setColor("#99ff00")
                                .setTitle("Facet List")
                                .setDescription(
                                  "Page " + (currentPage + 1) + "/" + totalPages
                                )
                                .setFooter(
                                  "You can use %wbview to view any of these facets",
                                  "https://cdn.discordapp.com/app-icons/592736284816965663/8223af4828cc8d2db1c5fffcca3acfa0.png?size=512"
                                );

                              let len =
                                currentPage == totalPages - 1
                                  ? result[0].length % 5 == 0
                                    ? 5
                                    : result[0].length % 5
                                  : 5;
                              for (var i = 0; i < len; i++) {
                                let shortDesc = result[0][
                                  currentPage * 5 + i
                                ].facetDesc.split(".")[0];
                                if (shortDesc.length > 128)
                                  shortDesc = shortDesc.substring(0, 127);
                                listEmbed.addFields({
                                  name:
                                    "ID #" +
                                    result[0][currentPage * 5 + i].facetId +
                                    ": " +
                                    result[0][currentPage * 5 + i].facetName,
                                  value:
                                    "Type: " +
                                    result[0][currentPage * 5 + i].facetType +
                                    "\nTags: " +
                                    result[0][currentPage * 5 + i].facetTags +
                                    "\n" +
                                    shortDesc,
                                });
                              }
                              botMessage.edit(listEmbed);
                            }
                          }
                        );
                      })
                      .catch((err) => console.log(err));
                  } else {
                    message.channel.send("Invalid page.");
                  }
                } else {
                  message.channel.send(
                    "No facets exist yet in this server, consider crating one with %wbcreate."
                  );
                }
              })
              .catch((err) => console.log(err));
          } else {
            message.reply(
              "You are either not registered yet or banned! Read through %wbrules to start registration"
            );
          }
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
    }
  }
};
