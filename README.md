```
# v14-AlphaBase Discord Bot

A next-generation Discord bot for advanced private voice channel management, built with **Discord.js v14** and powered by the **AlphaBase** persistent database module.

---

## ✨ Features

- 🔒 **Private Voice Channel System**  
  Users can create, manage, and customize their own voice channels with advanced controls.

- 💬 **Full Slash Command Support**  
  All commands use Discord slash commands for a modern and responsive experience.

- 🌐 **Multi-language Support**  
  All user-facing text is internationalized via `lang.js` — supports **English** and **Turkish** out of the box.

- 🛡️ **Advanced Admin Controls**  
  Voice admin roles, forced control of channels, global visibility settings, and more.

- 💾 **Persistent Storage with AlphaBase**  
  All data (channels, users, bans, settings) is saved to `vcs.json` using the AlphaBase module.

- 🧹 **Automatic Cleanup**  
  Idle or empty private channels are auto-deleted based on settings.

- 📝 **Logging System**  
  All critical events (creation, deletion, transfers, etc.) can be logged to a configurable channel.

- 💡 **Backup Friendly**  
  The database is stored in a readable `.json` format for easy backups and restores.

---

## 🚀 Installation

1. **Configure the bot:**

   Create a `config.json` file:

   ```json
   {
     "DISCORD_TOKEN": "your-bot-token",
     "CLIENT_ID": "your-client-id",
     "language": "en"
   }
````

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Start the bot:**

   ```sh
   npm start
   ```

---

## 🧩 Core Commands

| Command       | Description                                                  |
| ------------- | ------------------------------------------------------------ |
| `/ping`       | Show bot latency.                                            |
| `/vc`         | Manage your private voice channel (add, remove, limit, etc.) |
| `/voiceadmin` | Grant or remove voice admin roles.                           |
| `/settings`   | Change global settings (timeout, visibility, etc.)           |
| `/logchannel` | Configure the log channel.                                   |
| `/va`         | Admin control over user-created channels.                    |

> All commands support **EN** and **TR** languages automatically.

---

## 🎮 Example Usage

* **Create your room**
  Join the starter voice channel (e.g. `➕ Create Room`). A personal voice channel will be created automatically.

* **Customize your room**

  * `/vc adduser @user` — Allow someone to join
  * `/vc limit 4` — Set a user limit
  * `/vc kick @user` — Remove someone from your room

* **Admin control**

  * `/voiceadmin @role` — Grant admin rights to a role
  * `/va control` — Force lock/unlock/move any room
  * `/settings set idleTimeout 10` — Change idle auto-delete time

---

## 🗃️ AlphaBase Integration

> **AlphaBase** is a high-performance JSON database built for bots.

* No SQL or external DB needed
* Instant writes & automatic saves
* Human-readable `.json` file
* Easy backup and restore (`vcs.json`)

### Examples

```js
// Get user’s voice channel data
const userVC = await AlphaBase.get('vc_' + userId);

// Set global settings
await AlphaBase.set('bot_settings', {
  idleTimeout: 10,
  defaultVisibility: 'public'
});

// Get all records
const allData = await AlphaBase.all();
```

📦 Backup files are created inside the `/backups/` folder automatically.

---

## 📁 File Structure

```
.
├── alpha.js         # Main bot entry
├── commands/        # Slash command handlers
├── lang.js          # Language strings
├── vcs.json         # AlphaBase database file
├── backups/         # Auto-generated JSON backups
└── config.json      # Your bot token & config
```

---

## 🤝 Contributing

* Pull requests are welcome!
* For bugs or feature requests, open an issue on GitHub.
* For help or questions, open a discussion or contact the author.

---

## 📜 License

MIT
