neoxr.create(async (m, {
   client,
   prefix,
   Func
}) => {
   try {
      client.reply(m.chat, `🏷️ Upgrade ke premium plan hanya Rp 19.999,- untuk mendapatkan limit 1K selama 1 bulan.\n\nJika ingin membeli hubungi *${prefix}owner*`, m)
   } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['premium'],
   category: 'miscs'
}, __filename)