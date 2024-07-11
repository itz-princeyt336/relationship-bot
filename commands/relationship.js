const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('relationship')
    .setDescription('Show your current relationship'),

  async execute(interaction) {
    const relationshipPath = `./relationships/${interaction.user.id}.json`;
    if (!fs.existsSync(relationshipPath)) {
      const embed = {
        color: 0xff0000,
        title: 'No Relationship Found',
        description: 'You are not in a relationship.',
      };
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const relationship = JSON.parse(fs.readFileSync(relationshipPath));

    const embed = {
      color: 0x00ff00,
      title: `${interaction.user.username}'s Relationship`,
      fields: [
        { name: 'Partner', value: relationship.partnerName, inline: true },
        { name: 'Started At', value: new Date(relationship.started).toISOString(), inline: true }
      ]
    };

    await interaction.reply({ embeds: [embed] });
  },
};
