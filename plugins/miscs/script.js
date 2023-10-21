neoxr.create(async (m, {
   client,
   prefix,
   setting,
   Func
}) => {
   try {
      client.sendMessageModify(m.chat, sell(prefix), m, {
         ads: false,
         largeThumb: true,
         thumbnail: setting.cover,
         url: setting.link
      })
   } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['script'],
   hidden: ['sc'],
   category: 'miscs'
}, __filename)

const sell = (prefix) => {
   return `*SELL SCRIPT NEOXR-BOT V3.0.1-OPTIMA*
🏷️ Price : *Rp. 150.000 / $20.80*

*Special Features & Benefit :*
- AI & AI Image
- Anti Bot
- Auto Download
- Porn Detector (Only Image)
- 9 Mini Games
- Leveling & Roles
- Email Verification
- Captcha Verification
- Send Email
- High Optimation
- Free Updates
- Bonus ApiKey 5K Request (for 2 month)

*Additional Features :*
🏷️ Price : *+Rp. 50.000 / +$6.80*
- Temporary Bot Features (Jadibot)
🏷️ Price : *+Rp. 30.000 / +$4.80*
- Chatroom (Conversation \w Bot)
🏷️ Price : *+Rp. 15.000 / +$3.80*
- Menfess (Confess)

*Requirement :*
- NodeJS v14
- FFMPEG
- Ram Min. 1GB

Minat ? chat https://wa.me/6282177779477`
}
