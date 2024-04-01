const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a user from the server')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to ban')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('The reason for the ban')
                .setRequired(false)),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No Reason Given';

        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        try {
            await interaction.guild.members.ban(user, { reason });
            const embed = {
                title: 'User Banned',
                description: `**${user.tag}** has been banned.`,
                fields: [
                    { name: 'Reason', value: reason }
                ],
                thumbnail: {
                    url: user.displayAvatarURL({ dynamic: true })
                },
                color: 0xff0000
            };
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'An error occurred while trying to ban the user.', ephemeral: true });
        }
    },
};
