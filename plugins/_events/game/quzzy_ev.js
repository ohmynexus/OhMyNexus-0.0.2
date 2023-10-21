const moment = require('moment-timezone')
moment.tz.setDefault('Asia/Jakarta').locale('id')
neoxr.create(async (m, {
   client,
   body,
   users,
   prefixes,
   env,
   Scraper,
   Func
}) => {
   try {
      if (body && m.quoted && /[#]ID/.test(m.quoted.text)) {
         const _id = (m.quoted.text.split('#ID-')[1]).trim()
         let quizset = global.db.setting.quizset.find(v => v._id == _id)
         if (!quizset.status || (new Date() - quizset.created_at > env.timer)) return m.reply(`${Func.texted('italic', `❌ Quiz telah selesai silahkan tunggu edisi *Quizzy Broadcast* di lain kesempatan.`)}\n\n${quizset.correct.map(v => `- @${v.split('@')[0]}`).join('\n')}\n\n^ Ke-${quizset.correct.length} orang diatas adalah mereka yang menjawab dengan tepat.`).then(() => quizset.status = false)
         if (body.toLowerCase() == 'qzclue' || body.toLowerCase() == prefixes[0] + 'qzclue') return client.reply(m.chat, '🚩 Clue : ' + quizset.answer.replace(/[bcdfghjklmnpqrstvwxyz]/g, '_'), m)
         if (quizset.respondents.includes(m.sender)) return m.reply(Func.texted('italic', `🚩 Maaf, kamu hanya bisa menjawab 1 kali saja.`))
         quizset.respondents.push(m.sender)
         if (quizset.answer != body.toLowerCase()) return client.sendSticker(m.chat, await Func.fetchBuffer('./media/sticker/false.webp'), m, {
            packname: global.db.setting.sk_pack,
            author: global.db.setting.sk_author
         })
         if (quizset.correct.length >= quizset.slot) quizset.status = false
         quizset.correct.push(m.sender)
         if (quizset.reward_key == 1) {
            const value = quizset.reward_value || 7
            users.limit += 1000
            users.expired += users.premium ? (86400000 * parseInt(value)) : (new Date() * 1) + (86400000 * parseInt(value))
            client.reply(m.chat, Func.texted('bold', `✅ Benar!, selamat kamu mendapatkan reward akses premium untuk ${value} hari.`), m).then(() => {
               users.premium = true
               let caption = `乂  *Q U I Z Z Y*\n\n`
               caption += `“Quizzy Broadcast edisi ${moment(quizset.timeout).format('DD/MM/YYYY (HH:mm)')} WIB, silahkan jawab pertanyaan berikut dengan benar untuk mendapatkan reward.”\n\n`
               caption += `➠ ${quizset.question.trim()}\n\n`
               caption += `Slot : [ ${quizset.slot - quizset.correct.length} ]\n`
               caption += `Timeout : [ *${((env.timer / 1000) / 60)} menit* ]\n`
               caption += `Balas pesan broadcast ini untuk menjawab dan kirim *${prefixes[0]}qzclue* untuk mendapatkan clue.\n\n`
               caption += `#ID-${quizset._id}`
               client.sendFile(m.chat, quizset.url, '', caption)
            })
         } else if (quizset.reward_key == 2) {
        	const value = quizset.reward_value || 500000
            users.point += value
            client.reply(m.chat, Func.texted('bold', `✅ Benar!, selamat kamu mendapatkan reward point sebanyak ${Func.formatter(value)}.`), m).then(() => {
               let caption = `乂  *Q U I Z Z Y*\n\n`
               caption += `“Quizzy Broadcast edisi ${moment(quizset.timeout).format('DD/MM/YYYY (HH:mm)')} WIB, silahkan jawab pertanyaan berikut dengan benar untuk mendapatkan reward.”\n\n`
               caption += `➠ ${quizset.question.trim()}\n\n`
               caption += `Slot : [ ${quizset.slot - quizset.correct.length} ]\n`
               caption += `Timeout : [ *${((env.timer / 1000) / 60)} menit* ]\n`
               caption += `Balas pesan broadcast ini untuk menjawab dan kirim *${prefixes[0]}qzclue* untuk mendapatkan clue.\n\n`
               caption += `#ID-${quizset._id}`
               client.sendFile(m.chat, quizset.url, '', caption)
            })
         } else if (quizset.reward_key == 3) {
        	const value = quizset.reward_value || 25
            users.limit += value
            client.reply(m.chat, Func.texted('bold', `✅ Benar!, selamat kamu mendapatkan reward limit sebanyak ${Func.formatter(value)}.`), m).then(() => {
               let caption = `乂  *Q U I Z Z Y*\n\n`
               caption += `“Quizzy Broadcast edisi ${moment(quizset.timeout).format('DD/MM/YYYY (HH:mm)')} WIB, silahkan jawab pertanyaan berikut dengan benar untuk mendapatkan reward.”\n\n`
               caption += `➠ ${quizset.question.trim()}\n\n`
               caption += `Slot : [ ${quizset.slot - quizset.correct.length} ]\n`
               caption += `Timeout : [ *${((env.timer / 1000) / 60)} menit* ]\n`
               caption += `Balas pesan broadcast ini untuk menjawab dan kirim *${prefixes[0]}qzclue* untuk mendapatkan clue.\n\n`
               caption += `#ID-${quizset._id}`
               client.sendFile(m.chat, quizset.url, '', caption)
            })
         } else if (quizset.reward_key == 4) {
        	const value = Func.randomInt(1, 500000)
            users.point += value
            client.reply(m.chat, Func.texted('bold', `✅ Benar!, selamat kamu mendapatkan reward point sebanyak ${Func.formatter(value)}.`), m).then(() => {
               let caption = `乂  *Q U I Z Z Y*\n\n`
               caption += `“Quizzy Broadcast edisi ${moment(quizset.timeout).format('DD/MM/YYYY (HH:mm)')} WIB, silahkan jawab pertanyaan berikut dengan benar untuk mendapatkan reward.”\n\n`
               caption += `➠ ${quizset.question.trim()}\n\n`
               caption += `Slot : [ ${quizset.slot - quizset.correct.length} ]\n`
               caption += `Timeout : [ *${((env.timer / 1000) / 60)} menit* ]\n`
               caption += `Balas pesan broadcast ini untuk menjawab dan kirim *${prefixes[0]}qzclue* untuk mendapatkan clue.\n\n`
               caption += `#ID-${quizset._id}`
               client.sendFile(m.chat, quizset.url, '', caption)
            })
         } else if (quizset.reward_key == 5) {
        	const value = Func.randomInt(1, 30)
            users.limit += value
            client.reply(m.chat, Func.texted('bold', `✅ Benar!, selamat kamu mendapatkan reward limit sebanyak ${Func.formatter(value)}.`), m).then(() => {
               let caption = `乂  *Q U I Z Z Y*\n\n`
               caption += `“Quizzy Broadcast edisi ${moment(quizset.timeout).format('DD/MM/YYYY (HH:mm)')} WIB, silahkan jawab pertanyaan berikut dengan benar untuk mendapatkan reward.”\n\n`
               caption += `➠ ${quizset.question.trim()}\n\n`
               caption += `Slot : [ ${quizset.slot - quizset.correct.length} ]\n`
               caption += `Timeout : [ *${((env.timer / 1000) / 60)} menit* ]\n`
               caption += `Balas pesan broadcast ini untuk menjawab dan kirim *${prefixes[0]}qzclue* untuk mendapatkan clue.\n\n`
               caption += `#ID-${quizset._id}`
               client.sendFile(m.chat, quizset.url, '', caption)
            })
         }
      }
   } catch (e) {
      return client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   error: false,
   group: true,
   game: true
}, __filename)