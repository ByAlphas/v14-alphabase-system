const { embedSuccess, embedError } = require('./_embeds');
const { SlashCommandBuilder } = require('discord.js');
const { t } = require('../lang');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('voiceadmin')
        .setDescription(t('VOICEADMIN_DESC'))
        .addRoleOption(option =>
            option.setName('roles')
                .setDescription(t('VOICEADMIN_ROLE_DESC'))
                .setRequired(true)),
    async execute(interaction, db) {
        // Sadece sunucu sahibi veya Administrator yetkisi olanlar kullanabilir
        const member = await interaction.guild.members.fetch(interaction.user.id);
        if (
            interaction.guild.ownerId !== interaction.user.id &&
            !member.permissions.has('Administrator')
        ) {
            return interaction.reply({ embeds: [embedError(t('VOICEADMIN_ONLY_OWNER_ADMIN'))], ephemeral: true });
        }

        const role = interaction.options.getRole('roles');
        let adminRoles = (await db.get('voice_admin_roles')) || [];
        if (!role) return interaction.reply({ embeds: [embedError(t('ROLE_REQUIRED'))], ephemeral: true });
        if (!adminRoles.includes(role.id)) {
            adminRoles.push(role.id);
            await db.set('voice_admin_roles', adminRoles);
            return interaction.reply({ embeds: [embedSuccess(t('VOICEADMIN_ADDED'))], ephemeral: true });
        } else {
            adminRoles = adminRoles.filter(r => r !== role.id);
            await db.set('voice_admin_roles', adminRoles);
            return interaction.reply({ embeds: [embedSuccess(t('VOICEADMIN_REMOVED'))], ephemeral: true });
        }
    },
};
