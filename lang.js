const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
const lang = config.language || 'tr';

const strings = {
  tr: {
    NO_VC: 'Bir odanız yok.',
    CHANNEL_NOT_FOUND: 'Kanal bulunamadı.',
    USER_REQUIRED: 'Bir kullanıcı seçmelisiniz.',
    ROLE_REQUIRED: 'Bir rol seçmelisiniz.',
    LIMIT_RANGE: 'Limit 0-99 arası olmalı.',
    NOT_ADMIN: 'Sadece admin veya voice admin yetkisine sahip olanlar bu komutu kullanabilir.',
    NOT_VOICE_ADMIN: 'Sadece voice admin yetkisine sahip olanlar bu komutu kullanabilir.',
    BAN_ALREADY: 'Kullanıcı zaten banlı.',
    BAN_REMOVED: 'Kullanıcının VC banı kaldırıldı!',
    BAN_NOT_FOUND: 'Kullanıcı zaten banlı değil.',
    SUCCESS: 'İşlem başarılı!',
    ERROR: 'Bir hata oluştu.',
    ALREADY_IN_VC: 'Zaten bir odanız var.',
    DM_FAIL: 'Kullanıcıya DM gönderilemedi.',
    INVITE_SENT: 'Kullanıcıya davet gönderildi.',
    USER_ADDED: 'Kullanıcı kanala eklendi.',
    USER_REMOVED: 'Kullanıcı kanaldan çıkarıldı.',
    ROLE_ALLOWED: 'Rol artık kanala katılabilir!',
    ROLE_LOCKED: 'Rol artık kanala katılamaz!',
    LIMIT_SET: 'Kanal kullanıcı limiti ayarlandı.',
    LIMIT_REMOVED: 'Kullanıcı limiti kaldırıldı.',
    USER_ALLOWED: 'Kullanıcı artık kanala katılabilir!',
    USER_KICKED: 'Kullanıcı kanaldan atıldı ve engellendi!',
    ACTIVE_VC_NONE: 'Aktif özel oda yok.',
    VC_LIST: 'Aktif Özel Odalar',
    ADMINS_LIST: 'Voice Admin Rolleri ve Kullanıcıları',
    ROLES: 'Roller',
    USERS: 'Kullanıcılar',
    NO_ROLE: 'Yok',
    NO_USER: 'Yok',
    VC_STATS_TITLE: 'Kanal Bilgileriniz',
    VC_STATS_DESC: 'Kanal: {channel}\nAdı: {name}\nOluşturulma: {date}',
    VC_STATS_LOCKED: 'Kilitli mi?',
    VC_STATS_HIDDEN: 'Gizli mi?',
    VC_STATS_LIMIT: 'Kullanıcı Limiti',
    VC_STATS_ALLOWED_ROLES: 'İzinli Roller',
    VC_STATS_LOCKED_ROLES: 'Kilitli Roller',
    VC_STATS_ALLOWED_USERS: 'İzinli Kullanıcılar',
    VC_STATS_KICKED_USERS: 'Atılan Kullanıcılar',
    VC_STATS_TOTAL_TIME: 'Toplam Kullanım Süresi',
    VC_STATS_MINUTES: '{mins} dakika',
    VC_STATS_HISTORY: 'Kanal Geçmişi',
    VC_STATS_YES: 'Evet',
    VC_STATS_NO: 'Hayır',
    VC_STATS_NONE: 'Yok',
    VC_STATS_UNLIMITED: 'Limitsiz',
    VC_STATS_INSIDE: 'Şu an içeride',

    VC_CATEGORY_NAME: 'Private Channels',
    VC_STARTER_NAME: '➕ Oda Oluştur',
    ONLY_OWNER: 'Bu işlemi sadece oda sahibi yapabilir.',
    ONLY_ADMIN: 'Bu işlemi sadece admin yapabilir.',
    ONLY_VOICE_ADMIN: 'Bu işlemi sadece voice admin yapabilir.',
    NOTE_SENT: 'Not başarıyla eklendi ve oda sahibine DM gönderildi.',
    NOTE_DM: 'VC için bir notunuz var:',
    HIDE_DESC: 'Kanalınızı gizler (sadece sizin görebileceğiniz şekilde ayarlar)',
    HIDE_SUCCESS: 'Kanal başarıyla gizlendi!',
    LOCK_DESC: 'Kanalınıza girişleri engeller (kilitler)',
    LOCK_SUCCESS: 'Kanal başarıyla kilitlendi!',
    LOGCHANNEL_DESC: 'Log kanalını ayarla veya sıfırla',
    LOGCHANNEL_SET_DESC: 'Log kanalını ayarla',
    LOGCHANNEL_RESET_DESC: 'Log kanalını kaldır',
    LOGCHANNEL_OPTION: 'Log kanalı',
    LOGCHANNEL_TEXT_REQUIRED: 'Seçilen kanal bir metin kanalı olmalı!',
    LOGCHANNEL_SET_SUCCESS: 'Log kanalı başarıyla {channel} olarak ayarlandı!',
    LOGCHANNEL_RESET_SUCCESS: 'Log kanalı başarıyla kaldırıldı!',
    SETTINGS_DESC: 'Bot ayarlarını yönet (sadece voice adminler)',
    SETTINGS_SET_DESC: 'Bir ayarı değiştir',
    SETTINGS_OPTION_DESC: 'Ayar ismi (idleTimeout, defaultVisibility)',
    SETTINGS_VALUE_DESC: 'Yeni değer',
    SETTINGS_GET_DESC: 'Tüm ayarları göster',
    VA_DESC: 'Voice admin komutları',
    VA_CONTROL_DESC: 'Bir VC üzerinde tam kontrol (lock, unlock, limit, kick, allow, freeze, unfreeze, reset, desc, move)',
    VA_VC_DESC: 'Yönetilecek VC',
    VA_ACTION_DESC: 'İşlem: lock, unlock, limit, kick, allow, freeze, unfreeze, reset, desc, move',
    VA_TARGET_DESC: 'Hedef kullanıcı (kick/allow için)',
    VA_ROLE_DESC: 'Hedef rol (allow için)',
    VA_NUMBER_DESC: 'Limit (limit için)',
    VA_DESC_OPTION: 'Açıklama (desc için)',
    VA_CATEGORY_DESC: 'Yeni kategori (move için)',
    VA_TRANSFER_DESC: 'Bir VC sahipliğini zorla değiştir',
    VA_NEW_OWNER_DESC: 'Yeni sahip',
    VA_CLEANUP_DESC: 'Boş/aktif olmayan tüm VCleri topluca sil',
    VA_LISTUSERS_DESC: 'Bir VCdeki kullanıcıları ve geçmişi göster',
    VA_NOTE_DESC: 'Bir VCye not ekle ve sahibine DM gönder',
    VA_TEXT_DESC: 'Not içeriği',
    VA_VCBAN_DESC: 'Bir kullanıcıya VC banı uygula/kaldır',
    VA_USER_DESC: 'Kullanıcı',
    VA_BAN_DESC: 'Banla mı? (true/false)',
    VA_FREEZE_DESC: 'Bir VCyi dondur (kimse girip çıkamaz)',
    VC_FROZEN: 'VC donduruldu, kimse giriş yapamaz!',
    VC_UNFROZEN: 'VC dondurma kaldırıldı!',
    VC_LOCKED: 'VC kilitlendi!',
    VC_UNLOCKED: 'VC açıldı!',
    VC_RESET: 'VC ayarları sıfırlandı!',
    VC_DESC_SET: 'Açıklama kaydedildi!',
    VC_MOVED: 'VC yeni kategoriye taşındı!',
    VC_TRANSFERRED: 'VC sahipliği yeni kullanıcıya verildi!',
    VC_CLEANED: 'Toplu temizlik tamamlandı!',
    VC_ALREADY_BANNED: 'Kullanıcı zaten banlı.',
    VC_BAN_APPLIED: 'Kullanıcıya ban uygulandı.',
    VC_BAN_REMOVED: 'Kullanıcının banı kaldırıldı.',
    VC_NOT_BANNED: 'Kullanıcı banlı değil.',
    INVALID_ACTION: 'Geçersiz işlem!',
    INVALID_CATEGORY: 'Geçerli bir kategori seçmelisiniz.',
    INVALID_CHANNEL: 'Geçerli bir ses kanalı seçmelisiniz.',
    INVALID_DESC: 'Açıklama girilmedi.',
    INVALID_LIMIT: 'Geçersiz limit.',
    INVALID_USER: 'Geçersiz kullanıcı.',
    INVALID_ROLE: 'Geçersiz rol.',
    INVALID_OPTION: 'Geçersiz seçenek.',
    VC_CREATE_BANNED: 'Özel oda oluşturma yetkiniz bir yönetici tarafından kısıtlanmıştır.',
    USER_PLACEHOLDER: 'Kullanıcı-{id}',
    VC_DEFAULT_NAME: '{displayName} Odası',
    VC_CREATED_LOG: 'VC oluşturuldu: {name} ({user})',
    VC_AUTO_DELETED_REASON: 'Otomatik boş VC silindi',
    VC_DELETED_LOG: 'VC silindi: {name} ({id})',
    VC_IDLE_DELETED_REASON: '5dk boş kalan VC otomatik silindi',
    VC_IDLE_DELETED_LOG: 'VC otomatik temizlendi: {name} ({id})',
    COMMAND_ERROR: 'Komut çalıştırılırken bir hata oluştu.',
    VC_DESC: 'Kanal yönetim komutları',
    VC_ADDUSER_DESC: 'Kanalınıza kullanıcı ekleyin',
    VC_ADDUSER_USER_DESC: 'Eklenecek kullanıcı',
    VC_REMOVEUSER_DESC: 'Kanalınızdan kullanıcı çıkarın',
    VC_REMOVEUSER_USER_DESC: 'Çıkarılacak kullanıcı',
    VC_INVITE_DESC: 'Bir kullanıcıya davet gönderin',
    VC_INVITE_USER_DESC: 'Davet edilecek kullanıcı',
    VC_STATS_DESC: 'Kanal istatistiklerini göster',
    VC_ALLOWROLE_DESC: 'Kanalınıza rol ekleyin (katılabilsin)',
    VC_ALLOWROLE_ROLE_DESC: 'Eklenecek rol',
    VC_LOCKROLE_DESC: 'Kanalınıza rol kilitleyin (katılamasın)',
    VC_LOCKROLE_ROLE_DESC: 'Kilitlenecek rol',
    VC_LIMIT_DESC: 'Kanal kullanıcı limitini ayarla',
    VC_LIMIT_NUMBER_DESC: 'Limit (2-99, 0=limitsiz)',
    VC_ALLOWUSER_DESC: 'Kanalınıza kullanıcı ekleyin (izinli)',
    VC_ALLOWUSER_USER_DESC: 'Eklenecek kullanıcı',
    VC_KICK_DESC: 'Kanalınızdan kullanıcı atın (ve engelle)',
    VC_KICK_USER_DESC: 'Atılacak kullanıcı',
    VC_LIST_DESC: 'Tüm aktif özel odaları listeler (sadece voice admin)',
    VC_ADMINS_DESC: 'Voice admin rollerini ve kullanıcılarını listeler (admin veya voice admin)',
    // Voiceadmin
    VOICEADMIN_DESC: 'Voice admin rolü ekle/çıkar',
    VOICEADMIN_ROLE_DESC: 'Voice admin rolü',
    VOICEADMIN_ONLY_OWNER_ADMIN: 'Sadece sunucu sahibi veya Administrator yetkisine sahip olanlar bu komutu kullanabilir.',
    VOICEADMIN_ADDED: 'Rol voice admin listesine eklendi!',
    VOICEADMIN_REMOVED: 'Rol voice admin listesinden çıkarıldı!',
    // Rename
    RENAME_DESC: 'Kanal adını değiştir',
    RENAME_OPTION: 'Yeni kanal adı',
    RENAME_LENGTH: 'Kanal adı 3-32 karakter olmalı.',
    RENAME_CHARS: 'Kanal adı sadece harf, rakam, boşluk ve -_ karakterlerini içerebilir.',
    RENAME_SUCCESS: 'Kanal adı başarıyla "{name}" olarak değiştirildi!',
    // Embed başlıkları ve footer
    RENAME_DESC: 'Change channel name',
    RENAME_OPTION: 'New channel name',
    RENAME_LENGTH: 'Channel name must be 3-32 characters.',
    RENAME_CHARS: 'Channel name can only contain letters, numbers, space, - and _ characters.',
    RENAME_SUCCESS: 'Channel name successfully changed to "{name}"!',
    VOICEADMIN_DESC: 'Add/remove voice admin role',
    VOICEADMIN_ROLE_DESC: 'Voice admin role',
    VOICEADMIN_ONLY_OWNER_ADMIN: 'Only the server owner or Administrator can use this command.',
    VOICEADMIN_ADDED: 'Role added to voice admin list!',
    VOICEADMIN_REMOVED: 'Role removed from voice admin list!',
    EMBED_SUCCESS_TITLE: 'Başarılı!',
    EMBED_ERROR_TITLE: 'Hata!',
    EMBED_INFO_TITLE: 'Bilgi',
    EMBED_FOOTER: 'Alpha System',
    // Help komutu
    HELP_DESC: 'Tüm komutlar ve açıklamaları hakkında bilgi al.',
    HELP_TITLE: 'Yardım Menüsü',
    HELP_DESC_LONG: 'Aşağıda botun tüm komutları kategorilere ayrılmış şekilde listelenmiştir:',
    HELP_CAT_VC: '🔊 Kanal Yönetimi',
    HELP_VC_COMMANDS: '`/vc adduser <kullanıcı>`  ➔  Kanalınıza kullanıcı ekler\n'
      + '`/vc removeuser <kullanıcı>`  ➔  Kullanıcıyı çıkarır\n'
      + '`/vc invite <kullanıcı>`  ➔  Davet gönderir (DM)\n'
      + '`/vc stats`  ➔  Gelişmiş kanal istatistiklerini gösterir\n'
      + '`/vc allowrole <rol>`  ➔  Seçili role kanala katılma izni verir\n'
      + '`/vc lockrole <rol>`  ➔  Seçili rolün kanala katılmasını engeller\n'
      + '`/vc limit <sayı>`  ➔  Kanal kullanıcı limitini ayarlar\n'
      + '`/vc allowuser <kullanıcı>`  ➔  Kullanıcıya özel izin verir\n'
      + '`/vc kick <kullanıcı>`  ➔  Kullanıcıyı kanaldan atar ve engeller\n'
      + '`/vc unban <kullanıcı>`  ➔  (Admin) VC ile atılan banı kaldırır\n'
      + '`/vc list`  ➔  Tüm aktif özel odaları listeler (sadece voice admin)\n'
      + '`/vc admins`  ➔  Voice admin rollerini ve kullanıcılarını listeler (admin/voice admin)',
    HELP_CAT_SECURITY: '🔒 Kanal Güvenlik',
    HELP_SECURITY_COMMANDS: '`/lock`  ➔  Kanalı kilitler\n'
      + '`/unlock`  ➔  Kanalı açar\n'
      + '`/hide`  ➔  Kanalı gizler\n'
      + '`/unhide`  ➔  Kanalı görünür yapar',
    HELP_CAT_SETTINGS: '📝 Kanal Ayarları',
    HELP_SETTINGS_COMMANDS: '`/rename <isim>`  ➔  Kanal adını değiştirir (3-32 karakter, özel karakter kısıtlaması)\n'
      + '`/transfer <kullanıcı>`  ➔  Sahipliği devreder\n'
      + '`/myvc`  ➔  Kanal bilgilerini gösterir',
    HELP_CAT_ADMIN: '⚙️ Yönetici Komutları',
    HELP_ADMIN_COMMANDS: '`/voiceadmin <rol>`  ➔  Voice admin rolü ekler/çıkarır\n'
      + '`/logchannel set <kanal>`  ➔  Log kanalını ayarlar\n'
      + '`/logchannel reset`  ➔  Log kanalını kaldırır\n'
      + '`/settings set|get`  ➔  Bot ayarlarını değiştirir/gösterir\n'
      + '`/vcban <kullanıcı>`  ➔  Kullanıcıyı özel oda oluşturmaktan men eder/izin verir (sadece admin)\n'
      + '`/va control <vc> <action> [hedef]`  ➔  Seçili VC üzerinde tam kontrol: lock, unlock, limit, kick, allow, freeze, unfreeze, reset, desc, move\n'
      + '`/va transfer <vc> <kullanıcı>`  ➔  Bir VC sahipliğini zorla değiştir\n'
      + '`/va cleanup`  ➔  Boş/aktif olmayan tüm VCleri topluca sil\n'
      + '`/va listusers <vc>`  ➔  Bir VCdeki kullanıcıları ve geçmişi göster\n'
      + '`/va note <vc> <not>`  ➔  Bir VCye not ekle ve sahibine DM gönder\n'
      + '`/va vcban <kullanıcı> <ban: true/false>`  ➔  Kullanıcıya VA banı uygula/kaldır (VA banı sadece adminler tarafından kaldırılabilir, VC banı ise oda sahipleri veya adminler tarafından kaldırılabilir)\n'
      + '`/va freeze <vc>`  ➔  Bir VCyi dondur (kimse girip çıkamaz)',
    HELP_CAT_OTHER: '🔔 Diğer',
    HELP_OTHER_COMMANDS: '`/ping`  ➔  Botun gecikmesini gösterir',
    HELP_FOOTER: 'Her komutun detaylı kullanımı için /komut ismini yazabilirsiniz.'
  },
  en: {
    NO_VC: 'You do not have a room.',
    CHANNEL_NOT_FOUND: 'Channel not found.',
    USER_REQUIRED: 'You must select a user.',
    ROLE_REQUIRED: 'You must select a role.',
    LIMIT_RANGE: 'Limit must be between 0-99.',
    NOT_ADMIN: 'Only admin or voice admin can use this command.',
    NOT_VOICE_ADMIN: 'Only voice admin can use this command.',
    BAN_ALREADY: 'User is already banned.',
    BAN_REMOVED: 'User VC ban removed!',
    BAN_NOT_FOUND: 'User is not banned.',
    SUCCESS: 'Operation successful!',
    ERROR: 'An error occurred.',
    ALREADY_IN_VC: 'You already have a room.',
    DM_FAIL: 'Failed to send DM to user.',
    INVITE_SENT: 'Invite sent to user.',
    USER_ADDED: 'User added to channel.',
    USER_REMOVED: 'User removed from channel.',
    ROLE_ALLOWED: 'Role can now join the channel!',
    ROLE_LOCKED: 'Role can no longer join the channel!',
    LIMIT_SET: 'Channel user limit set.',
    LIMIT_REMOVED: 'User limit removed.',
    USER_ALLOWED: 'User can now join the channel!',
    USER_KICKED: 'User kicked and blocked from the channel!',
    ACTIVE_VC_NONE: 'No active private room.',
    VC_LIST: 'Active Private Rooms',
    ADMINS_LIST: 'Voice Admin Roles and Users',
    ROLES: 'Roles',
    USERS: 'Users',
    NO_ROLE: 'None',
    NO_USER: 'None',
    ONLY_OWNER: 'Only the room owner can do this.',
    VC_STATS_TITLE: 'Your Channel Info',
    VC_STATS_DESC: 'Channel: {channel}\nName: {name}\nCreated: {date}',
    VC_STATS_LOCKED: 'Locked?',
    VC_STATS_HIDDEN: 'Hidden?',
    VC_STATS_LIMIT: 'User Limit',
    VC_STATS_ALLOWED_ROLES: 'Allowed Roles',
    VC_STATS_LOCKED_ROLES: 'Locked Roles',
    VC_STATS_ALLOWED_USERS: 'Allowed Users',
    VC_STATS_KICKED_USERS: 'Kicked Users',
    VC_STATS_TOTAL_TIME: 'Total Usage Time',
    VC_STATS_MINUTES: '{mins} minutes',
    VC_STATS_HISTORY: 'Channel History',
    VC_STATS_YES: 'Yes',
    VC_STATS_NO: 'No',
    VC_STATS_NONE: 'None',
    VC_STATS_UNLIMITED: 'Unlimited',
    VC_STATS_INSIDE: 'Currently inside',
    ONLY_ADMIN: 'Only admin can do this.',
    ONLY_VOICE_ADMIN: 'Only voice admin can do this.',
    NOTE_SENT: 'Note added and sent to the room owner via DM.',
    NOTE_DM: 'You have a note for your VC:',
    HIDE_DESC: 'Hide your channel (only you can see it)',
    HIDE_SUCCESS: 'Channel successfully hidden!',
    LOCK_DESC: 'Lock your channel (prevent others from joining)',
    LOCK_SUCCESS: 'Channel successfully locked!',
    LOGCHANNEL_DESC: 'Set or reset the log channel',
    LOGCHANNEL_SET_DESC: 'Set log channel',
    LOGCHANNEL_RESET_DESC: 'Remove log channel',
    LOGCHANNEL_OPTION: 'Log channel',
    LOGCHANNEL_TEXT_REQUIRED: 'Selected channel must be a text channel!',
    LOGCHANNEL_SET_SUCCESS: 'Log channel successfully set to {channel}!',
    LOGCHANNEL_RESET_SUCCESS: 'Log channel successfully removed!',
    SETTINGS_DESC: 'Manage bot settings (voice admins only)',
    SETTINGS_SET_DESC: 'Change a setting',
    SETTINGS_OPTION_DESC: 'Setting name (idleTimeout, defaultVisibility)',
    SETTINGS_VALUE_DESC: 'New value',
    SETTINGS_GET_DESC: 'Show all settings',
    VA_DESC: 'Voice admin commands',
    VA_CONTROL_DESC: 'Full control over a VC (lock, unlock, limit, kick, allow, freeze, unfreeze, reset, desc, move)',
    VA_VC_DESC: 'VC to manage',
    VA_ACTION_DESC: 'Action: lock, unlock, limit, kick, allow, freeze, unfreeze, reset, desc, move',
    VA_TARGET_DESC: 'Target user (for kick/allow)',
    VA_ROLE_DESC: 'Target role (for allow)',
    VA_NUMBER_DESC: 'Limit (for limit)',
    VA_DESC_OPTION: 'Description (for desc)',
    VA_CATEGORY_DESC: 'New category (for move)',
    VA_TRANSFER_DESC: 'Force transfer VC ownership',
    VA_NEW_OWNER_DESC: 'New owner',
    VA_CLEANUP_DESC: 'Bulk delete all empty/inactive VCs',
    VA_LISTUSERS_DESC: 'Show users and history in a VC',
    VA_NOTE_DESC: 'Add a note to a VC and DM the owner',
    VA_TEXT_DESC: 'Note content',
    VA_VCBAN_DESC: 'Apply/remove VC ban to a user',
    VA_USER_DESC: 'User',
    VA_BAN_DESC: 'Ban? (true/false)',
    VA_FREEZE_DESC: 'Freeze a VC (nobody can join/leave)',
    VC_FROZEN: 'VC frozen, nobody can join!',
    VC_UNFROZEN: 'VC unfrozen!',
    VC_LOCKED: 'VC locked!',
    VC_UNLOCKED: 'VC unlocked!',
    VC_RESET: 'VC settings reset!',
    VC_DESC_SET: 'Description saved!',
    VC_MOVED: 'VC moved to new category!',
    VC_TRANSFERRED: 'VC ownership transferred to new user!',
    VC_CLEANED: 'Bulk cleanup completed!',
    VC_ALREADY_BANNED: 'User is already banned.',
    VC_BAN_APPLIED: 'User has been banned.',
    VC_BAN_REMOVED: 'User ban removed.',
    VC_NOT_BANNED: 'User is not banned.',
    INVALID_ACTION: 'Invalid action!',
    INVALID_CATEGORY: 'You must select a valid category.',
    INVALID_CHANNEL: 'You must select a valid voice channel.',
    INVALID_DESC: 'No description entered.',
    INVALID_LIMIT: 'Invalid limit.',
    INVALID_USER: 'Invalid user.',
    INVALID_ROLE: 'Invalid role.',
    INVALID_OPTION: 'Invalid option.',
    VC_CATEGORY_NAME: 'Private Channels',
    VC_STARTER_NAME: '➕ Create Room',
    VC_CREATE_BANNED: 'Your permission to create a private room has been restricted by an admin.',
    USER_PLACEHOLDER: 'User-{id}',
    VC_DEFAULT_NAME: '{displayName} Room',
    VC_CREATED_LOG: 'VC created: {name} ({user})',
    VC_AUTO_DELETED_REASON: 'Auto-deleted empty VC',
    VC_DELETED_LOG: 'VC deleted: {name} ({id})',
    VC_IDLE_DELETED_REASON: 'VC auto-deleted after 5 min idle',
    VC_IDLE_DELETED_LOG: 'VC auto-cleaned: {name} ({id})',
    COMMAND_ERROR: 'An error occurred while executing the command.',
    VC_DESC: 'Channel management commands',
    VC_ADDUSER_DESC: 'Add a user to your channel',
    VC_ADDUSER_USER_DESC: 'User to add',
    VC_REMOVEUSER_DESC: 'Remove a user from your channel',
    VC_REMOVEUSER_USER_DESC: 'User to remove',
    VC_INVITE_DESC: 'Send an invite to a user',
    VC_INVITE_USER_DESC: 'User to invite',
    VC_STATS_DESC: 'Show channel statistics',
    VC_ALLOWROLE_DESC: 'Allow a role to join your channel',
    VC_ALLOWROLE_ROLE_DESC: 'Role to allow',
    VC_LOCKROLE_DESC: 'Lock a role from your channel',
    VC_LOCKROLE_ROLE_DESC: 'Role to lock',
    VC_LIMIT_DESC: 'Set channel user limit',
    VC_LIMIT_NUMBER_DESC: 'Limit (2-99, 0=unlimited)',
    VC_ALLOWUSER_DESC: 'Allow a user to join (permitted)',
    VC_ALLOWUSER_USER_DESC: 'User to allow',
    VC_KICK_DESC: 'Kick and block a user from your channel',
    VC_KICK_USER_DESC: 'User to kick',
    VC_LIST_DESC: 'List all active private rooms (voice admin only)',
    VC_ADMINS_DESC: 'List voice admin roles and users (admin or voice admin)',
    // Embed titles and footer
    EMBED_SUCCESS_TITLE: 'Success!',
    EMBED_ERROR_TITLE: 'Error!',
    EMBED_INFO_TITLE: 'Info',
    EMBED_FOOTER: 'Alpha System',
    // Help command
    HELP_DESC: 'Get information about all commands and their descriptions.',
    HELP_TITLE: 'Help Menu',
    HELP_DESC_LONG: 'Below are all bot commands categorized:',
    HELP_CAT_VC: '🔊 Channel Management',
    HELP_VC_COMMANDS: '`/vc adduser <user>`  ➔  Adds a user to your channel\n'
      + '`/vc removeuser <user>`  ➔  Removes a user\n'
      + '`/vc invite <user>`  ➔  Sends an invite (DM)\n'
      + '`/vc stats`  ➔  Shows advanced channel statistics\n'
      + '`/vc allowrole <role>`  ➔  Allows the selected role to join\n'
      + '`/vc lockrole <role>`  ➔  Prevents the selected role from joining\n'
      + '`/vc limit <number>`  ➔  Sets channel user limit\n'
      + '`/vc allowuser <user>`  ➔  Grants special permission to a user\n'
      + '`/vc kick <user>`  ➔  Kicks and blocks a user\n'
      + '`/vc unban <user>`  ➔  (Admin) Removes VC ban\n'
      + '`/vc list`  ➔  Lists all active private rooms (voice admin only)\n'
      + '`/vc admins`  ➔  Lists voice admin roles and users (admin/voice admin)',
    HELP_CAT_SECURITY: '🔒 Channel Security',
    HELP_SECURITY_COMMANDS: '`/lock`  ➔  Locks the channel\n'
      + '`/unlock`  ➔  Unlocks the channel\n'
      + '`/hide`  ➔  Hides the channel\n'
      + '`/unhide`  ➔  Makes the channel visible',
    HELP_CAT_SETTINGS: '📝 Channel Settings',
    HELP_SETTINGS_COMMANDS: '`/rename <name>`  ➔  Changes channel name (3-32 chars, special char restrictions)\n'
      + '`/transfer <user>`  ➔  Transfers ownership\n'
      + '`/myvc`  ➔  Shows channel info',
    HELP_CAT_ADMIN: '⚙️ Admin Commands',
    HELP_ADMIN_COMMANDS: '`/voiceadmin <role>`  ➔  Add/remove voice admin role\n'
      + '`/logchannel set <channel>`  ➔  Set log channel\n'
      + '`/logchannel reset`  ➔  Remove log channel\n'
      + '`/settings set|get`  ➔  Change/show bot settings\n'
      + '`/vcban <user>`  ➔  Ban/unban user from creating private rooms (admin only)\n'
      + '`/va control <vc> <action> [target]`  ➔  Full control over selected VC: lock, unlock, limit, kick, allow, freeze, unfreeze, reset, desc, move\n'
      + '`/va transfer <vc> <user>`  ➔  Force transfer VC ownership\n'
      + '`/va cleanup`  ➔  Bulk delete all empty/inactive VCs\n'
      + '`/va listusers <vc>`  ➔  Show users and history in a VC\n'
      + '`/va note <vc> <note>`  ➔  Add a note to a VC and DM the owner\n'
      + '`/va vcban <user> <ban: true/false>`  ➔  Apply/remove VA ban (VA ban can only be removed by admins, VC ban can be removed by owners or admins)\n'
      + '`/va freeze <vc>`  ➔  Freeze a VC (nobody can join/leave)',
    HELP_CAT_OTHER: '🔔 Other',
    HELP_OTHER_COMMANDS: '`/ping`  ➔  Shows bot latency',
    HELP_FOOTER: 'For detailed usage of each command, type /command name.'
  }
};

function t(key, params) {
  let str = strings[lang][key] || strings['tr'][key] || key;
  if (params && typeof str === 'string') {
    for (const [k, v] of Object.entries(params)) {
      str = str.replace(new RegExp(`{${k}}`, 'g'), v);
    }
  }
  return str;
}

module.exports = { t };
