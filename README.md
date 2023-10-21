## NEOXR-BOT V3.0.1-OPTIMA

> This script has a lightweight version which provides several important features that are often used, including games.

### Requirements

- [x] NodeJS >= 14
- [x] FFMPEG
- [x] Server vCPU/RAM 1/2GB (Min)

### Configuration

There are 2 configuration files namely ```.env``` and ```config.json```, adjust them before installing.

```Javascript
{
   "owner": "6285887776722",
   "owner_name": "Wildan Izzudin",
   "database": "data",
   "limit": 15,
   "limit_game": 50,
   "multiplier": 7,
   "min_reward": 100000,
   "max_reward": 500000,
   "ram_limit": "900mb",
   "max_upload": 50,
   "max_upload_free": 10,
   "cooldown": 3,
   "timer": 180000,
   "timeout": 1800000,
   "blocks": ["994", "91", "92"],
   "evaluate_chars":  ["=>", "~>", "<", ">", "$"]
}
```

```.env
### Email
USER_EMAIL_PROVIDER = 'gmail'
USER_NAME = 'Neoxr Bot (Verification)'
USER_EMAIL = ''
USER_APP_PASSWORD = ''

### Neoxr API : https://api.neoxr.my.id
API_ENDPOINT = 'https://api.neoxr.my.id/api'
API_KEY = ''

### Open AI : https://beta.openai.com/account/api-keys
OPENAI_API_KEY = ''

### Database : https://www.mongodb.com/
DATABASE_URL = ''

### Anti Porn : https://api.sightengine.com
API_USER = ''
API_SECRET = ''

### Timezone (Important)
TZ = 'Asia/Jakarta'
```

**Notes** : 
+ ```ram_limit``` : ram usage limit, for example you have a server with 1gb of ram set before the maximum capacity is 900mb.

+ ```USER_APP_PASSWORD``` : to fill this variable watch this [video](https://drive.google.com/file/d/1Kembes2uM5M-9o1fzfbGzENaVutMT1O6/view?usp=drivesdk).

+ ```API_KEY``` : some of the features in this script use apikey, especially the downloader feature, to get an apiKey you can get it on the [Neoxr Api's](https://api.neoxr.my.id) with prices that vary according to your needs.

+ ```DATABASE_URL``` : can be filled with mongo and postgresql URLs to use localdb just leave it blank and the data will be saved to the .json file.

### Pairing Code

Connecting whatsapp without qr scan but using pairing code.

<p align="center"><img align="center" width="100%" src="https://telegra.ph/file/290abc12a3aefe23bc71b.jpg" /></p>

```Javascript
{
   "pairing": {
      "state": true, // "true" if you want to use the pairing code
      "number": 62xxxx // start number with country code
   }
}
```

### Installation & Run

Make sure the configuration and server meet the requirements so that there are no problems during installation or when this bot is running, type this on your console :

```
$ yarn
$ node .
```

or want to use pm2

```
$ yarn
$ npm i -g pm2
$ pm2 start index.js && pm2 save && pm2 logs
```

> Very important installing module using yarn

### Disclaimer

if you sell this script again **free update will be removed** and **apikey will be suspended** without refund.

If there is an error, please make an issue, Thanks.