# About PauBot
PauBot is a worldbuilding bot for Discord written in JS using the Discord.js and Discord Commando libraries. The bot offers a variety of worldbuilding specific commands as well as some general purpose ones. The bot was created by myself.

##### If you plan on forking please note all the data for this bot is hosted privately on my database, if you wish to structure your own database use the schemas in schemas.sql

## What is worldbuilding?
Wikipedia defines it as 'Worldbuilding is the process of constructing an imaginary world, sometimes associated with a whole fictional universe. Developing an imaginary setting with coherent qualities such as a history, geography, and ecology is a key task for many science fiction or fantasy writers.

##What is the purpose of PauBot Worldbuilding?
The purpose is to provide functionality to have an entire discord server create and manage all the resources they would need to create their own worldbuilding universe. This includes the capabilities to create aspects, view and browse aspects, build upon other peoples ideas, link ideas together, provide feedback for ideas and promote a community experience.
## What does PauBot offer?
PauBot offers commands to facilitate the premises described above as well as database hosting for all the content created. PauBot will allow only 1 world to be created per server it is in in order to encourage everyone to work together on the same project.

## What commands are there?
All worldbuilding commands start with the prefix %wb to seperate them from other commands. The most common commands you will likely use are %wbcreate [type] [name]; [tag(s)]; [description text] to create things in your world, %wbview [name or id] to view a thing, or %wblink [name or id]; [name or id]; [description of relationship] to link a relationship between any two things. More information on these commands as well as all the others is available through %help

## What things can I make?
There is no limit on things you can make in your world. When creating a thing (commonly referred to as a facet), you will have to specify a type, all things fall into one of 5 categories, location, entity, object, event, or other (which may include abilities spells or whatever you can think of). When you are creating a facet you will also be asked to specify tag(s) which is where you can clarify more specifically what the facet is (such as a town, animal, person, book, etc). If your facet is a plural, simply make sure that this is evident through the name and/or description of the object, try to keep plurals outside of tags unless absolutely necessary as tags will be used to search for and list facets.

## What if I don\'t like something that someone else made
All users must agree to the rules before using wb commands, details on fairplay are provided there. If you think someone elses facet is off-topic or ill-spirited consider flagging it for review with %wbflag [id] [description of request] whereupon you and everyone can use %wbreview to review and vote upon these requests. If a user is blatantly breaking the worldbuilding rules, use %wbreport [user] [reason] to send the bot owner a personalized moderation request, at which point will review whether the user broke any rules and possibly remove his wb permissions.

## How do I get started?
Start by registering for the bot in order for the necessary data to be created. To do this you must carefully read %wbrules (the bot will know if you haven\'t ;) ) and then use %wbacceptrules to accept them and register. Have fun!
