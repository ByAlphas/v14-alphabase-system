const { embedError } = require('./_embeds');
const { SlashCommandBuilder } = require('discord.js');
const { t } = require('../lang');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('myvc')
        .setDescription(t('MYVC_DESC')),
    async execute(interaction, db) {
        const entry = await db.get('vc_' + interaction.user.id);
        if (!entry) return interaction.reply({ embeds: [embedError('Bir odanız yok.')], ephemeral: true });
        const channel = interaction.guild.channels.cache.get(entry.channelID);
        if (!channel) return interaction.reply({ embeds: [embedError(t('CHANNEL_NOT_FOUND'))], ephemeral: true });
        const date = new Date(entry.createdAt).toLocaleString('tr-TR');
        const embed = {
            color: 0x5865F2,
            title: t('MYVC_TITLE'),
            description: `Kanal: <#${entry.channelID}>\nAdı: ${entry.name}\nOluşturulma: ${date}`,
            fields: [
                { name: t('MYVC_NAME'), value: channel.name, inline: true },
                { name: t('MYVC_LOCKED'), value: entry.isLocked ? t('YES') : t('NO'), inline: true },
                { name: t('MYVC_LIMIT'), value: channel.userLimit ? channel.userLimit.toString() : t('NO'), inline: true },
                { name: t('MYVC_CREATED'), value: date, inline: true },
            ]
        };
        await interaction.reply({ embeds: [embed] });
    },
};
