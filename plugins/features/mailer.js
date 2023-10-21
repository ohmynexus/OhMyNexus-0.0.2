const nodemailer = require('nodemailer')
const fs = require('fs')
neoxr.create(async (m, {
   client,
   text,
   prefix,
   command,
   Func
}) => {
   try {
      if (!text) return client.reply(m.chat, Func.example(prefix, command, 'no | subject | message'), m)
      let q = m.quoted ? m.quoted : m
      let mime = (q.msg || q).mimetype || ''
      client.sendReact(m.chat, '🕒', m.key)
      let [no, subject, msg] = text.split`|`
      if (!no || !subject || !msg) return client.reply(m.chat, Func.example(prefix, command, 'no | subject | message'), m)
      let p = await client.onWhatsApp(no.trim())
      if (p.length == 0) return client.reply(m.chat, Func.texted('bold', `🚩 Invalid number.`), m)
      let jid = client.decodeJid(p[0].jid)
      const users = global.db.users.find(v => v.jid == jid)
      if (!users) return client.reply(m.chat, Func.texted('bold', `🚩 User not found.`), m)
      if (!users.verified || !users.email) return client.reply(m.chat, Func.texted('bold', `🚩 This user has not verified.`), m)
      const transport = nodemailer.createTransport({
         service: 'gmail',
         auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_APP_PASSWORD
         }
      })
      var template = `<div style="padding:20px;border:1px dashed #222;font-size:15px"><tt>Hi <b>${users.name} 😘</b><br><br>${msg.trim()}<br><br><hr style="border:0px; border-top:1px dashed #222"><br>Regards, <b>Wildan Izzudin</b></tt></div>`
      if (!mime) {
         const mailOptions = {
            from: {
               name: 'Wildan Izzudin',
               address: process.env.USER_EMAIL
            },
            to: users.email,
            subject: subject.trim(),
            html: template
         }
         transport.sendMail(mailOptions, function(err, data) {
            if (err) return m.reply(Func.jsonFormat(err))
            client.reply(m.chat, `✅ Successfully sent email to ${users.email}`, m)
         })
      } else {
         let json = await Func.getFile(await q.download())
         const mailOptions = {
            from: {
               name: process.env.USER_NAME,
               address: process.env.USER_EMAIL
            },
            to: users.email,
            subject: subject.trim(),
            html: template,
            attachments: [{
               filename: json.filename,
               content: fs.createReadStream(json.file)
            }]
         }
         transport.sendMail(mailOptions, function(err, data) {
            if (err) return m.reply(Func.jsonFormat(err))
            client.reply(m.chat, `✅ Successfully sent email to ${users.email}`, m)
         })
      }
   } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['mail'],
   use: 'no | subject | message',
   category: 'owner',
   owner: true
}, __filename)