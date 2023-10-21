const axios = require('axios')

module.exports = async (text, voice = 'Joey') => {
   return new Promise(async resolve => {
      try {
         let form = new URLSearchParams
         form.append('msg', text)
         form.append('lang', voice)
         form.append('source', 'ttsmp3')
         const json = await (await axios.post('https://ttsmp3.com/makemp3_new.php', form, {
            headers: {
               "Accept": "*/*",
               "User-Agent": "Mozilla/5.0 (Linux; Android 6.0.1; SM-J500G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36",
               "Origin": "https://ttsmp3.com/",
               "Referer": "https://ttsmp3.com/",
               "Referrer-Policy": "strict-origin-when-cross-origin"
            }
         })).data
         resolve({
            status: true,
            data: json
         })
      } catch (e) {
         console.log(e)
         resolve({
            status: false,
            msg: e.message
         })
      }
   })
}