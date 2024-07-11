const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('accept')
    .setDescription('Accept a relationship proposal')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user whose proposal you want to accept')
        .setRequired(true)),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
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
    const requestIndex = requests.findIndex(req => req.id === user.id);

    if (requestIndex === -1) {
      const embed = {
        color: 0xff0000,
        title: 'Request Not Found',
        description: `You have no request from ${user.username}.`,
      };
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const relationshipPath = `./relationships/${interaction.user.id}.json`;
    const partnerRelationshipPath = `./relationships/${user.id}.json`;

    const relationship = {
      partnerId: user.id,
      partnerName: user.username,
      started: new Date(),
    };

    fs.writeFileSync(relationshipPath, JSON.stringify(relationship, null, 2));
    fs.writeFileSync(partnerRelationshipPath, JSON.stringify({
      partnerId: interaction.user.id,
      partnerName: interaction.user.username,
      started: new Date(),
    }, null, 2));

    requests.splice(requestIndex, 1);
    fs.writeFileSync(requestsPath, JSON.stringify(requests, null, 2));

    const embed = {
      color: 0x00ff00,
      title: 'Proposal Accepted',
      description: `You have accepted ${user.username}'s proposal.`,
    };

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
