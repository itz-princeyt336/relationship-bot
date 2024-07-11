const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('breakup')
    .setDescription('Break up with your current partner'),

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
    const partnerRelationshipPath = `./relationships/${relationship.partnerId}.json`;

    fs.unlinkSync(relationshipPath);
    fs.unlinkSync(partnerRelationshipPath);

    const embed = {
      color: 0x00ff00,
      title: 'Relationship Ended',
      description: `You have broken up with ${relationship.partnerName}.`,
    };

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
