const { embedSuccess, embedError } = require('./_embeds');
const { t } = require('../lang');
const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlock')
        .setDescription(t('UNLOCK_DESC')),
    async execute(interaction, db) {
        const entry = await db.get('vc_' + interaction.user.id);
        if (!entry) return interaction.reply({ embeds: [embedError(t('NO_VC'))], ephemeral: true });
        const channel = interaction.guild.channels.cache.get(entry.channelID);
        if (!channel) return interaction.reply({ embeds: [embedError(t('CHANNEL_NOT_FOUND'))], ephemeral: true });
        await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { Connect: true });
        entry.isLocked = false;
        await db.set('vc_' + interaction.user.id, entry);
        return interaction.reply({ embeds: [embedSuccess(t('UNLOCK_SUCCESS'))], ephemeral: true });
    },
};
