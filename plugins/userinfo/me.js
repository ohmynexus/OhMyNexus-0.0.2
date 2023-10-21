neoxr.create(async (m, {
   client,
   users,
   env,
   blockList,
   Func
}) => {
   try {
      var pic = await Func.fetchBuffer('./media/image/default.jpg')
      let _own = [...new Set([env.owner, ...global.db.setting.owners])]
      try {
         var pic = await Func.fetchBuffer(await client.profilePictureUrl(m.sender, 'image'))
      } catch {} finally {
         let blocked = blockList.includes(m.sender) ? true : false
         let now = new Date() * 1
         let lastseen = (users.lastseen == 0) ? 'Never' : Func.toDate(now - users.lastseen)
         let usebot = (users.usebot == 0) ? 'Never' : Func.toDate(now - users.usebot)
         let caption = `乂  *U S E R - P R O F I L E*\n\n`
         caption += `	◦ *Name* : ${m.pushName}\n`
         caption += `	◦ *Point* : ${Func.formatNumber(users.point)}\n`
         caption += `	◦ *Guard* : ${Func.formatNumber(users.guard)}\n`
         caption += `	◦ *Limit* : ${Func.formatNumber(users.limit)}\n`
         caption += `	◦ *Game Limit* : ${Func.formatNumber(users.limitGame)}\n`
         caption += `	◦ *Level* : ${Func.level(users.point, global.multiplier)[0]} (${Func.role(Func.level(users.point, global.multiplier)[0])})\n`
         caption += `	◦ *Hitstat* : ${Func.formatNumber(users.hit)}\n`
         caption += `	◦ *Warning* : ${((m.isGroup) ? (typeof global.db.groups.find(v => v.jid == m.chat).member[m.sender] != 'undefined' ? global.db.groups.find(v => v.jid == m.chat).member[m.sender].warning : 0) + ' / 5' : users.warning + ' / 5')}\n\n`
         caption += `乂  *U S E R - S T A T U S*\n\n`
         caption += `	◦ *Blocked* : ${(blocked ? '√' : '×')}\n`
         caption += `	◦ *Banned* : ${(new Date - users.banTemp < global.timer) ? Func.toTime(new Date(users.banTemp + global.timer) - new Date()) + ' (' + ((global.timer / 1000) / 60) + ' min)' : users.banned ? '√' : '×'}\n`
         caption += `	◦ *Use In Private* : ${(global.db.chats.map(v => v.jid).includes(m.sender) ? '√' : '×')}\n`
         caption += `	◦ *Verified* : ${(users.verified ? '√' : '×')}\n`
         caption += `	◦ *Premium* : ${(users.premium ? '√' : '×')}\n`
         caption += `	◦ *Expired* : ${users.expired == 0 ? '-' : Func.timeReverse(users.expired - new Date() * 1)}\n\n`
         caption += global.footer
         client.sendMessageModify(m.chat, caption, m, {
            largeThumb: true,
            thumbnail: pic
         })
      }
   } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['me'],
   category: 'user info'
}, __filename)