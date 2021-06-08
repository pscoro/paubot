const Commando = require("discord.js-commando");
const Discord = require("discord.js");
let db;
let firstImage =
  "https://cdn.discordapp.com/attachments/848984519763034185/850184565661237269/wbmedia.png";

(async () => {
  db = await require("../../util/db");
})();

module.exports = class WBMediaCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "wbmedia",
      aliases: ["wbm"],
      group: "wb",
      memberName: "wbmedia",
      description: "Add and view facet related images and gifs",
      details:
        "%wbmedia [ID] to view a facet by ID. %wbmedia by name is not supported, Please use %wbview or %wbsearch to find the ID of the facet of a given name.\n %wbmedia add [ID] [URL] [description of media (multiword)] to add an image or gif of a facet of ID. Make sure URL ends in a supported image type (.jpg, .jpeg, .png, .gif). Consider using imgur for hosting.",
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

            if (args.length > 3) {
              if (args[0] === "add") {
                if (Number.isInteger(parseInt(args[1]))) {
                  if (
                    args[2].endsWith(".jpg") ||
                    args[2].endsWith(".jpeg") ||
                    args[2].endsWith(".png") ||
                    args[2].endsWith(".gif")
                  ) {
                    let descText = "";
                    let current = 3;

                    while (current < args.length) {
                      args[current] = args[current]
                        .toString()
                        .replace(/'/g, "\\'");
                      descText += args[current].toString() + " ";
                      current++;
                    }
                    descText = descText.trim();

                    let mediaText = args[2] + ": " + descText;

                    db.query(
                      `SELECT * FROM guild_${message.guild.id} WHERE facetId = ${args[1]}`
                    )
                      .then((result) => {
                        if (result[0] && result[0].length > 0) {
                          if (
                            result[0][0].facetMedia &&
                            result[0][0].facetMedia.length > 0
                          ) {
                            mediaText =
                              result[0][0].facetMedia + ", " + mediaText;
                          }
                          db.query(
                            `UPDATE guild_${message.guild.id} SET facetMedia = '${mediaText}' WHERE facetId = ${args[1]}`
                          );
                          message.channel.send(
                            "Media for ID #" + args[1] + " added."
                          );
                        }
                      })
                      .catch((err) => console.log(err));
                  } else {
                    message.channel.send(
                      "Provided url should end in .jpg, .jpeg, .png, or .gif. Consider using imgur for hosting."
                    );
                  }
                }
              } else {
                message.channel.send(
                  "Please use %wbmedia [ID] to view media or %wbmedia add [ID] [URL] [Descrition of media] to add media. If you need help finding the ID of a facet, use %wbview or %wbsearch to find it."
                );
              }
            } else if (args.length == 1) {
              if (Number.isInteger(parseInt(args[0]))) {
                db.query(
                  `SELECT * FROM guild_${message.guild.id} WHERE facetId = ${args[0]}`
                )
                  .then((result) => {
                    if (result[0] && result[0].length > 0) {
                      if (
                        result[0][0].facetMedia &&
                        result[0][0].facetMedia.length > 0
                      ) {
                        let currentImage = 0;
                        let mediaEmbed = new Discord.MessageEmbed();
                        mediaEmbed
                          .setColor("#99ff00")
                          .setTitle(
                            "ID #" +
                              result[0][0].facetId +
                              ": " +
                              result[0][0].facetName
                          )
                          .setDescription(
                            "Media " +
                              (currentImage + 1) +
                              "/" +
                              result[0][0].facetMedia.split(", ").length
                          )
                          .addFields({
                            name: "Description",
                            value: result[0][0].facetMedia
                              .split(", ")
                              [currentImage].split(": ")[1],
                          })
                          .setImage(
                            result[0][0].facetMedia
                              .split(", ")
                              [currentImage].split(": ")[0]
                          );

                        message.channel
                          .send(mediaEmbed)
                          .then(function (botMessage) {
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
                                  currentImage > 0
                                ) {
                                  console.log("yep");
                                  currentImage--;
                                  mediaEmbed = new Discord.MessageEmbed();
                                  mediaEmbed
                                    .setColor("#99ff00")
                                    .setTitle(
                                      "ID #" +
                                        result[0][0].facetId +
                                        ": " +
                                        result[0][0].facetName
                                    )
                                    .setDescription(
                                      "Media " +
                                        (currentImage + 1) +
                                        "/" +
                                        result[0][0].facetMedia.split(", ")
                                          .length
                                    )
                                    .addFields({
                                      name: "Description",
                                      value: result[0][0].facetMedia
                                        .split(", ")
                                        [currentImage].split(": ")[1],
                                    })
                                    .setImage(
                                      result[0][0].facetMedia
                                        .split(", ")
                                        [currentImage].split(": ")[0]
                                    );

                                  botMessage.edit(mediaEmbed);
                                } else if (
                                  reaction.emoji.name === "➡️" &&
                                  currentImage <
                                    result[0][0].facetMedia.split(", ").length
                                ) {
                                  console.log("yepy");
                                  currentImage++;
                                  mediaEmbed = new Discord.MessageEmbed();
                                  mediaEmbed
                                    .setColor("#99ff00")
                                    .setTitle(
                                      "ID #" +
                                        result[0][0].facetId +
                                        ": " +
                                        result[0][0].facetName
                                    )
                                    .setDescription(
                                      "Media " +
                                        (currentImage + 1) +
                                        "/" +
                                        result[0][0].facetMedia.split(", ")
                                          .length
                                    )
                                    .addFields({
                                      name: "Description",
                                      value: result[0][0].facetMedia
                                        .split(", ")
                                        [currentImage].split(": ")[1],
                                    })
                                    .setImage(
                                      result[0][0].facetMedia
                                        .split(", ")
                                        [currentImage].split(": ")[0]
                                    );

                                  botMessage.edit(mediaEmbed);
                                }
                              }
                            );
                          })
                          .catch((err) => console.log(err));
                      } else {
                        message.channel.send(
                          "No media yet exists for this facet, consider adding some with %wbmedia add [ID] [URL] [Descrition of media]"
                        );
                      }
                    } else {
                      message.channel.send("Invalid facet ID");
                    }
                  })
                  .catch((err) => console.log(err));
              }
            } else {
              message.channel.send("Invalid arguments.");
            }
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
