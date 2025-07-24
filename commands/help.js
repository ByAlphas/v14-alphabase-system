const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription(require('../lang').t('HELP_DESC')),
    async execute(interaction) {
        const { t } = require('../lang');
        const embed = new EmbedBuilder()
            .setTitle(t('HELP_TITLE'))
            .setColor(0x5865F2)
            .setDescription(t('HELP_DESC_LONG'))
            .addFields(
                { name: t('HELP_CAT_VC'), value: t('HELP_VC_COMMANDS'), inline: false },
                { name: t('HELP_CAT_SECURITY'), value: t('HELP_SECURITY_COMMANDS'), inline: false },
                { name: t('HELP_CAT_SETTINGS'), value: t('HELP_SETTINGS_COMMANDS'), inline: false },
                { name: t('HELP_CAT_ADMIN'), value: t('HELP_ADMIN_COMMANDS'), inline: false },
                { name: t('HELP_CAT_OTHER'), value: t('HELP_OTHER_COMMANDS'), inline: false }
            )
            .setFooter({ text: t('HELP_FOOTER') });
        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
