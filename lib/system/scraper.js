const { Scraper } = new(require('@neoxr/wb'))
const fs = require('fs'),
   FormData = require('form-data'),
   axios = require('axios'),
   cheerio = require('cheerio')
   
Scraper.pornDetector = buffer => {
   return new Promise(async resolve => {
      try {
         let form = new FormData()
         form.append('media', buffer)
         form.append('models', 'nudity-2.0,wad,gore')
         form.append('api_user', process.env.API_USER)
         form.append('api_secret', process.env.API_SECRET)
         let result = await axios.post('https://api.sightengine.com/1.0/check.json', form, {
            headers: form.getHeaders()
         })
         if (result.status == 200) {
            if (result.data.status == 'success') {
               if (result.data.nudity.sexual_activity >= 0.50 || result.data.nudity.suggestive >= 0.50 || result.data.nudity.erotica >= 0.50) return resolve({
                  creator: global.creator,
                  status: true,
                  msg: `Nudity Content : ${(result.data.nudity.sexual_activity >= 0.50 ? result.data.nudity.sexual_activity * 100 : result.data.nudity.suggestive >= 0.50 ? result.data.nudity.suggestive * 100 :  result.data.nudity.erotica >= 0.50 ? result.data.nudity.erotica * 100 : 0)}%`
               })
               if (result.data.weapon > 0.50) return resolve({
                  creator: global.creator,
                  status: true,
                  msg: `Provocative Content : ${result.data.weapon * 100}%`
               })
            } else return resolve({
               creator: global.creator,
               status: false
            })
         } else return resolve({
            creator: global.creator,
            status: false
         })
      } catch (e) {
         return resolve({
            creator: global.creator,
            status: false,
            msg: e.message
         })
      }
   })
}

Scraper.rotate = async (url, type) => {
    const json = await require('../rotate')(url, type)
    return json
}

Scraper.grammar = async (text, lang = 'en-US') => {
   return new Promise(async resolve => {
      try {
         let form = new URLSearchParams
         form.append('disabledRules', 'WHITESPACE_RULE')
         form.append('allowincompleteResults', 'true')
         form.append('text', text)
         form.append('language', lang)
         const json = await (await axios.post('https://grammarchecker.io/langtool', form, {
            headers: {
               "Accept": "*/*",
               "User-Agent": "Mozilla/5.0 (Linux; Android 6.0.1; SM-J500G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36",
               "Referer": "https://grammarchecker.io/",
               "Referrer-Policy": "strict-origin-when-cross-origin"
            }
         })).data
         if (json.matches.length >= 1) return resolve({
            creator: global.creator,
            status: false,
            msg: json.matches[0].shortMessage
         })
         resolve({
            creator: global.creator,
            status: true,
            msg: 'Correct spelling'
         })
      } catch (e) {
         console.log(e)
         resolve({
            creator: global.creator,
            status: false,
            msg: e.message
         })
      }
   })
}