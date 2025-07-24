const { SlashCommandBuilder } = require('discord.js');
const { embedSuccess, embedError } = require('./_embeds');
const { t } = require('../lang');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vcban')
        .setDescription(t('VCBAN_DESC'))
        .addUserOption(option =>
            option.setName('user')
                .setDescription(t('VCBAN_OPTION'))
                .setRequired(true)),
    async execute(interaction, db) {
        const member = await interaction.guild.members.fetch(interaction.user.id);
        const isAdmin = interaction.guild.ownerId === interaction.user.id || member.permissions.has('Administrator');
        if (!isAdmin) {
            return interaction.reply({ embeds: [embedError(t('NOT_ADMIN'))], ephemeral: true });
        }
        const target = interaction.options.getUser('user');
        if (!target) return interaction.reply({ embeds: [embedError(t('USER_REQUIRED'))], ephemeral: true });
        let bans = (await db.get('vc_bans')) || [];
        if (bans.includes(target.id)) {
            bans = bans.filter(id => id !== target.id);
            await db.set('vc_bans', bans);
            return interaction.reply({ embeds: [embedSuccess(t('BAN_REMOVED').replace('{user}', target))], ephemeral: true });
        } else {
            bans.push(target.id);
            await db.set('vc_bans', bans);
            return interaction.reply({ embeds: [embedSuccess(t('BAN_APPLIED').replace('{user}', target))], ephemeral: true });
        }
    },
};
