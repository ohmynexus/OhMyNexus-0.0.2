const Tomp3 = require('lib/ttsmp3')
neoxr.create(async (m, {
   client,
   prefix,
   Func
}) => {
   try {
      client.listening = client.listening ? client.listening : {}
      let id = m.chat,
         timeout = 120000
      if (id in client.listening) return client.reply(m.chat, '*^ this question has not been answered!*', client.listening[id][0])
      let sentence = Func.random([
         "cat",
         "dog",
         "bird",
         "fish",
         "rabbit",
         "snake",
         "wolf",
         "horse",
         "elephant",
         "monkey",
         "frog",
         "lizard",
         "turtle",
         "cow",
         "rhino",
         "fox",
         "gorilla",
         "duck",
         "beaver",
         "kangaroo",
         "antelope",
         "tiger",
         "zebra",
         "cheetah",
         "sheep",
         "bear",
         "panda",
         "mule",
         "deer",
         "camel",
         "moose",
         "polar bear",
         "honey badger",
         "hyena",
         "yak",
         "pigeon",
         "hawk",
         "ostrich",
         "woodpecker",
         "parrot",
         "pelican",
         "swan",
         "octopus",
         "salmon",
         "lobster",
         "crab",
         "shrimp",
         "worm",
         "oyster",
         "starfish",
         "squirrel",
         "eel",
         "wasp",
         "bee",
         "butterfly",
         "beetle",
         "flies",
         "cockroach",
         "moth",
         "grasshopper",
         "spider",
         "ant",
         "snail",
         "clam",
         "jellyfish",
         "seahorse",
         "bat",
         "hedgehog",
         "guinea pig",
         "hamster",
         "mouse",
         "rat",
         "skunk",
         "porcupine",
         "armadillo",
         "beaver",
         "bison",
         "buffalo",
         "coyote",
         "emu",
         "falcon",
         "finch",
         "gila monster",
         "iguana",
         "kookaburra",
         "macaw",
         "ocelot",
         "puma",
         "raccoon",
         "stork",
         "swan",
         "vulture",
         "weasel",
         "wildebeest",
         "wild boar",
         "wolf spider",
         "woodchuck",
         "woodpecker",
         "worm",
         "wren"
      ])
      const json = await Tomp3(sentence)
      if (!json.status) return m.reply(Func.jsonFormat(json))
      let teks = `乂  *L I S T E N I N G*\n\n`
      teks += `Write back what you hear from the following this audio!\n\n`
      teks += `Timeout : [ *${((timeout / 1000) / 60)} minutes* ]\n`
      teks += `Reply to this message to answer, send *${prefix}listenclue* for help and *${prefix}listenskip* to delete the session.`
      client.listening[id] = [
         await client.reply(m.chat, teks, m),
         sentence,
         await client.sendFile(m.chat, json.data['URL'], '', '', m, {
            ptt: false
         }),
         setTimeout(() => {
            if (client.listening[id]) client.reply(m.chat, `Time is up!, The answer is : *${client.listening[id][1]}*`, client.listening[id][0])
            delete client.listening[id]
         }, timeout)
      ]
   } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['listen'],
   category: 'games',
   limit: true,
   group: true,
   game: true
}, __filename)