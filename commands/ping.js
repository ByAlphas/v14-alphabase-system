const { SlashCommandBuilder } = require('discord.js');
const { t } = require('../lang');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription(t('PING_DESC')),
    async execute(interaction) {
        const embed = {
            color: 0x5865F2,
            title: t('PING_TITLE'),
            description: t('PING_LATENCY') + ` ${Date.now() - interaction.createdTimestamp}ms`
        };
        await interaction.reply({ embeds: [embed] });
    },
};
