neoxr.create(async (m, {
   client,
   args,
   prefix,
   command,
   Func
}) => {
   try {
      client.sendReact(m.chat, '🕒', m.key)
      let old = new Date()
      const json = await Api.neoxr('/asupan', {
         username: args[0] || Func.random([
            'itsbellefirst',
            'aletaanovianda',
            'faisafch',
            '0rbby',
            'cindyanastt',
            'awaa.an'
         ])
      })
      if (!json.status) return client.reply(m.chat, Func.texted('bold', `🚩 Account not found, enter username tiktok correctly and make sure the account is not private.`), m)
      let caption = `乂  *A S U P A N*\n\n`
      caption += `	◦  *Author* : ${json.data.author.nickname} (@${json.data.author.username})\n`
      caption += `	◦  *Views* : ${Func.formatter(json.data.stats.play_count)}\n`
      caption += `	◦  *Likes* : ${Func.formatter(json.data.stats.digg_count)}\n`
      caption += `	◦  *Shares* : ${Func.formatter(json.data.stats.share_count)}\n`
      caption += `	◦  *Comments* : ${Func.formatter(json.data.stats.comment_count)}\n`
      caption += `	◦  *Duration* : ${Func.toTime(json.data.duration)}\n`
      caption += `	◦  *Sound* : ${json.data.music.title} - ${json.data.music.author}\n`
      caption += `	◦  *Caption* : ${json.data.caption || '-'}\n`
      caption += `	◦  *Fetching* : ${((new Date - old) * 1)} ms\n\n`
      caption += global.footer
      client.sendFile(m.chat, json.data.video, 'video.mp4', caption, m)
   } catch (e) {
      return client.reply(m.chat, e.message.toString(), m)
   }
}, {
   usage: ['asupan'],
   use: 'username (optional)',
   category: 'features',
   limit: true
}, __filename)