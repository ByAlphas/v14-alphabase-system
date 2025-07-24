const { embedSuccess, embedError } = require('./_embeds');
const { SlashCommandBuilder } = require('discord.js');
const { t } = require('../lang');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('transfer')
        .setDescription(t('TRANSFER_DESC'))
        .addUserOption(option =>
            option.setName('user')
                .setDescription(t('TRANSFER_OPTION'))
                .setRequired(true)),
    async execute(interaction, db) {
        const target = interaction.options.getUser('user');
        const entry = await db.get('vc_' + interaction.user.id);
        if (!entry) return interaction.reply({ embeds: [embedError(t('NO_VC'))], ephemeral: true });
        if (await db.get('vc_' + target.id)) return interaction.reply({ embeds: [embedError(t('TRANSFER_ALREADY'))], ephemeral: true });
        const channel = interaction.guild.channels.cache.get(entry.channelID);
        if (!channel) return interaction.reply({ embeds: [embedError(t('CHANNEL_NOT_FOUND'))], ephemeral: true });
        await channel.permissionOverwrites.edit(target.id, { Connect: true, ManageChannels: true });
        await channel.permissionOverwrites.edit(interaction.user.id, { Connect: true, ManageChannels: false });
        await db.set('vc_' + target.id, { ...entry });
        await db.delete('vc_' + interaction.user.id);
        return interaction.reply({ embeds: [embedSuccess(t('TRANSFER_SUCCESS').replace('{user}', target))], ephemeral: true });
    },
};
