const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys");

const readline = require("readline");

const OWNER = "917699817202";

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("session");

  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false
  });

  // 🔐 Pairing Code System
  if (!sock.authState.creds.registered) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question("📞 Enter your number (91XXXXXXXXXX): ", async (number) => {
      const code = await sock.requestPairingCode(number);
      console.log(`🔑 Pairing Code: ${code}`);
      rl.close();
    });
  }

  sock.ev.on("creds.update", saveCreds);

  // 📩 Message Listener
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message) return;

    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text;

    const from = msg.key.remoteJid;

    if (!text) return;

    // 📜 MENU COMMAND
    if (text === ".menu") {
      const menu = `
🤖 *JB X MINI BOT*

👑 Owner: JB PAPA 71
📞 Number: +917699817202

🤖 AI CHAT  
→ ChatGPT • Gemini • Blackbox  

🛡️ GROUP ADMIN  
→ Kick • Promote • Demote • Warn • Tag All  

🎬 DOWNLOADERS  
→ TikTok • YouTube • Spotify • Instagram • Facebook  

🎮 FUN & GAMES  
→ TicTacToe • Truth or Dare • Ship • Dare • Arena  

🚫 ANTI SYSTEM  
→ AntiLink • AntiSpam • AntiDelete • AntiTag • AntiCall  

⚡ AUTO FEATURES  
→ AutoTyping • AutoRead • AutoReact • AutoViewStatus  

✏️ TEXT MAKER  
→ Neon • Metallic • Thunder • Snow • Purple • Blackpink  

🎌 ANIME & NSFW  
→ Waifu • Neko • Megumin • Konachan • Hentai  

🔧 UTILITIES  
→ Translate • Weather • QR Code • Lyrics • Shazam  

👑 OWNER TOOLS  
→ Settings • Restart • Update • Mode • Broadcast  
`;

      await sock.sendMessage(from, { text: menu });
    }
  });
}

startBot();
