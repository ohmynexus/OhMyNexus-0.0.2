const fs = require('fs')
neoxr.create(async (m, {
   client,
   text,
   prefix,
   command,
   env,
   setting,
   Func
}) => {
   try {
      const plugins = neoxr.plugins.filter(v => !global.db.setting.pluginDisable.includes(v.pluginName))
      const local_size = fs.existsSync('./' + env.database + '.json') ? Func.formatSize(fs.statSync('./' + env.database + '.json').size) : ''
      const library = JSON.parse(require('fs').readFileSync('./package.json', 'utf-8'))
      const message = global.db.setting.msg.replace('+tag', `@${m.sender.replace(/@.+/g, '')}`).replace('+name', m.pushName).replace('+greeting', Func.greeting()).replace('+db', (/mongo/.test(process.env.DATABASE_URL) ? 'Mongo' : /postgre/.test(process.env.DATABASE_URL) ? 'Postgres' : `Local (${local_size})`)).replace('+version', (library.dependencies.bails ? library.dependencies.bails : library.dependencies['@adiwajshing/baileys'] ? '@adiwajshing/baileys' : library.dependencies.baileys).replace('^', '').replace('~', ''))
      const style = global.db.setting.menuStyle
      if (style === 1) {
         let cmd = plugins.filter(v => v.usage && v.category)
         let category = []
         for (let obj of cmd) {
            if (Object.keys(category).includes(obj.category)) category[obj.category].push(obj)
            else {
               category[obj.category] = []
               category[obj.category].push(obj)
            }
         }
         const keys = Object.keys(category).sort()
         let print = message
         print += '\n' + String.fromCharCode(8206).repeat(4001)
         for (let k of keys) {
            print += '\n\n乂  *' + k.toUpperCase().split('').map(v => v).join(' ') + '*\n\n'
            let cmd = plugins.filter(v => v.usage && v.category == k.toLowerCase())
            if (cmd.length == 0) return
            let commands = []
            cmd.map(v => {
               switch (v.usage.constructor.name) {
                  case 'Array':
                     v.usage.map(x => commands.push({
                        usage: x,
                        use: v.use ? Func.texted('bold', v.use) : ''
                     }))
                     break
                  case 'String':
                     commands.push({
                        usage: v.usage,
                        use: v.use ? Func.texted('bold', v.use) : ''
                     })
               }
            })
            print += commands.sort((a, b) => a.usage.localeCompare(b.usage)).map(v => `	◦  ${prefix + v.usage} ${v.use}`).join('\n')
         }
         client.sendMessageModify(m.chat, print + '\n\n' + global.footer, m, {
            ads: false,
            largeThumb: true,
            thumbnail: global.db.setting.cover,
            url: global.db.setting.link
         })
      } else if (style === 2) {
         let cmd = plugins.filter(v => v.usage && v.category)
         let category = []
         for (let obj of cmd) {
            if (Object.keys(category).includes(obj.category)) category[obj.category].push(obj)
            else {
               category[obj.category] = []
               category[obj.category].push(obj)
            }
         }
         const keys = Object.keys(category).sort()
         let print = message
         print += '\n' + String.fromCharCode(8206).repeat(4001)
         for (let k of keys) {
            print += '\n\n –  *' + k.toUpperCase().split('').map(v => v).join(' ') + '*\n\n'
            let cmd = plugins.filter(v => v.usage && v.category == k.toLowerCase())
            if (cmd.length == 0) return
            let commands = []
            cmd.map(v => {
               switch (v.usage.constructor.name) {
                  case 'Array':
                     v.usage.map(x => commands.push({
                        usage: x,
                        use: v.use ? Func.texted('bold', v.use) : ''
                     }))
                     break
                  case 'String':
                     commands.push({
                        usage: v.usage,
                        use: v.use ? Func.texted('bold', v.use) : ''
                     })
               }
            })
            print += commands.sort((a, b) => a.usage.localeCompare(b.usage)).map((v, i) => {
               if (i == 0) {
                  return `┌  ◦  ${prefix + v.usage} ${v.use}`
               } else if (i == commands.sort((a, b) => a.usage.localeCompare(b.usage)).length - 1) {
                  return `└  ◦  ${prefix + v.usage} ${v.use}`
               } else {
                  return `│  ◦  ${prefix + v.usage} ${v.use}`
               }
            }).join('\n')
         }
         client.sendMessageModify(m.chat, Func.Styles(print, 1) + '\n\n' + global.footer, m, {
            ads: false,
            largeThumb: true,
            thumbnail: global.db.setting.cover,
            url: global.db.setting.link
         })
      } else if (style === 3) {
         if (text) {
            let cmd = plugins.filter(v => v.usage && v.category == text.toLowerCase() && !setting.hidden.includes(v.category.toLowerCase()))
            if (cmd.length == 0) return client.reply(m.chat, Func.texted('bold', `🚩 Category not available.`), m)
            let commands = []
            cmd.map(v => {
               switch (v.usage.constructor.name) {
                  case 'Array':
                     v.usage.map(x => commands.push({
                        usage: x,
                        use: v.use ? Func.texted('bold', v.use) : ''
                     }))
                     break
                  case 'String':
                     commands.push({
                        usage: v.usage,
                        use: v.use ? Func.texted('bold', v.use) : ''
                     })
               }
            })
            const print = commands.sort((a, b) => a.usage.localeCompare(b.usage)).map((v, i) => {
               if (i == 0) {
                  return `┌  ◦  ${prefix + v.usage} ${v.use}`
               } else if (i == commands.sort((a, b) => a.usage.localeCompare(b.usage)).length - 1) {
                  return `└  ◦  ${prefix + v.usage} ${v.use}`
               } else {
                  return `│  ◦  ${prefix + v.usage} ${v.use}`
               }
            }).join('\n')
            m.reply(Func.Styles(print, 1))
         } else {
            let print = message
            print += '\n' + String.fromCharCode(8206).repeat(4001) + '\n'
            let cmd = plugins.filter(v => v.usage && v.category && !setting.hidden.includes(v.category))
            let category = []
            for (let obj of cmd) {
               if (!obj.category) continue
               if (Object.keys(category).includes(obj.category)) category[obj.category].push(obj)
               else {
                  category[obj.category] = []
                  category[obj.category].push(obj)
               }
            }
            let rows = []
            const keys = Object.keys(category).sort()
            print += keys.sort((a, b) => a.localeCompare(b)).map((v, i) => {
               if (i == 0) {
                  return `┌  ◦  ${prefix + command} ${v}`
               } else if (i == keys.sort((a, b) => a.localeCompare(b)).length - 1) {
                  return `└  ◦  ${prefix + command} ${v}`
               } else {
                  return `│  ◦  ${prefix + command} ${v}`
               }
            }).join('\n')
            m.reply(Func.Styles(print, 1))
         }
      } else if (style === 4) {
         if (text) {
            let cmd = plugins.filter(v => v.usage && v.category == text.toLowerCase() && !setting.hidden.includes(v.category.toLowerCase()))
            if (cmd.length == 0) return client.reply(m.chat, Func.texted('bold', `🚩 Category not available.`), m)
            let commands = []
            cmd.map(v => {
               switch (v.usage.constructor.name) {
                  case 'Array':
                     v.usage.map(x => commands.push({
                        usage: x,
                        use: v.use ? Func.texted('bold', v.use) : ''
                     }))
                     break
                  case 'String':
                     commands.push({
                        usage: v.usage,
                        use: v.use ? Func.texted('bold', v.use) : ''
                     })
               }
            })
            const print = commands.sort((a, b) => a.usage.localeCompare(b.usage)).map((v, i) => {
               if (i == 0) {
                  return `┌  ◦  ${prefix + v.usage} ${v.use}`
               } else if (i == commands.sort((a, b) => a.usage.localeCompare(b.usage)).length - 1) {
                  return `└  ◦  ${prefix + v.usage} ${v.use}`
               } else {
                  return `│  ◦  ${prefix + v.usage} ${v.use}`
               }
            }).join('\n')
            m.reply(Func.Styles(print, 1))
         } else {
            let print = message
            print += '\n' + String.fromCharCode(8206).repeat(4001) + '\n'
            let cmd = plugins.filter(v => v.usage && v.category && !setting.hidden.includes(v.category))
            let category = []
            for (let obj of cmd) {
               if (!obj.category) continue
               if (Object.keys(category).includes(obj.category)) category[obj.category].push(obj)
               else {
                  category[obj.category] = []
                  category[obj.category].push(obj)
               }
            }
            let rows = []
            const keys = Object.keys(category).sort()
            print += keys.sort((a, b) => a.localeCompare(b)).map((v, i) => {
               if (i == 0) {
                  return `┌  ◦  ${prefix + command} ${v}`
               } else if (i == keys.sort((a, b) => a.localeCompare(b)).length - 1) {
                  return `└  ◦  ${prefix + command} ${v}`
               } else {
                  return `│  ◦  ${prefix + command} ${v}`
               }
            }).join('\n')
            client.sendMessageModify(m.chat, Func.Styles(print, 1) + '\n\n' + global.footer, m, {
               ads: false,
               largeThumb: true,
               thumbnail: global.db.setting.cover,
               url: global.db.setting.link
            })
         }
      }
   } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['menu'],
   hidden: ['command', 'h', 'help']
}, __filename)