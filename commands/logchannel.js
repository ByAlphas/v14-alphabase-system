const { SlashCommandBuilder } = require('discord.js');
const { embedSuccess, embedError } = require('./_embeds');
const { t } = require('../lang');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('logchannel')
        .setDescription(t('LOGCHANNEL_DESC'))
        .addSubcommand(sub =>
            sub.setName('set')
                .setDescription(t('LOGCHANNEL_SET_DESC'))
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription(t('LOGCHANNEL_OPTION'))
                        .setRequired(true)
                )
        )
        .addSubcommand(sub =>
            sub.setName('reset')
                .setDescription(t('LOGCHANNEL_RESET_DESC'))
        ),
    async execute(interaction, db) {
        // Sadece admin veya voice admin yetkisiyle kullanılabilir
        const member = await interaction.guild.members.fetch(interaction.user.id);
        const adminRoles = (await db.get('voice_admin_roles')) || [];
        const isAdmin = interaction.guild.ownerId === interaction.user.id || member.permissions.has('Administrator') || member.roles.cache.some(r => adminRoles.includes(r.id));
        if (!isAdmin) {
            return interaction.reply({ embeds: [embedError(t('NOT_ADMIN'))], ephemeral: true });
        }
        const sub = interaction.options.getSubcommand();
        if (sub === 'set') {
            const channel = interaction.options.getChannel('channel');
            if (!channel || !channel.isTextBased()) return interaction.reply({ embeds: [embedError(t('LOGCHANNEL_TEXT_REQUIRED'))], ephemeral: true });
            await db.set('log_channel_id', channel.id);
            return interaction.reply({ embeds: [embedSuccess(t('LOGCHANNEL_SET_SUCCESS').replace('{channel}', `<#${channel.id}>`))], ephemeral: true });
        } else if (sub === 'reset') {
            await db.delete('log_channel_id');
            return interaction.reply({ embeds: [embedSuccess(t('LOGCHANNEL_RESET_SUCCESS'))], ephemeral: true });
        }
    },
};
