const { Configuration, OpenAIApi } = require('openai')
neoxr.create(async (m, {
   client,
   text,
   prefix,
   command,
   Func
}) => {
   try {
      if (command == 'ai' || command == 'brainly') {
         if (!m.quoted && !text) return client.reply(m.chat, Func.example(prefix, command, 'how to create an api'), m)
         if (m.quoted && !/conversation|extend/.test(m.quoted.mtype)) return m.reply(Func.texted('bold', `🚩 Text not found!`))
         client.sendReact(m.chat, '🕒', m.key)
         const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY
         })
         const openai = new OpenAIApi(configuration)
         const json = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: m.quoted ? m.quoted.text : text,
            temperature: 0.7,
            max_tokens: 3500,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
         })
         if (json.statusText != 'OK' || json.data.choices.length == 0) return client.reply(m.chat, global.status.fail, m)
         client.reply(m.chat, json.data.choices[0].text.trim(), m)
      } else if (command == 'ai-img') {
         if (!m.quoted && !text) return client.reply(m.chat, Func.example(prefix, command, 'snow fox'), m)
         if (m.quoted && !/conversation|extend/.test(m.quoted.mtype)) return m.reply(Func.texted('bold', `🚩 Text not found!`))
         client.sendReact(m.chat, '🕒', m.key)
         const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY
         })
         const openai = new OpenAIApi(configuration)
         const json = await openai.createImage({
            prompt: m.quoted ? m.quoted.text : text,
            n: 1,
            size: '512x512'
         })
         if (json.statusText != 'OK' || json.data.data.length == 0) return client.reply(m.chat, global.status.fail, m)
         client.sendFile(m.chat, json.data.data[0].url, '', '', m)
      }
   } catch (e) {
      console.log(e)
      client.reply(m.chat, global.status.fail, m)
   }
}, {
   usage: ['ai', 'brainly', 'ai-img'],
   use: 'query',
   category: 'features',
   limit: 2,
}, __filename)