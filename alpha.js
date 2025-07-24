const fs = require('fs');
const { Client, GatewayIntentBits, Partials, PermissionsBitField, ChannelType, Collection, REST, Routes, SlashCommandBuilder } = require('discord.js');
const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
const BOT_STATUS = config.BOT_STATUS || 'dnd';
const BOT_ACTIVITY = config.BOT_ACTIVITY || { name: 'Made by Alpha', type: 'PLAYING' };





const AlphaBaseLib = require('alphabase');
/*
AlphaBase is initialized below without encryption for demonstration and local development purposes.
- filePath: Path to the JSON file used for persistent storage of all voice channel and bot settings data.
- encryption: Set to 'None' for unencrypted storage. For production, consider using a secure encryption method.
All bot state, user preferences, and channel metadata are stored and retrieved via this AlphaBase instance.
*/
const AlphaBase = new AlphaBaseLib({
    filePath: './vcs.json',
    encryption: 'None'
});

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ],
    partials: [Partials.Channel]
});

const path = require('path');
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    if (command.data && command.execute) {
        client.commands.set(command.data.name, command);
    }
}

async function isVoiceAdmin(guild, userId) {
    const adminRoles = (await AlphaBase.get('voice_admin_roles')) || [];
    const member = await guild.members.fetch(userId).catch(() => null);
    if (!member) return false;
    return member.roles.cache.some(r => adminRoles.includes(r.id));
}

async function logEvent(guild, message) {
    const logChannelId = await AlphaBase.get('log_channel_id');
    if (!logChannelId) return;
    const channel = guild.channels.cache.get(logChannelId);
    if (channel && channel.isTextBased()) {
        channel.send({ content: message }).catch(() => {});
    }
}

async function getSettings() {
    return (await AlphaBase.get('bot_settings')) || { idleTimeout: 5, defaultVisibility: 'public' };
}
async function setSettings(newSettings) {
    await AlphaBase.set('bot_settings', newSettings);
}

async function getUserPrefs(userId) {
    return (await AlphaBase.get('prefs_' + userId)) || {};
}
async function setUserPrefs(userId, prefs) {
    await AlphaBase.set('prefs_' + userId, prefs);
}

async function getUserVC(userId) {
    return await AlphaBase.get('vc_' + userId);
}

async function isVCManager(guild, userId, vcOwnerId) {
    if (userId === vcOwnerId) return true;
    return await isVoiceAdmin(guild, userId);
}

async function tryDeleteVC(guild, channelId) {
    const all = await AlphaBase.all();
    for (const [key, value] of Object.entries(all)) {
        if (value.channelID === channelId) {
            const channel = guild.channels.cache.get(channelId);
            if (channel && channel.members.size === 0) {
                await channel.delete('Otomatik boş VC silindi');
                await db.delete(key);
                await logEvent(guild, `VC silindi: ${value.name} (${channelId})`);
            }
        }
    }
}

client.once('ready', async () => {
    console.log(`Bot giriş yaptı: ${client.user.tag}`);
    // Durum ve aktivite ayarla
    client.user.setStatus(BOT_STATUS);
    if (BOT_ACTIVITY && BOT_ACTIVITY.name) {
        client.user.setActivity(BOT_ACTIVITY.name, { type: BOT_ACTIVITY.type || 'PLAYING' });
    }

    // Slash komutları yüklü mü kontrol et, yüklü değilse yükle
    const rest = new REST({ version: '10' }).setToken(config.DISCORD_TOKEN);
    const appId = client.application?.id || config.CLIENT_ID;
    let shouldRegister = false;
    try {
        // Discord API'den mevcut komutları çek
        const currentCommands = await rest.get(Routes.applicationCommands(appId));
        const localCommands = Array.from(client.commands.values()).map(cmd => cmd.data.toJSON());
        // Komut sayısı veya isimleri farklıysa yükle
        if (
            currentCommands.length !== localCommands.length ||
            currentCommands.some((c, i) => c.name !== localCommands[i]?.name)
        ) {
            shouldRegister = true;
        }
    } catch (e) {
        shouldRegister = true;
    }
    if (shouldRegister) {
        try {
            await rest.put(
                Routes.applicationCommands(appId),
                { body: Array.from(client.commands.values()).map(cmd => cmd.data.toJSON()) },
            );
            console.log('Slash komutları Discord API ile senkronize edildi.');
        } catch (e) {
            console.error('Slash komutları yüklenemedi:', e);
        }
    } else {
        console.log('Slash komutları zaten yüklü, tekrar yüklenmedi.');
    }

    for (const guild of client.guilds.cache.values()) {
        let categoryId = await AlphaBase.get('vc_category_id');
        let starterId = await AlphaBase.get('vc_starter_id');
        let category = categoryId ? guild.channels.cache.get(categoryId) : null;
        let starter = starterId ? guild.channels.cache.get(starterId) : null;
        const { t } = require('./lang');
        if (!category) {
            category = await guild.channels.create({
                name: t('VC_CATEGORY_NAME'),
                type: ChannelType.GuildCategory
            });
            await AlphaBase.set('vc_category_id', category.id);
        }
        if (!starter) {
            const existing = guild.channels.cache.find(c => c.type === ChannelType.GuildVoice && c.name === t('VC_STARTER_NAME'));
            if (existing) {
                await AlphaBase.set('vc_starter_id', existing.id);
            } else {
                starter = await guild.channels.create({
                    name: t('VC_STARTER_NAME'),
                    type: ChannelType.GuildVoice,
                    parent: category.id,
                    userLimit: 1
                });
                await AlphaBase.set('vc_starter_id', starter.id);
            }
        }
    }
});

client.on('voiceStateUpdate', async (oldState, newState) => {
    const { t } = require('./lang');
    try {
        const guild = newState.guild;
        const starterId = await AlphaBase.get('vc_starter_id');
        const categoryId = await AlphaBase.get('vc_category_id');
        if (!starterId || !categoryId) return;
        if (newState.channelId === starterId && oldState.channelId !== starterId) {
            const bans = (await AlphaBase.get('vc_bans')) || [];
            if (bans.includes(newState.id)) {
                const { t } = require('./lang');
                const member = await guild.members.fetch(newState.id).catch(() => null);
                if (member) member.send('❌ ' + t('VC_CREATE_BANNED')).catch(() => {});
                return;
            }
            if (await getUserVC(newState.id)) return;
            const prefs = await getUserPrefs(newState.id);
            const settings = await getSettings();
            const category = guild.channels.cache.get(categoryId);
            const member = await guild.members.fetch(newState.id).catch(() => null);
            const displayName = member ? member.displayName : t('USER_PLACEHOLDER', { id: newState.id });
            const channel = await guild.channels.create({
                name: prefs.channelNameFormat || t('VC_DEFAULT_NAME', { displayName }),
                type: ChannelType.GuildVoice,
                parent: category.id,
                permissionOverwrites: [
                    {
                        id: guild.roles.everyone.id,
                        allow: [PermissionsBitField.Flags.Connect],
                        deny: settings.defaultVisibility === 'private' ? [PermissionsBitField.Flags.Connect] : []
                    },
                    {
                        id: newState.id,
                        allow: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.ManageChannels]
                    }
                ]
            });
            await AlphaBase.set('vc_' + newState.id, {
                channelID: channel.id,
                name: channel.name,
                permissions: {},
                createdAt: Date.now(),
                lastActive: Date.now(),
                isLocked: settings.defaultVisibility === 'private',
                isHidden: false,
                admins: [],
                allowedRoles: [],
                lockedRoles: [],
                allowedUsers: [],
                kickedUsers: [],
                userLimit: null,
                joinHistory: [], // { userId, joinedAt, leftAt }
                transferHistory: [] // { from, to, date }
            });
            if (member) await member.voice.setChannel(channel).catch(() => {});
            await logEvent(guild, t('VC_CREATED_LOG', { name: channel.name, user: `<@${newState.id}>` }));

            const entry = await AlphaBase.get('vc_' + newState.id);
            entry.joinHistory.push({ userId: newState.id, joinedAt: Date.now(), leftAt: null });
            await AlphaBase.set('vc_' + newState.id, entry);
        }
        if (oldState.channelId && oldState.channelId !== starterId) {
            const channel = guild.channels.cache.get(oldState.channelId);
            if (channel && channel.parentId === categoryId) {
                const all = await AlphaBase.all();
                for (const [key, value] of Object.entries(all)) {
                    if (value.channelID === channel.id && value.joinHistory) {
                        const jh = value.joinHistory;
                        for (let i = jh.length - 1; i >= 0; i--) {
                            if (jh[i].userId === oldState.id && !jh[i].leftAt) {
                                jh[i].leftAt = Date.now();
                                break;
                            }
                        }
                        await AlphaBase.set(key, value);
                    }
                }
                if (channel.members.size === 0) {
                    for (const [key, value] of Object.entries(all)) {
                        if (value.channelID === channel.id) {
                            value.lastActive = Date.now();
                            await AlphaBase.set(key, value);
                        }
                    }
                    await tryDeleteVC(guild, channel.id);
                }
            }
        }
    } catch (e) {
        console.error('voiceStateUpdate error:', e);
    }
});

setInterval(async () => {
    const all = await AlphaBase.all();
    const now = Date.now();
    const THIRTY_MIN = 5 * 60 * 1000;
    for (const [key, value] of Object.entries(all)) {
        if (value.channelID && value.lastActive && now - value.lastActive > THIRTY_MIN) {
            const guild = client.guilds.cache.first();
            if (!guild) continue;
            const channel = guild.channels.cache.get(value.channelID);
            if (channel && channel.members.size === 0) {
                await channel.delete(t('VC_IDLE_DELETED_REASON'));
                await AlphaBase.delete(key);
                await logEvent(guild, t('VC_IDLE_DELETED_LOG', { name: value.name, id: value.channelID }));
            }
        }
    }
}, 5 * 60 * 1000);

const { embedError } = require('./commands/_embeds');
const cooldowns = new Map();
const COOLDOWN_SECONDS = 5;

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    // Komut kullanım limiti (cooldown)
    const key = `${interaction.commandName}_${interaction.user.id}`;
    const now = Date.now();
    if (cooldowns.has(key)) {
        const expire = cooldowns.get(key);
        if (now < expire) {
            const diff = Math.ceil((expire - now) / 1000);
            return interaction.reply({ embeds: [embedError(`Bu komutu tekrar kullanmak için ${diff} saniye beklemelisin!`, { title: 'Çok Hızlı!' })], ephemeral: true });
        }
    }
    cooldowns.set(key, now + COOLDOWN_SECONDS * 1000);

    try {
        await command.execute(interaction, AlphaBase);
    } catch (error) {
        console.error(error);
        const { t } = require('./lang');
        await interaction.reply({ content: t('COMMAND_ERROR'), ephemeral: true });
    }
});

client.login(config.DISCORD_TOKEN);
