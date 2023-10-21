const axios = require('axios')
const cheerio = require('cheerio')

function ezRotate(target, file, token, type) {
   return new Promise(async (resolve, reject) => {
      try {
         let form = new URLSearchParams()
         form.append('file', file)
         form.append('token', token)
         form.append(type, 'on')
         form.append('free_deg', 45)
         form.append('submit', 'Upload!')
         let html = await (await axios.post(target, form)).data
         let $ = cheerio.load(html)
         resolve($('p.outfile > img').attr('src'))
      } catch (e) {
         console.log(e)
         resolve({
            creator: '@neoxrs – Wildan Izzudin',
            status: false
         })
      }
   })
}

module.exports = (url, type) => {
   return new Promise(async (resolve, reject) => {
      try {
         let form = new URLSearchParams()
         form.append('new-image-url', url)
         form.append('submit', 'Upload!')
         let html = await (await axios.post('https://s6.ezgif.com/rotate', form)).data
         let $ = cheerio.load(html)
         let data = []
         $('img').each((i, e) => {
            let tmp = $(e).attr('src')
            if (tmp.match(/(\/tmp\/)/g)) data.push(tmp)
         })
         if (data.length == 0) return resolve({
            creator: '@neoxrs – Wildan Izzudin',
            status: false
         })
         let input = {
            target: $('form[class="form ajax-form"]').attr('action'),
            filename: data[0].split`/` [4],
            token: $('input[name="token"]').attr('value')
         }
         let output = await ezRotate(input.target, input.filename, input.token, type)
         resolve({
            creator: '@neoxrs – Wildan Izzudin',
            status: true,
            data: {
               url: 'https:' + output
            }
         })
      } catch (e) {
         console.log(e)
         resolve({
            creator: '@neoxrs – Wildan Izzudin',
            status: false
         })
      }
   })
}