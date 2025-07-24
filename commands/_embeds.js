// Zengin ve ikonlu embed fonksiyonları
const { EmbedBuilder } = require('discord.js');

function embedSuccess(msg, opts = {}) {
    return new EmbedBuilder()
        .setColor(0x43b581)
        .setTitle(opts.title || require('../lang').t('EMBED_SUCCESS_TITLE'))
        .setDescription('✅ ' + msg)
        .setTimestamp()
        .setFooter({ text: opts.footer || require('../lang').t('EMBED_FOOTER'), iconURL: opts.icon || 'https://cdn-icons-png.flaticon.com/512/190/190411.png' });
}

function embedError(msg, opts = {}) {
    return new EmbedBuilder()
        .setColor(0xed4245)
        .setTitle(opts.title || require('../lang').t('EMBED_ERROR_TITLE'))
        .setDescription('❌ ' + msg)
        .setTimestamp()
        .setFooter({ text: opts.footer || require('../lang').t('EMBED_FOOTER'), iconURL: opts.icon || 'https://cdn-icons-png.flaticon.com/512/463/463612.png' });
}

function embedInfo(msg, opts = {}) {
    return new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle(opts.title || require('../lang').t('EMBED_INFO_TITLE'))
        .setDescription(msg)
        .setTimestamp()
        .setFooter({ text: opts.footer || require('../lang').t('EMBED_FOOTER'), iconURL: opts.icon || 'https://cdn-icons-png.flaticon.com/512/190/190411.png' });
}

module.exports = { embedSuccess, embedError, embedInfo };
