const { embedSuccess, embedError } = require('./_embeds');
const { t } = require('../lang');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vc')
        .setDescription(t('VC_DESC'))
        .addSubcommand(sub => sub.setName('adduser').setDescription(t('VC_ADDUSER_DESC'))
            .addUserOption(option => option.setName('user').setDescription(t('VC_ADDUSER_USER_DESC')).setRequired(true)))
        .addSubcommand(sub => sub.setName('removeuser').setDescription(t('VC_REMOVEUSER_DESC'))
            .addUserOption(option => option.setName('user').setDescription(t('VC_REMOVEUSER_USER_DESC')).setRequired(true)))
        .addSubcommand(sub => sub.setName('invite').setDescription(t('VC_INVITE_DESC'))
            .addUserOption(option => option.setName('user').setDescription(t('VC_INVITE_USER_DESC')).setRequired(true)))
        .addSubcommand(sub => sub.setName('stats').setDescription(t('VC_STATS_DESC')))
        .addSubcommand(sub => sub.setName('allowrole').setDescription(t('VC_ALLOWROLE_DESC'))
            .addRoleOption(option => option.setName('role').setDescription(t('VC_ALLOWROLE_ROLE_DESC')).setRequired(true)))
        .addSubcommand(sub => sub.setName('lockrole').setDescription(t('VC_LOCKROLE_DESC'))
            .addRoleOption(option => option.setName('role').setDescription(t('VC_LOCKROLE_ROLE_DESC')).setRequired(true)))
        .addSubcommand(sub => sub.setName('limit').setDescription(t('VC_LIMIT_DESC'))
            .addIntegerOption(option => option.setName('number').setDescription(t('VC_LIMIT_NUMBER_DESC')).setRequired(true)))
        .addSubcommand(sub => sub.setName('allowuser').setDescription(t('VC_ALLOWUSER_DESC'))
            .addUserOption(option => option.setName('user').setDescription(t('VC_ALLOWUSER_USER_DESC')).setRequired(true)))
        .addSubcommand(sub => sub.setName('kick').setDescription(t('VC_KICK_DESC'))
            .addUserOption(option => option.setName('user').setDescription(t('VC_KICK_USER_DESC')).setRequired(true)))
        .addSubcommand(sub => sub.setName('list').setDescription(t('VC_LIST_DESC')))
        .addSubcommand(sub => sub.setName('admins').setDescription(t('VC_ADMINS_DESC'))),
    async execute(interaction, db) {
        const sub = interaction.options.getSubcommand();
        const user = interaction.user;
        const guild = interaction.guild;
        // Kullanıcıya ait VC kaydını bul
        const entry = await db.get('vc_' + user.id);
        let channel = null;
        if ([
            'adduser','removeuser','invite','stats',
            'allowrole','lockrole','limit','allowuser','kick'
        ].includes(sub)) {
            if (!entry) return interaction.reply({ embeds: [embedError(t('NO_VC'))], ephemeral: true });
            channel = guild.channels.cache.get(entry.channelID);
            if (!channel) return interaction.reply({ embeds: [embedError(t('CHANNEL_NOT_FOUND'))], ephemeral: true });
        }

        if (sub === 'adduser') {
            const target = interaction.options.getUser('user');
            if (!target) return interaction.reply({ embeds: [embedError(t('USER_REQUIRED'))], ephemeral: true });
            await channel.permissionOverwrites.edit(target.id, { Connect: true });
            return interaction.reply({ embeds: [embedSuccess(`${target} kanala eklendi.`)], ephemeral: true });
        }
        if (sub === 'removeuser') {
            const target = interaction.options.getUser('user');
            if (!target) return interaction.reply({ embeds: [embedError(t('USER_REQUIRED'))], ephemeral: true });
            await channel.permissionOverwrites.delete(target.id);
            return interaction.reply({ embeds: [embedSuccess(`${target} kanaldan çıkarıldı.`)], ephemeral: true });
        }
        if (sub === 'invite') {
            const target = interaction.options.getUser('user');
            if (!target) return interaction.reply({ embeds: [embedError(t('USER_REQUIRED'))], ephemeral: true });
            try {
                await target.send(`Sana <#${channel.id}> kanalına katılman için davet gönderildi!`);
                return interaction.reply({ embeds: [embedSuccess(`${target} kullanıcısına davet gönderildi.`)], ephemeral: true });
            } catch {
                return interaction.reply({ embeds: [embedError('Kullanıcıya DM gönderilemedi.')], ephemeral: true });
            }
        }
        if (sub === 'stats') {
            // Gelişmiş istatistikler
            const date = new Date(entry.createdAt).toLocaleString('tr-TR');
            const userLimit = entry.userLimit ? entry.userLimit : t('VC_STATS_UNLIMITED');
            const allowedRoles = entry.allowedRoles?.length ? entry.allowedRoles.map(r=>`<@&${r}>`).join(', ') : t('VC_STATS_NONE');
            const lockedRoles = entry.lockedRoles?.length ? entry.lockedRoles.map(r=>`<@&${r}>`).join(', ') : t('VC_STATS_NONE');
            const allowedUsers = entry.allowedUsers?.length ? entry.allowedUsers.map(u=>`<@${u}>`).join(', ') : t('VC_STATS_NONE');
            const kickedUsers = entry.kickedUsers?.length ? entry.kickedUsers.map(u=>`<@${u}>`).join(', ') : t('VC_STATS_NONE');
            // Toplam süre hesapla
            let total = 0;
            if (entry.joinHistory && entry.joinHistory.length) {
                for (const j of entry.joinHistory) {
                    if (j.joinedAt && j.leftAt) total += (j.leftAt - j.joinedAt);
                    else if (j.joinedAt && !j.leftAt) total += (Date.now() - j.joinedAt);
                }
            }
            const totalMins = Math.floor(total/60000);
            const statsEmbed = {
                color: 0x5865F2,
                title: t('VC_STATS_TITLE'),
                description: t('VC_STATS_DESC', { channel: `<#${entry.channelID}>`, name: entry.name, date }),
                fields: [
                    { name: t('VC_STATS_LOCKED'), value: entry.isLocked ? t('VC_STATS_YES') : t('VC_STATS_NO'), inline: true },
                    { name: t('VC_STATS_HIDDEN'), value: entry.isHidden ? t('VC_STATS_YES') : t('VC_STATS_NO'), inline: true },
                    { name: t('VC_STATS_LIMIT'), value: String(userLimit), inline: true },
                    { name: t('VC_STATS_ALLOWED_ROLES'), value: allowedRoles, inline: false },
                    { name: t('VC_STATS_LOCKED_ROLES'), value: lockedRoles, inline: false },
                    { name: t('VC_STATS_ALLOWED_USERS'), value: allowedUsers, inline: false },
                    { name: t('VC_STATS_KICKED_USERS'), value: kickedUsers, inline: false },
                    { name: t('VC_STATS_TOTAL_TIME'), value: t('VC_STATS_MINUTES', { mins: totalMins }), inline: true },
                    { name: t('VC_STATS_HISTORY'), value: entry.joinHistory?.length ? entry.joinHistory.map(j=>`<@${j.userId}>: ${new Date(j.joinedAt).toLocaleTimeString('tr-TR')} - ${j.leftAt ? new Date(j.leftAt).toLocaleTimeString('tr-TR') : t('VC_STATS_INSIDE')}`).slice(-5).join('\n') : t('VC_STATS_NONE'), inline: false }
                ]
            };
            return interaction.reply({ embeds: [statsEmbed], ephemeral: true });
        }

        // allowrole: role ekle ve izin ver
        if (sub === 'allowrole') {
            const role = interaction.options.getRole('role');
            if (!role) return interaction.reply({ embeds: [embedError(t('ROLE_REQUIRED'))], ephemeral: true });
            await channel.permissionOverwrites.edit(role.id, { Connect: true });
            if (!entry.allowedRoles.includes(role.id)) entry.allowedRoles.push(role.id);
            await db.set('vc_' + user.id, entry);
            return interaction.reply({ embeds: [embedSuccess(`${role} artık kanala katılabilir!`)], ephemeral: true });
        }
        // lockrole: role katılımı engelle
        if (sub === 'lockrole') {
            const role = interaction.options.getRole('role');
            if (!role) return interaction.reply({ embeds: [embedError(t('ROLE_REQUIRED'))], ephemeral: true });
            await channel.permissionOverwrites.edit(role.id, { Connect: false });
            if (!entry.lockedRoles.includes(role.id)) entry.lockedRoles.push(role.id);
            await db.set('vc_' + user.id, entry);
            return interaction.reply({ embeds: [embedSuccess(`${role} artık kanala katılamaz!`)], ephemeral: true });
        }
        // limit: kullanıcı limiti ayarla
        if (sub === 'limit') {
            const number = interaction.options.getInteger('number');
            if (number < 0 || number > 99) return interaction.reply({ embeds: [embedError(t('LIMIT_RANGE'))], ephemeral: true });
            await channel.setUserLimit(number);
            entry.userLimit = number === 0 ? null : number;
            await db.set('vc_' + user.id, entry);
            return interaction.reply({ embeds: [embedSuccess(`Kanal kullanıcı limiti ${number === 0 ? 'kaldırıldı' : number + ' olarak ayarlandı'}.`)], ephemeral: true });
        }
        // allowuser: kullanıcıya izin ver
        if (sub === 'allowuser') {
            const target = interaction.options.getUser('user');
            if (!target) return interaction.reply({ embeds: [embedError(t('USER_REQUIRED'))], ephemeral: true });
            await channel.permissionOverwrites.edit(target.id, { Connect: true });
            if (!entry.allowedUsers.includes(target.id)) entry.allowedUsers.push(target.id);
            await db.set('vc_' + user.id, entry);
            return interaction.reply({ embeds: [embedSuccess(`${target} artık kanala katılabilir!`)], ephemeral: true });
        }
        // kick: kullanıcıyı at ve engelle
        if (sub === 'kick') {
            const target = interaction.options.getUser('user');
            if (!target) return interaction.reply({ embeds: [embedError(t('USER_REQUIRED'))], ephemeral: true });
            await channel.permissionOverwrites.edit(target.id, { Connect: false });
            if (!entry.kickedUsers.includes(target.id)) entry.kickedUsers.push(target.id);
            // Kanaldaysa at
            const member = await guild.members.fetch(target.id).catch(()=>null);
            if (member && member.voice.channelId === channel.id) await member.voice.disconnect('Kanal sahibi tarafından atıldı');
            await db.set('vc_' + user.id, entry);
            return interaction.reply({ embeds: [embedSuccess(`${target} kanaldan atıldı ve engellendi!`)], ephemeral: true });
        }

        // Admin, VC banını kaldırabilir
        if (sub === 'unban') {
            const target = interaction.options.getUser('user');
            if (!target) return interaction.reply({ embeds: [embedError('Bir kullanıcı seçmelisiniz.')], ephemeral: true });
            // Sadece admin veya voice admin yetkisi kontrolü
            const member = await guild.members.fetch(user.id);
            const adminRoles = (await db.get('voice_admin_roles')) || [];
            const isAdmin = guild.ownerId === user.id || member.permissions.has('Administrator') || member.roles.cache.some(r => adminRoles.includes(r.id));
            if (!isAdmin) return interaction.reply({ embeds: [embedError(t('NOT_ADMIN'))], ephemeral: true });
            let bans = (await db.get('vc_bans')) || [];
            if (bans.includes(target.id)) {
                bans = bans.filter(id => id !== target.id);
                await db.set('vc_bans', bans);
                return interaction.reply({ embeds: [embedSuccess(`${target} ${t('BAN_REMOVED')}`)], ephemeral: true });
            } else {
                return interaction.reply({ embeds: [embedError(t('BAN_NOT_FOUND'))], ephemeral: true });
            }
        }
        if (sub === 'list') {
            // Sadece voice admin yetkisi kontrolü
            const member = await guild.members.fetch(user.id);
            const adminRoles = (await db.get('voice_admin_roles')) || [];
            const isVoiceAdmin = guild.ownerId === user.id || member.permissions.has('Administrator') || member.roles.cache.some(r => adminRoles.includes(r.id));
            if (!isVoiceAdmin) return interaction.reply({ embeds: [embedError(t('NOT_VOICE_ADMIN'))], ephemeral: true });
            const all = await db.all();
            const vcs = Object.values(all).filter(e => e.channelID && e.name);
            if (vcs.length === 0) return interaction.reply({ embeds: [embedError('Aktif özel oda yok.')], ephemeral: true });
            const embed = {
                color: 0x5865F2,
                title: 'Aktif Özel Odalar',
                description: vcs.map(e => `• <#${e.channelID}> — ${e.name}`).join('\n')
            };
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        if (sub === 'admins') {
            // Admin veya voice admin yetkisi kontrolü
            const member = await guild.members.fetch(user.id);
            const adminRoles = (await db.get('voice_admin_roles')) || [];
            const isAdmin = guild.ownerId === user.id || member.permissions.has('Administrator') || member.roles.cache.some(r => adminRoles.includes(r.id));
            if (!isAdmin) return interaction.reply({ embeds: [embedError('Sadece admin veya voice admin yetkisine sahip olanlar bu komutu kullanabilir.')], ephemeral: true });
            // Voice admin rolleri ve kullanıcıları
            const roles = adminRoles.map(rid => guild.roles.cache.get(rid)).filter(Boolean);
            let users = [];
            for (const m of await guild.members.fetch()) {
                if (m[1].roles.cache.some(r => adminRoles.includes(r.id))) users.push(m[1]);
            }
            const embed = {
                color: 0x5865F2,
                title: 'Voice Admin Rolleri ve Kullanıcıları',
                fields: [
                    { name: 'Roller', value: roles.length ? roles.map(r => `<@&${r.id}>`).join(', ') : 'Yok', inline: false },
                    { name: 'Kullanıcılar', value: users.length ? users.map(u => `<@${u.id}>`).join(', ') : 'Yok', inline: false }
                ]
            };
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
};
