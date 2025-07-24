
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { embedSuccess, embedError, embedInfo } = require('./_embeds');
const { t } = require('../lang');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('va')
        .setDescription(t('VA_DESC'))
        .addSubcommand(sub => sub.setName('control').setDescription(t('VA_CONTROL_DESC'))
            .addChannelOption(opt => opt.setName('vc').setDescription(t('VA_VC_DESC')).setRequired(true))
            .addStringOption(opt => opt.setName('action').setDescription(t('VA_ACTION_DESC')).setRequired(true))
            .addUserOption(opt => opt.setName('target').setDescription(t('VA_TARGET_DESC')))
            .addRoleOption(opt => opt.setName('role').setDescription(t('VA_ROLE_DESC')))
            .addIntegerOption(opt => opt.setName('number').setDescription(t('VA_NUMBER_DESC')))
            .addStringOption(opt => opt.setName('desc').setDescription(t('VA_DESC_OPTION')))
            .addChannelOption(opt => opt.setName('category').setDescription(t('VA_CATEGORY_DESC'))))
        .addSubcommand(sub => sub.setName('transfer').setDescription(t('VA_TRANSFER_DESC'))
            .addChannelOption(opt => opt.setName('vc').setDescription(t('VA_VC_DESC')).setRequired(true))
            .addUserOption(opt => opt.setName('user').setDescription(t('VA_NEW_OWNER_DESC')).setRequired(true)))
        .addSubcommand(sub => sub.setName('cleanup').setDescription(t('VA_CLEANUP_DESC')))
        .addSubcommand(sub => sub.setName('listusers').setDescription(t('VA_LISTUSERS_DESC'))
            .addChannelOption(opt => opt.setName('vc').setDescription(t('VA_VC_DESC')).setRequired(true)))
        .addSubcommand(sub => sub.setName('note').setDescription(t('VA_NOTE_DESC'))
            .addChannelOption(opt => opt.setName('vc').setDescription(t('VA_VC_DESC')).setRequired(true))
            .addStringOption(opt => opt.setName('text').setDescription(t('VA_TEXT_DESC')).setRequired(true)))
        .addSubcommand(sub => sub.setName('vcban').setDescription(t('VA_VCBAN_DESC'))
            .addUserOption(opt => opt.setName('user').setDescription(t('VA_USER_DESC')).setRequired(true))
            .addBooleanOption(opt => opt.setName('ban').setDescription(t('VA_BAN_DESC')).setRequired(true)))
        .addSubcommand(sub => sub.setName('freeze').setDescription(t('VA_FREEZE_DESC'))
            .addChannelOption(opt => opt.setName('vc').setDescription(t('VA_VC_DESC')).setRequired(true)))
        ,
    async execute(interaction, db) {
        const sub = interaction.options.getSubcommand();
        const guild = interaction.guild;
        const user = interaction.user;
        // Voice admin yetkisi kontrolü
        const adminRoles = (await db.get('voice_admin_roles')) || [];
        const member = await guild.members.fetch(user.id);
        const isVoiceAdmin = guild.ownerId === user.id || member.permissions.has(PermissionFlagsBits.Administrator) || member.roles.cache.some(r => adminRoles.includes(r.id));
        if (!isVoiceAdmin) return interaction.reply({ embeds: [embedError('Bu komutu kullanmak için voice admin olmalısınız.')], ephemeral: true });

        // --- Tam kontrol ---
        if (sub === 'control') {
            const channel = interaction.options.getChannel('vc');
            const action = interaction.options.getString('action');
            const target = interaction.options.getUser('target');
            const role = interaction.options.getRole('role');
            const number = interaction.options.getInteger('number');
            const desc = interaction.options.getString('desc');
            const newCat = interaction.options.getChannel('category');
            if (!channel || channel.type !== 2) return interaction.reply({ embeds: [embedError(t('INVALID_CHANNEL'))], ephemeral: true });
            const all = await db.all();
            let entry = null, key = null;
            for (const [k, v] of Object.entries(all)) { if (v.channelID === channel.id) { entry = v; key = k; break; } }
            if (!entry) return interaction.reply({ embeds: [embedError(t('CHANNEL_NOT_FOUND'))], ephemeral: true });
            // lock
            if (action === 'lock') {
                await channel.permissionOverwrites.edit(guild.roles.everyone.id, { Connect: false });
                entry.isLocked = true;
                await db.set(key, entry);
                return interaction.reply({ embeds: [embedSuccess(t('VC_LOCKED'))], ephemeral: true });
            }
            // unlock
            if (action === 'unlock') {
                await channel.permissionOverwrites.edit(guild.roles.everyone.id, { Connect: true });
                entry.isLocked = false;
                await db.set(key, entry);
                return interaction.reply({ embeds: [embedSuccess(t('VC_UNLOCKED'))], ephemeral: true });
            }
            // limit
            if (action === 'limit') {
                if (!number || number < 0 || number > 99) return interaction.reply({ embeds: [embedError(t('LIMIT_RANGE'))], ephemeral: true });
                await channel.setUserLimit(number);
                entry.userLimit = number === 0 ? null : number;
                await db.set(key, entry);
                return interaction.reply({ embeds: [embedSuccess(t('LIMIT_SET'))], ephemeral: true });
            }
            // kick
            if (action === 'kick') {
                if (!target) return interaction.reply({ embeds: [embedError(t('USER_REQUIRED'))], ephemeral: true });
                await channel.permissionOverwrites.edit(target.id, { Connect: false });
                if (!entry.kickedUsers.includes(target.id)) entry.kickedUsers.push(target.id);
                const member = await guild.members.fetch(target.id).catch(()=>null);
                if (member && member.voice.channelId === channel.id) await member.voice.disconnect('Voice admin tarafından atıldı');
                await db.set(key, entry);
                return interaction.reply({ embeds: [embedSuccess(t('USER_KICKED'))], ephemeral: true });
            }
            // allow (kullanıcı veya rol)
            if (action === 'allow') {
                if (target) {
                    await channel.permissionOverwrites.edit(target.id, { Connect: true });
                    if (!entry.allowedUsers.includes(target.id)) entry.allowedUsers.push(target.id);
                }
                if (role) {
                    await channel.permissionOverwrites.edit(role.id, { Connect: true });
                    if (!entry.allowedRoles.includes(role.id)) entry.allowedRoles.push(role.id);
                }
                await db.set(key, entry);
                return interaction.reply({ embeds: [embedSuccess(t('SUCCESS'))], ephemeral: true });
            }
            // freeze
            if (action === 'freeze') {
                await channel.permissionOverwrites.edit(guild.roles.everyone.id, { Connect: false });
                return interaction.reply({ embeds: [embedSuccess(t('VC_FROZEN'))], ephemeral: true });
            }
            // unfreeze
            if (action === 'unfreeze') {
                await channel.permissionOverwrites.edit(guild.roles.everyone.id, { Connect: true });
                return interaction.reply({ embeds: [embedSuccess(t('VC_UNFROZEN'))], ephemeral: true });
            }
            // reset
            if (action === 'reset') {
                await channel.setName('Kişisel Oda');
                await channel.setUserLimit(0);
                await channel.permissionOverwrites.set([]);
                entry.allowedRoles = [];
                entry.lockedRoles = [];
                entry.allowedUsers = [];
                entry.kickedUsers = [];
                entry.userLimit = null;
                entry.isLocked = false;
                entry.isHidden = false;
                await db.set(key, entry);
                return interaction.reply({ embeds: [embedSuccess(t('VC_RESET'))], ephemeral: true });
            }
            // desc
            if (action === 'desc') {
                if (!desc) return interaction.reply({ embeds: [embedError(t('INVALID_DESC'))], ephemeral: true });
                entry.description = desc;
                await db.set(key, entry);
                return interaction.reply({ embeds: [embedSuccess(t('VC_DESC_SET'))], ephemeral: true });
            }
            // move
            if (action === 'move') {
                if (!newCat || newCat.type !== 4) return interaction.reply({ embeds: [embedError(t('INVALID_CATEGORY'))], ephemeral: true });
                await channel.setParent(newCat.id);
                return interaction.reply({ embeds: [embedSuccess(t('VC_MOVED'))], ephemeral: true });
            }
            return interaction.reply({ embeds: [embedError(t('INVALID_ACTION'))], ephemeral: true });
        }
        // --- Sahipliği zorla değiştir ---
        if (sub === 'transfer') {
            const channel = interaction.options.getChannel('vc');
            const target = interaction.options.getUser('user');
            if (!channel || channel.type !== 2) return interaction.reply({ embeds: [embedError(t('INVALID_CHANNEL'))], ephemeral: true });
            // VC kaydını bul
            const all = await db.all();
            let foundKey = null;
            for (const [key, value] of Object.entries(all)) {
                if (value.channelID === channel.id) { foundKey = key; break; }
            }
            if (!foundKey) return interaction.reply({ embeds: [embedError(t('CHANNEL_NOT_FOUND'))], ephemeral: true });
            // Sahipliği değiştir
            const entry = all[foundKey];
            entry.owner = target.id;
            await db.set(foundKey, entry);
            return interaction.reply({ embeds: [embedSuccess(t('VC_TRANSFERRED'))], ephemeral: true });
        }
        // --- Toplu temizlik ---
        if (sub === 'cleanup') {
            const all = await db.all();
            let count = 0;
            for (const [key, value] of Object.entries(all)) {
                const channel = guild.channels.cache.get(value.channelID);
                if (channel && channel.members.size === 0) {
                    await channel.delete('Voice admin toplu temizlik');
                    await db.delete(key);
                    count++;
                }
            }
            return interaction.reply({ embeds: [embedSuccess(t('VC_CLEANED'))], ephemeral: true });
        }
        // --- Kullanıcı listesi ve geçmişi ---
        if (sub === 'listusers') {
            const channel = interaction.options.getChannel('vc');
            if (!channel || channel.type !== 2) return interaction.reply({ embeds: [embedError(t('INVALID_CHANNEL'))], ephemeral: true });
            const all = await db.all();
            let entry = null;
            for (const value of Object.values(all)) {
                if (value.channelID === channel.id) { entry = value; break; }
            }
            if (!entry) return interaction.reply({ embeds: [embedError(t('CHANNEL_NOT_FOUND'))], ephemeral: true });
            const users = channel.members.map(m => `<@${m.id}>`).join(', ') || t('NO_USER');
            const history = entry.joinHistory?.length ? entry.joinHistory.map(j=>`<@${j.userId}>: ${new Date(j.joinedAt).toLocaleTimeString('tr-TR')} - ${j.leftAt ? new Date(j.leftAt).toLocaleTimeString('tr-TR') : 'Şu an içeride'}`).slice(-10).join('\n') : t('NO_USER');
            return interaction.reply({ embeds: [embedInfo(`Şu an içeride: ${users}\nSon 10 giriş/çıkış:\n${history}`)], ephemeral: true });
        }
        // --- Not ekle ve sahibine DM gönder ---
        if (sub === 'note') {
            const channel = interaction.options.getChannel('vc');
            const text = interaction.options.getString('text');
            if (!channel || channel.type !== 2) return interaction.reply({ embeds: [embedError(t('INVALID_CHANNEL'))], ephemeral: true });
            const all = await db.all();
            let entry = null;
            for (const value of Object.values(all)) {
                if (value.channelID === channel.id) { entry = value; break; }
            }
            if (!entry) return interaction.reply({ embeds: [embedError(t('CHANNEL_NOT_FOUND'))], ephemeral: true });
            const ownerId = entry.owner || entry.channelID.split('_')[1];
            const owner = await guild.members.fetch(ownerId).catch(()=>null);
            if (owner) await owner.send(`${t('NOTE_DM')}\n${text}`).catch(()=>{});
            return interaction.reply({ embeds: [embedSuccess(t('NOTE_SENT'))], ephemeral: true });
        }
        // --- Kullanıcıya VC banı ---
        if (sub === 'vcban') {
            const target = interaction.options.getUser('user');
            const ban = interaction.options.getBoolean('ban');
            let bans = (await db.get('vc_bans_va')) || [];
            if (ban) {
                if (!bans.includes(target.id)) bans.push(target.id);
            } else {
                bans = bans.filter(id => id !== target.id);
            }
            await db.set('vc_bans_va', bans);
            return interaction.reply({ embeds: [embedSuccess(ban ? t('VC_BAN_APPLIED') : t('VC_BAN_REMOVED'))], ephemeral: true });
        }
        // --- VC dondurma ---
        if (sub === 'freeze') {
            const channel = interaction.options.getChannel('vc');
            if (!channel || channel.type !== 2) return interaction.reply({ embeds: [embedError(t('INVALID_CHANNEL'))], ephemeral: true });
            await channel.permissionOverwrites.edit(guild.roles.everyone.id, { Connect: false });
            return interaction.reply({ embeds: [embedSuccess(t('VC_FROZEN'))], ephemeral: true });
        }
    }
};
