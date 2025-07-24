const { SlashCommandBuilder } = require('discord.js');
const { embedSuccess, embedError } = require('./_embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('settings')
        .setDescription(require('../lang').t('SETTINGS_DESC'))
        .addSubcommand(sub =>
            sub.setName('set')
                .setDescription(require('../lang').t('SETTINGS_SET_DESC'))
                .addStringOption(option =>
                    option.setName('option')
                        .setDescription(require('../lang').t('SETTINGS_OPTION_DESC'))
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('value')
                        .setDescription(require('../lang').t('SETTINGS_VALUE_DESC'))
                        .setRequired(true))
        )
        .addSubcommand(sub =>
            sub.setName('get')
                .setDescription(require('../lang').t('SETTINGS_GET_DESC'))
        ),
    async execute(interaction, db) {
        // Sadece voice admin yetkisi olanlar kullanabilir
        const member = await interaction.guild.members.fetch(interaction.user.id);
        const adminRoles = (await db.get('voice_admin_roles')) || [];
        const isAdmin = interaction.guild.ownerId === interaction.user.id || member.permissions.has('Administrator') || member.roles.cache.some(r => adminRoles.includes(r.id));
        if (!isAdmin) {
            return interaction.reply({ embeds: [embedError('Sadece voice admin yetkisine sahip olanlar bu komutu kullanabilir.')], ephemeral: true });
        }
        const sub = interaction.options.getSubcommand();
        if (sub === 'set') {
            const option = interaction.options.getString('option');
            const value = interaction.options.getString('value');
            let settings = await db.get('bot_settings') || { idleTimeout: 5, defaultVisibility: 'public' };
            if (option === 'idleTimeout') {
                const num = parseInt(value);
                if (isNaN(num) || num < 1 || num > 60) return interaction.reply({ embeds: [embedError('1-60 dakika arası bir değer girin.')], ephemeral: true });
                settings.idleTimeout = num;
            } else if (option === 'defaultVisibility') {
                if (!['public','private'].includes(value)) return interaction.reply({ embeds: [embedError('Geçerli değerler: public, private')], ephemeral: true });
                settings.defaultVisibility = value;
            } else {
                return interaction.reply({ embeds: [embedError('Geçersiz ayar ismi.')], ephemeral: true });
            }
            await db.set('bot_settings', settings);
            return interaction.reply({ embeds: [embedSuccess(`Ayar güncellendi: ${option} = ${value}`)], ephemeral: true });
        } else if (sub === 'get') {
            const settings = await db.get('bot_settings') || { idleTimeout: 5, defaultVisibility: 'public' };
            let desc = `idleTimeout: ${settings.idleTimeout}\ndefaultVisibility: ${settings.defaultVisibility}`;
            // botStatus ve botActivity kaldırıldı
            return interaction.reply({ embeds: [embedSuccess(desc)], ephemeral: true });
        }
    },
};
