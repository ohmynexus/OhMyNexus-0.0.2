const fs = require('fs')
neoxr.create(async (m, {
  client,
  body,
  isOwner,
  isAdmin,
  isBotAdmin,
  participants,
  users,
  groupSet,
  setting,
  env,
  store,
  Func,
  Scraper
}) => {
  try {
    // Clear DB
    setInterval(async () => {
      let day = 86400000 * 14,
        now = new Date() * 1
      global.db.users.filter(v => now - v.lastseen > day && !v.premium && !v.banned && v.point < 1000000).map(v => {
        let user = global.db.users.find(x => x.jid == v.jid)
        if (user) Func.removeItem(global.db.users, user)
      })
      global.db.chats.filter(v => now - v.lastseen > day).map(v => {
        let chat = global.db.chats.find(x => x.jid == v.jid)
        if (chat) Func.removeItem(global.db.chats, chat)
      })
      global.db.groups.filter(v => now - v.activity > day).map(v => {
        let group = global.db.groups.find(x => x.jid == v.jid)
        if (group) Func.removeItem(global.db.groups, group)
      })
      global.db.setting.quizset.filter(v => now - v.created_at > day).map(v => {
        let quizset = global.db.setting.quizset.find(x => x._id == v._id)
        if (quizset) Func.removeItem(global.db.setting.quizset, quizset)
      })
    }, 60_000)

    // Verification Timeout
    setInterval(async () => {
      const expire = global.db.users.filter(v => new Date - v.codeExpire > 180000 && !v.verified)
      if (expire.length < 1) return
      for (let user of expire) {
        user.codeExpire = 0
        user.code = ''
        user.email = ''
        user.attempt = 0
      }
    }, 60_000)

    // Auto Sticker
    if (m.isGroup && groupSet.autosticker && /video|image/.test(m.mtype)) {
      let mime = m.msg.mimetype
      if (/image\/(jpe?g|png)/.test(mime)) {
        let img = await m.download()
        if (!img) return
        Func.hitstat('sticker', m.sender)
        client.sendSticker(m.chat, img, m, {
          packname: setting.sk_pack,
          author: setting.sk_author
        })
      } else if (/video/.test(mime)) {
        if (m.msg.seconds > 10) return
        let img = await m.download()
        if (!img) return
        client.sendSticker(m.chat, img, m, {
          packname: setting.sk_pack,
          author: setting.sk_author
        })
      }
    }

    // Anti Spam
    let unban = new Date(users.banTemp + global.timer)
    if (new Date - users.banTemp > global.timer) {
      if (!users.banned && !m.fromMe) {
        users.spam += 1
        let spam = users.spam
        if (spam >= 2) setTimeout(() => {
          users.spam = 0
        }, global.cooldown * 1000)
        if (users.banTimes >= 3) return client.reply(m.chat, `🚩 You are permanently banned because you have been temporarily banned 3 times.`, m).then(() => {
          users.banned = true
          users.banTemp = 0
          users.banTimes = 0
        })
        if (m.isGroup && spam == 4) return client.reply(m.chat, `🚩 System detects you are spamming, please cooldown for *${global.cooldown} seconds*.`, m)
        if (m.isGroup && spam >= 5) return client.reply(m.chat, `🚩 You were temporarily banned for ${((global.timer / 1000) / 60)} minutes cause you over spam.`, m).then(() => {
          users.banTemp = new Date() * 1
          users.banTimes += 1
          if (!isOwner && chats) {
            if (new Date() * 1 - chats.command > global.cooldown * 1000) {
              chats.command = new Date() * 1
            } else {
              if (!m.fromMe) return
            }
          }
        })
        if (!m.isGroup && spam == 4) return client.reply(m.chat, `🚩 System detects you are spamming, please cooldown for *${global.cooldown} seconds*.`, m)
        if (!m.isGroup && spam >= 5) return client.reply(m.chat, `🚩 You were temporarily banned for ${((global.timer / 1000) / 60)} minutes cause you over spam.`, m).then(() => {
          users.banTemp = new Date() * 1
          users.banTimes += 1
        })
      }
    } else return

    // Auto Level Up
    let levelAwal = Func.level(users.point, env.multiplier)[0]
    if (users && body) users.point += Func.randomInt(1, 100)
    let levelAkhir = Func.level(users.point, env.multiplier)[0]
    if (levelAwal != levelAkhir && setting.levelup) client.reply(m.chat, `乂  *L E V E L - U P*\n\nFrom : [ *${levelAwal}* ] ➠ [ *${levelAkhir}* ]\n*Congratulations!*, you have leveled up 🎉🎉🎉`, m)

    // Show View Once
    if (m.isGroup && groupSet.viewonce && m.msg && m.msg.viewOnce && !isOwner) {
      let media = await client.downloadMediaMessage(m.msg)
      if (/image/.test(m.mtype)) {
        client.sendFile(m.chat, media, Func.filename('jpg'), body ? body : '', m)
      } else if (/video/.test(m.mtype)) {
        client.sendFile(m.chat, media, Func.filename('mp4'), body ? body : '', m)
      }
    }


    // AFK Detector
    let afk = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])]
    for (let jid of afk) {
      let is_user = global.db.users.find(v => v.jid == jid)
      if (!is_user) continue
      let afkTime = is_user.afk
      if (!afkTime || afkTime < 0) continue
      let reason = is_user.afkReason || ''
      if (!m.fromMe) {
        client.reply(m.chat, `*Away From Keyboard* : @${jid.split('@')[0]}\n• *Reason* : ${reason ? reason : '-'}\n• *During* : [ ${Func.toTime(new Date - afkTime)} ]`, m).then(async () => {
          client.reply(jid, `Someone from *${await (await client.groupMetadata(m.chat)).subject}*'s group, tagged or mention you.\n\n• *Sender* : @${m.sender.split('@')[0]}`, m).then(async () => {
            await client.copyNForward(jid, m)
          })
        })
      }
    }

    // Email Verification
    if (!m.isGroup && body && body.length == 6 && /\d{6}/.test(body) && !users.verified) {
      if (users.jid == m.sender && users.code != body.trim()) return client.reply(m.chat, Func.texted('bold', '🚩 Your verification code is wrong.'), m)
      if (new Date - users.codeExpire > 180000) return client.reply(m.chat, Func.texted('bold', '🚩 Your verification code has expired.'), m).then(() => {
        users.codeExpire = 0
        users.code = ''
        users.email = ''
        users.attempt = 0
      })
      return client.reply(m.chat, Func.texted('bold', `✅ Your number has been successfully verified (+50 Limit)`), m).then(() => {
        users.codeExpire = 0
        users.code = ''
        users.attempt = 0
        users.verified = true
        users.limit += 50
      })
    }

    // Image Recognize
    if (!m.fromMe && m.isGroup && groupSet.antiporn && /image/.test(m.mtype) && !isAdmin && isBotAdmin) {
      let sync = await Func.getFile(await m.download())
      const json = await Scraper.pornDetector(fs.createReadStream(sync.file))
      if (json.status) return m.reply(Func.jsonFormat(json)).then(() => client.groupParticipantsUpdate(m.chat, [m.sender], 'remove'))
    } else if (!m.fromMe && !m.isGroup && /image/.test(m.mtype)) {
      let sync = await Func.getFile(await m.download())
      const json = await Scraper.pornDetector(fs.createReadStream(sync.file))
      if (json.status) return m.reply(Func.jsonFormat(json)).then(() => client.updateBlockStatus(m.sender, 'block'))
    }
  } catch (e) {
    console.log(e)
    return client.reply(m.chat, Func.jsonFormat(e), m)
  }
}, {
  error: false
}, __filename)