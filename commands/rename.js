const { embedSuccess, embedError } = require('./_embeds');
const { SlashCommandBuilder } = require('discord.js');
const { t } = require('../lang');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rename')
        .setDescription(t('RENAME_DESC'))
        .addStringOption(option =>
            option.setName('name')
                .setDescription(t('RENAME_OPTION'))
                .setRequired(true)),
    async execute(interaction, db) {
        const newName = interaction.options.getString('name');
        const entry = await db.get('vc_' + interaction.user.id);
        if (!entry) return interaction.reply({ embeds: [embedError(t('NO_VC'))], ephemeral: true });
        const channel = interaction.guild.channels.cache.get(entry.channelID);
        if (!channel) return interaction.reply({ embeds: [embedError(t('CHANNEL_NOT_FOUND'))], ephemeral: true });
        if (newName.length < 3 || newName.length > 32) {
            return interaction.reply({ embeds: [embedError(t('RENAME_LENGTH'))], ephemeral: true });
        }
        if (!/^[a-zA-Z0-9ğüşöçıİĞÜŞÖÇ _-]+$/.test(newName)) {
            return interaction.reply({ embeds: [embedError(t('RENAME_CHARS'))], ephemeral: true });
        }
        await channel.setName(newName);
        entry.name = newName;
        await db.set('vc_' + interaction.user.id, entry);
        return interaction.reply({ embeds: [embedSuccess(t('RENAME_SUCCESS', { name: newName }))], ephemeral: true });
    },
};
