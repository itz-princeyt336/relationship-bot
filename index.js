const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config();

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({
    activities: [{ name: 'with code', type: 'PLAYING' }],
    status: 'online',
  });

  const commands = client.commands.map(cmd => cmd.data.toJSON());
  const rest = new REST({ version: '9' }).setToken(token);

  (async () => {
    try {
      await rest.put(
        Routes.applicationCommands(clientId),
        { body: commands },
      );

      console.log('Successfully registered application commands.');
    } catch (error) {
      console.error(error);
    }
  })();
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  const exemptedCommands = ['help', 'ping', 'calculate-love'];

  // Check if the command requires a profile
  if (!exemptedCommands.includes(interaction.commandName)) {
    const userProfilePath = path.join('./profiles', `${interaction.user.id}.json`);
    if (!fs.existsSync(userProfilePath)) {
      const embed = {
        color: 0xff0000,
        title: 'Profile Required',
        description: 'You need to create a profile first using the `/create-profile` command.',
      };
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

client.login(token);
