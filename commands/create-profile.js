const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('create-profile')
    .setDescription('Create a user profile')
    .addStringOption(option =>
      option.setName('name')
        .setDescription('Your name')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('age')
        .setDescription('Your age')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('gender')
        .setDescription('Your gender')
        .setRequired(true)
        .addChoices(
          { name: 'Male', value: 'male' },
          { name: 'Female', value: 'female' },
          { name: 'Other', value: 'other' }
        )),

  async execute(interaction) {
    const name = interaction.options.getString('name');
    const age = interaction.options.getInteger('age');
    const gender = interaction.options.getString('gender');
    const userId = interaction.user.id;
    const profilesPath = './profiles';
    const userProfilePath = path.join(profilesPath, `${userId}.json`);

    // Create profiles directory if it doesn't exist
    if (!fs.existsSync(profilesPath)) {
      fs.mkdirSync(profilesPath, { recursive: true });
    }

    const profile = {
      id: userId,
      name: name,
      age: age,
      gender: gender,
    };

    fs.writeFileSync(userProfilePath, JSON.stringify(profile, null, 2));

    const embed = {
      color: 0x00ff00,
      title: 'Profile Created',
      description: `Your profile has been created successfully.`,
      fields: [
        { name: 'Name', value: name, inline: true },
        { name: 'Age', value: age.toString(), inline: true },
        { name: 'Gender', value: gender.charAt(0).toUpperCase() + gender.slice(1), inline: true },
      ],
    };

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
