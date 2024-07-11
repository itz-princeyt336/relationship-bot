const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('propose')
    .setDescription('Propose to another user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user you want to propose to')
        .setRequired(true)),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const requestsPath = `./requests`;
    const userRequestsPath = path.join(requestsPath, `${user.id}.json`);

    // Create requests directory if it doesn't exist
    if (!fs.existsSync(requestsPath)) {
      fs.mkdirSync(requestsPath, { recursive: true });
    }

    let requests = [];
    if (fs.existsSync(userRequestsPath)) {
      requests = JSON.parse(fs.readFileSync(userRequestsPath));
    }

    requests.push({ id: interaction.user.id, username: interaction.user.username, requestedAt: new Date() });
    fs.writeFileSync(userRequestsPath, JSON.stringify(requests, null, 2));

    const embed = {
      color: 0x00ff00,
      title: 'Proposal Sent',
      description: `You have proposed to ${user.username}.`,
    };

    await interaction.reply({ embeds: [embed], ephemeral: true });

    // Send DM to the user receiving the proposal
    try {
      const dmEmbed = {
        color: 0xff69b4,
        title: 'You Have a New Proposal!',
        description: `${interaction.user.username} has proposed to you. Use the /accept command to accept the proposal.`,
      };

      await user.send({ embeds: [dmEmbed] });
    } catch (error) {
      console.error(`Could not send DM to ${user.username}.`, error);
    }
  },
};
