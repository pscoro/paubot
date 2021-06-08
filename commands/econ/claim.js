const Commando = require("discord.js-commando");
let db;

(async () => {
  db = await require("../../util/db");
})();

module.exports = class claimCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "claim",
      group: "econ",
      memberName: "claim",
      description: "Claim daily and weekly energy supplies",
      argsType: "multiple",
    });
  }

  async run(message, args) {
    try {
      if (args.length == 0 || args[0] === "daily") {
        await db
          .query(`SELECT * FROM users WHERE userId = '${message.author.id}'`)
          .then((result) => {
            if (result[0].length == 0) {
              message.reply(
                "You must register before you can use this command. Start by reading %wbrules carefully."
              );
            } else {
              const currentTime = Math.round(Date.now() / 1000);
              if (currentTime - result[0][0].collectedDaily >= 86400) {
                // one day pass check
                if (Math.random() <= 0.01) {
                  let reward = 500;
                  let newEnergy = result[0][0].energy + reward;
                  db.query(
                    `UPDATE users SET collectedDaily = '${currentTime}' WHERE userId = '${message.author.id}'`
                  );
                  db.query(
                    `UPDATE users SET energy = '${newEnergy}' WHERE userId = '${message.author.id}'`
                  );
                  message.reply(
                    "JACKPOT! You won the rare " +
                      reward +
                      " energy points daily reward!"
                  );
                } else {
                  let reward = Math.floor(Math.random() * 10) + 1;
                  let newEnergy = result[0][0].energy + reward;
                  db.query(
                    `UPDATE users SET collectedDaily = '${currentTime}' WHERE userId = '${message.author.id}'`
                  );
                  db.query(
                    `UPDATE users SET energy = '${newEnergy}' WHERE userId = '${message.author.id}'`
                  );
                  message.reply(
                    "Your reward today is... " + reward + " energy points."
                  );
                }
              } else {
                var secondsUntil =
                  86400 - (currentTime - result[0][0].collectedDaily);
                var hours = Math.floor(secondsUntil / 60 / 60);
                var minutes = Math.floor(secondsUntil / 60) % 60;
                var seconds = Math.floor(secondsUntil) % 60;

                if (hours < 10) hours = "0" + hours.toString();
                if (minutes < 10) minutes = "0" + minutes.toString();
                if (seconds < 10) seconds = "0" + seconds.toString();

                // Will display time in 10:30:23 format
                var formattedTime = hours + ":" + minutes + ":" + seconds;
                message.reply(
                  "Settle down, you must wait " +
                    formattedTime +
                    " before claiming again."
                );
              }
            }
          })
          .catch((err) => console.log(err));
      } else if (args.length > 0 && args[0] === "weekly") {
        await db
          .query(`SELECT * FROM users WHERE userId = '${message.author.id}'`)
          .then((result) => {
            if (result[0].length == 0) {
              message.reply(
                "You must register before you can use this command. Start by reading %wbrules carefully."
              );
            } else {
              const currentTime = Math.round(Date.now() / 1000);
              if (currentTime - result[0][0].collectedWeekly >= 86400 * 7) {
                // one week pass check
                if (Math.random() <= 0.01) {
                  let reward = 5000;
                  let newEnergy = result[0][0].energy + reward;
                  db.query(
                    `UPDATE users SET collectedWeekly = '${currentTime}' WHERE userId = '${message.author.id}'`
                  );
                  db.query(
                    `UPDATE users SET energy = '${newEnergy}' WHERE userId = '${message.author.id}'`
                  );
                  message.reply(
                    "JACKPOT! You won the rare " +
                      reward +
                      " energy points weekly reward!"
                  );
                } else {
                  let reward = Math.floor(Math.random() * 100) + 1;
                  let newEnergy = result[0][0].energy + reward;
                  db.query(
                    `UPDATE users SET collectedWeekly = '${currentTime}' WHERE userId = '${message.author.id}'`
                  );
                  db.query(
                    `UPDATE users SET energy = '${newEnergy}' WHERE userId = '${message.author.id}'`
                  );
                  message.reply(
                    "Your reward this week is... " + reward + " energy points."
                  );
                }
              } else {
                var secondsUntil =
                  86400 * 7 - (currentTime - result[0][0].collectedDaily);
                var hours = Math.floor(secondsUntil / 60 / 60);
                var minutes = Math.floor(secondsUntil / 60) % 60;
                var seconds = Math.floor(secondsUntil) % 60;

                if (hours < 10) hours = "0" + hours.toString();
                if (minutes < 10) minutes = "0" + minutes.toString();
                if (seconds < 10) seconds = "0" + seconds.toString();

                // Will display time in 10:30:23 format
                var formattedTime = hours + ":" + minutes + ":" + seconds;
                message.reply(
                  "Settle down, you must wait " +
                    formattedTime +
                    " before claiming again."
                );
              }
            }
          })
          .catch((err) => console.log(err));
      }
    } catch (err) {
      console.log(err);
    }
  }
};
