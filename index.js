const Discord = require("discord.js");
const Commando = require("discord.js-commando");
const db = require("./util/db");
const path = require("path");

require("dotenv").config();

const PREFIX = "%";

const TOKEN = process.env.TOKEN;

const client = new Commando.CommandoClient({
  owner: "223493743162949633",
  commandPrefix: PREFIX,
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);

  client.user.setActivity(
    `${PREFIX}help | Running on ${client.guilds.cache.size} servers`
  );

  client.registry
    .registerGroups([
      ["wb", "Worldbuilding"],
      ["misc", "Miscellaneous"],
      ["econ", "Economy"],
    ])
    .registerDefaults()
    .registerCommandsIn(path.join(__dirname, "commands"));
});

client.on("message", (msg) => {
  if (msg.author.bot) return;
  if (msg.content.startsWith(PREFIX)) {
    const [CMD_NAME, ...args] = msg.content
      .trim()
      .substring(PREFIX.length)
      .split(/\s+/);
  }
});

client.login(TOKEN);
