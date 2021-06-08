const Commando = require("discord.js-commando");
const Discord = require("discord.js");
let db;

(async () => {
  db = await require("../../util/db");
})();

module.exports = class WBLinkCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "wblink",
      aliases: ["wblk"],
      group: "wb",
      memberName: "wblink",
      description: "Add links between facets",
      details:
        "%wblink [ID of first facet] [ID of second facet] [description of relationship (multiword)] to link 2 facets together. The order of the IDs does not matter. Make sure you include a description explaining how they are related and that the description can be interpreted both ways (i.e. 'A and B are brothers' rather than 'brother to B').",
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

            if (args.length > 2) {
              if (
                Number.isInteger(parseInt(args[0])) &&
                Number.isInteger(parseInt(args[1]))
              ) {
                db.query(
                  `SELECT * FROM guild_${message.guild.id} WHERE facetId = ${args[0]}`
                )
                  .then((result) => {
                    db.query(
                      `SELECT * FROM guild_${message.guild.id} WHERE facetId = ${args[0]}`
                    )
                      .then((result2) => {
                        if (
                          result[0] &&
                          result[0].length > 0 &&
                          result2[0] &&
                          result2[0].length > 0
                        ) {
                          let descText = "";
                          let current = 2;

                          while (current < args.length) {
                            args[current] = args[current]
                              .toString()
                              .replace(/'/g, "\\'");
                            descText += args[current].toString() + " ";
                            current++;
                          }
                          descText = descText.trim();

                          let linkText = args[1] + ": " + descText;
                          let linkText2 = args[0] + ": " + descText;

                          if (
                            result[0][0].facetLinks &&
                            result[0][0].facetLinks.length > 0
                          ) {
                            linkText =
                              result[0][0].facetLinks + ", " + linkText;
                          }
                          if (
                            result2[0][0].facetLinks &&
                            result2[0][0].facetLinks.length > 0
                          ) {
                            linkText2 =
                              result2[0][0].facetLinks + ", " + linkText2;
                          }

                          db.query(
                            `UPDATE guild_${message.guild.id} SET facetLinks = '${linkText}' WHERE facetId = ${args[0]}`
                          );
                          db.query(
                            `UPDATE guild_${message.guild.id} SET facetLinks = '${linkText2}' WHERE facetId = ${args[1]}`
                          );

                          message.channel.send(
                            "Link between IDs #" +
                              args[0] +
                              " and " +
                              args[1] +
                              " added."
                          );
                        } else {
                          message.channel.send(
                            "Invalid facet IDs. If you are having trouble finding the IDs, use %wbview or %wbsearch"
                          );
                        }
                      })
                      .catch((err) => console.log(err));
                  })
                  .catch((err) => console.log(err));
              } else {
                message.channel.send(
                  "Invalid arguments, make sure you are using %wblink [ID] [ID] [description of relationship]"
                );
              }
            } else {
              message.channel.send(
                "Invalid arguments, make sure you are using %wblink [ID] [ID] [description of relationship]"
              );
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
