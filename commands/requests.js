const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('requests')
    .setDescription('Show your relationship requests'),

  async execute(interaction) {
    const requestsPath = `./requests/${interaction.user.id}.json`;
    if (!fs.existsSync(requestsPath)) {
      const embed = {
        color: 0xff0000,
        title: 'No Requests Found',
        description: 'You have no relationship requests.',
      };
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const requests = JSON.parse(fs.readFileSync(requestsPath));

    const embed = {
      color: 0x00ff00,
      title: 'Relationship Requests',
      description: 'Here are your relationship requests:',
      fields: requests.map(req => ({ name: req.username, value: `Requested at: ${new Date(req.requestedAt).toISOString()}`, inline: true }))
    };

    await interaction.reply({ embeds: [embed] });
  },
};
