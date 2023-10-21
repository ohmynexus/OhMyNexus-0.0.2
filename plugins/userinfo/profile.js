neoxr.create(async (m, {
   client,
   text,
   env,
   blockList,
   Func
}) => {
   try {
      let input = text ? text : m.quoted ? m.quoted.sender : m.mentionedJid.length > 0 ? m.mentioneJid[0] : false
      if (!input) return client.reply(m.chat, Func.texted('bold', `🚩 Mention or reply chat target.`), m)
      let p = await client.onWhatsApp(input.trim())
      if (p.length == 0) return client.reply(m.chat, Func.texted('bold', `🚩 Invalid number.`), m)
      let jid = client.decodeJid(p[0].jid)
      let number = jid.replace(/@.+/, '')
      let _own = [...new Set([env.owner, ...global.db.setting.owners])]
      try {
         var pic = await Func.fetchBuffer(await client.profilePictureUrl(jid, 'image'))
      } catch {
         var pic = await Func.fetchBuffer('./media/image/default.jpg')
      }
      let target = global.db.users.find(v => v.jid == jid)
      let blocked = blockList.includes(jid) ? true : false
      let now = new Date() * 1
      let lastseen = (target.lastseen == 0) ? 'Never' : Func.toDate(now - target.lastseen)
      let usebot = (target.usebot == 0) ? 'Never' : Func.toDate(now - target.usebot)
      let caption = `乂  *U S E R - P R O F I L E*\n\n`
      caption += `	◦ *Name* : ${target.name || '-'}\n`
      caption += `	◦ *Point* : ${Func.formatNumber(target.point)}\n`
      caption += `	◦ *Guard* : ${Func.formatNumber(target.guard)}\n`
      caption += `	◦ *Limit* : ${Func.formatNumber(target.limit)}\n`
      caption += `	◦ *Game Limit* : ${Func.formatNumber(target.limitGame)}\n`
      caption += `	◦ *Level* : ${Func.level(target.point, global.multiplier)[0]} (${Func.role(Func.level(target.point, global.multiplier)[0])})\n`
      caption += `	◦ *Hitstat* : ${Func.formatNumber(target.hit)}\n`
      caption += `	◦ *Warning* : ${((m.isGroup) ? (typeof global.db.groups.find(v => v.jid == m.chat).member[jid] != 'undefined' ? global.db.groups.find(v => v.jid == m.chat).member[jid].warning : 0) + ' / 5' : target.warning + ' / 5')}\n\n`
      caption += `乂  *U S E R - S T A T U S*\n\n`
      caption += `	◦ *Blocked* : ${(blocked ? '√' : '×')}\n`
      caption += `	◦ *Banned* : ${(new Date - target.banTemp < global.timer) ? Func.toTime(new Date(target.banTemp + global.timer) - new Date()) + ' (' + ((global.timer / 1000) / 60) + ' min)' : target.banned ? '√' : '×'}\n`
      caption += `	◦ *Use In Private* : ${(global.db.chats.map(v => v.jid).includes(jid) ? '√' : '×')}\n`
      caption += `	◦ *Whitelist* : ${(target.whitelist ? '√' : '×')}\n`
      caption += `	◦ *Verified* : ${(target.verified ? '√' : '×')}\n`
      caption += `	◦ *Premium* : ${(target.premium ? '√' : '×')}\n`
      caption += `	◦ *Expired* : ${target.expired == 0 ? '-' : Func.timeReverse(target.expired - new Date() * 1)}\n\n`
      caption += global.footer
      client.sendMessageModify(m.chat, caption, m, {
         largeThumb: true,
         thumbnail: pic
      })
   } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['profile'],
   category: 'user info'
}, __filename)