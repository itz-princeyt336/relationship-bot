const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription('Show your profile'),

  async execute(interaction) {
    const profilePath = `./profiles/${interaction.user.id}.json`;
    if (!fs.existsSync(profilePath)) {
      const embed = {
        color: 0xff0000,
        title: 'Profile Not Found',
        description: 'You need to create a profile first using /create-profile.',
      };
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const profile = JSON.parse(fs.readFileSync(profilePath));

    const embed = {
      color: 0x00ff00,
      title: `${interaction.user.username}'s Profile`,
      fields: [
        { name: 'Name', value: profile.name, inline: true },
        { name: 'Age', value: profile.age.toString(), inline: true },
        { name: 'Gender', value: profile.gender, inline: true },
      ]
    };

    await interaction.reply({ embeds: [embed] });
  },
};
