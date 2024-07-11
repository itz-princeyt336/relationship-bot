const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Displays a list of available commands'),
  async execute(interaction) {
    const embed = {
      color: 0x0099ff,
      title: 'Help',
      description: 'List of available commands:',
      fields: [
        { name: '/create-profile [name] [age] [gender]', value: 'Create a profile' },
        { name: '/profile', value: 'Show your profile' },
        { name: '/relationship', value: 'Show your relationship status' },
        { name: '/requests', value: 'Show relationship requests' },
        { name: '/propose [mention_user]', value: 'Propose to another user' },
        { name: '/accept [user]', value: 'Accept a relationship request' },
        { name: '/breakup', value: 'End your current relationship' },
        { name: '/calculate-love [user1] [user2]', value: 'Calculate love percentage between two users' },
        { name: '/help', value: 'Show this help message' },
        { name: '/ping', value: 'Check bot response time' },
      ],
    };

    await interaction.reply({ embeds: [embed] });
  },
};
