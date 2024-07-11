const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('calculate-love')
    .setDescription('Calculate love percentage between two users')
    .addUserOption(option =>
      option.setName('user1')
        .setDescription('First user')
        .setRequired(true))
    .addUserOption(option =>
      option.setName('user2')
        .setDescription('Second user')
        .setRequired(true)),

  async execute(interaction) {
    const user1 = interaction.options.getUser('user1');
    const user2 = interaction.options.getUser('user2');

    const lovePercentage = Math.floor(Math.random() * 100) + 1; // Example calculation
    const resultPath = path.join('./love_results', `${user1.id}_${user2.id}.json`);

    // Create love_results directory if it doesn't exist
    if (!fs.existsSync('./love_results')) {
      fs.mkdirSync('./love_results', { recursive: true });
    }

    if (!fs.existsSync(resultPath)) {
      fs.writeFileSync(resultPath, JSON.stringify({ lovePercentage }, null, 2));
    }

    const result = JSON.parse(fs.readFileSync(resultPath));

    const embed = {
      color: 0xff69b4,
      title: 'Love Calculator',
      description: `The love percentage between ${user1.username} and ${user2.username} is ${result.lovePercentage}%.`,
    };

    await interaction.reply({ embeds: [embed] });
  },
};
