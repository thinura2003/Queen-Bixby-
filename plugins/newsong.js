const Bixby  = require('../events');

const {MessageType,Mimetype} = require('@adiwajshing/baileys');

const translatte = require('translatte');

const config = require('../config');

const LanguageDetect = require('languagedetect');

const lngDetector = new LanguageDetect();

const Heroku = require('heroku-client');

const heroku = new Heroku({

    token: config.HEROKU.API_KEY

});

let baseURI = '/apps/' + config.HEROKU.APP_NAME;

//============================== LYRICS =============================================

const axios = require('axios');

const { requestLyricsFor, requestAuthorFor, requestTitleFor, requestIconFor } = require("solenolyrics");

const solenolyrics= require("solenolyrics"); 

//============================== CURRENCY =============================================

const { exchangeRates } = require('exchange-rates-api');

const ExchangeRatesError = require('exchange-rates-api/src/exchange-rates-error.js')

//============================== TTS ==================================================

const fs = require('fs');

const https = require('https');

const googleTTS = require('google-translate-tts');

//=====================================================================================

//============================== YOUTUBE ==============================================

const ytdl = require('ytdl-core');

const ffmpeg = require('fluent-ffmpeg');

const yts = require( 'yt-search' )

const got = require("got");

const ID3Writer = require('browser-id3-writer');

const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({

    clientId: 'acc6302297e040aeb6e4ac1fbdfd62c3',

    clientSecret: '0e8439a1280a43aba9a5bc0a16f3f009'

});

//=====================================================================================

const Language = require('../language');

const Lang = Language.getString('scrapers');

const Glang = Language.getString('github');

const Slang = Language.getString('lyrics');

const Clang = Language.getString('amazone');

const wiki = require('wikijs').default;

var gis = require('g-i-s');

var dlang_dsc = ''

var closer_res = ''

var dlang_lang = ''

var dlang_similarity = ''

var dlang_other = ''

var dlang_input = ''

if (config.LANG == 'TR') {

    dlang_dsc = 'Yan??tlanan mesaj??n dilini tahmin eder.'

    closer_res = 'En Yak??n Sonu??:'

    dlang_lang = 'Dil:'

    dlang_similarity = 'Benzerlik:'

    dlang_other = 'Di??er Diller'

    dlang_input = '????lenen Metin:'

}

if (config.LANG == 'EN') {

    dlang_dsc = 'Guess the language of the replied message.'

    closer_res = 'Closest Result:'

    dlang_lang = 'Language:'

    dlang_similarity = 'Similarity:'

    dlang_other = 'Other Languages'

    dlang_input = 'Processed Text:'

}

if (config.LANG == 'AZ') {

    dlang_dsc = 'Cavablanan mesaj??n dilini t??xmin edin.'

    closer_res = '??n yax??n n??tic??:'

    dlang_lang = 'Dil:'

    dlang_similarity = 'B??nz??rlik:'

    dlang_other = 'Ba??qa Dill??r'

    dlang_input = '????l??nmi?? M??tn:'

}

if (config.LANG == 'ML') {

    dlang_dsc = '?????????????????? ??????????????? ?????????????????????????????????????????? ????????? ess ?????????????????????.'

    closer_res = '????????????????????? ?????????????????? ?????????:'

    dlang_lang = '????????????:'

    dlang_similarity = '???????????????:'

    dlang_other = '??????????????? ???????????????'

    dlang_input = '??????????????????????????? ??????????????? ???????????????:'

}

if (config.LANG == 'HI') {

    dlang_dsc = '??????????????? ????????? ?????? ??????????????? ?????? ???????????? ?????? ?????????????????? ???????????????'

    closer_res = '?????????????????? ??????????????????:'

    dlang_lang = '???????????????:'

    dlang_similarity = '??????????????????:'

    dlang_other = '???????????? ??????????????????'

    dlang_input = '????????????????????? ?????????:'

}

if (config.LANG == 'ES') {

    dlang_dsc = 'Adivina el idioma del mensaje respondido.'

    closer_res = 'Resultado m??s cercano:'

    dlang_lang = 'Lengua:'

    dlang_similarity = 'Semejanza:'

    dlang_other = 'Otros idiomas:'

    dlang_input = 'Texto procesado:'

}

if (config.LANG == 'PT') {

    dlang_dsc = 'Adivinhe o idioma da mensagem respondida.'

    closer_res = 'Resultado mais pr??ximo:'

    dlang_lang = 'L??ngua:'

    dlang_similarity = 'Similaridade:'

    dlang_other = 'Outras l??nguas'

    dlang_input = 'Texto Processado:'

}

if (config.LANG == 'ID') {

    dlang_dsc = 'Tebak bahasa pesan yang dibalas.'

    closer_res = 'Hasil Terdekat:'

    dlang_lang = 'Lidah:'

    dlang_similarity = 'Kesamaan:'

    dlang_other = 'Bahasa Lainnya'

    dlang_input = 'Teks yang Diproses:'

}

if (config.LANG == 'RU') {

    dlang_dsc = '???????????? ???????? ?????????????????? ??????????????????.'

    closer_res = '?????????????????? ??????????????????:'

    dlang_lang = '????????:'

    dlang_similarity = '??????????????o:'

    dlang_other = '???????????? ??????????'

    dlang_input = '???????????????????????? ??????????:'

}

if (config.WORKTYPE == 'public') {

Bixby.addCommand({pattern: 'fsong ?(.*)', fromMe: false, desc: 'Downlad song'}, (async (message, match) => { 

        if (match[1] === '') return await message.client.sendMessage(message.jid,Lang.NEED_TEXT_SONG,MessageType.text);    

        let arama = await yts(match[1]);

        arama = arama.all;

        if(arama.length < 1) return await message.client.sendMessage(message.jid,Lang.NO_RESULT,MessageType.text);

        var reply = await message.client.sendMessage(message.jid,Lang.DOWNLOADING_SONG,MessageType.text, {quoted: message.data});

        let title = arama[0].title.replace(' ', '+');

        let stream = ytdl(arama[0].videoId, {

            quality: 'highestaudio',

        });

    

        got.stream(arama[0].image).pipe(fs.createWriteStream(title + '.jpg'));

        ffmpeg(stream)

            .audioBitrate(320)

            .save('./' + title + '.mp3')

            .on('end', async () => {

                const writer = new ID3Writer(fs.readFileSync('./' + title + '.mp3'));

                writer.setFrame('TIT2', arama[0].title)

                    .setFrame('TPE1', [arama[0].author.name])

                    .setFrame('APIC', {

                        type: 3,

                        data: fs.readFileSync(title + '.jpg'),

                        description: arama[0].description

                    });

                writer.addTag();

                reply = await message.client.sendMessage(message.jid,Lang.UPLOADING_SONG,MessageType.text, {quoted: message.data});

                await message.client.sendMessage(message.jid,Buffer.from(writer.arrayBuffer), MessageType.document, {filename: title + '.mp3', mimetype: 'audio/mpeg', quoted: message.data});

            });

    }));

}

if (config.WORKTYPE == 'private') {

Bixby.addCommand({pattern: 'fsong ?(.*)', fromMe: true, desc: 'Downlad songs'}, (async (message, match) => { 

        if (match[1] === '') return await message.client.sendMessage(message.jid,Lang.NEED_TEXT_SONG,MessageType.text);    

        let arama = await yts(match[1]);

        arama = arama.all;

        if(arama.length < 1) return await message.client.sendMessage(message.jid,Lang.NO_RESULT,MessageType.text);

        var reply = await message.client.sendMessage(message.jid,Lang.DOWNLOADING_SONG,MessageType.text, {quoted: message.data});

        let title = arama[0].title.replace(' ', '+');

        let stream = ytdl(arama[0].videoId, {

            quality: 'highestaudio',

        });

    

        got.stream(arama[0].image).pipe(fs.createWriteStream(title + '.jpg'));

        ffmpeg(stream)

            .audioBitrate(320)

            .save('./' + title + '.mp3')

            .on('end', async () => {

                const writer = new ID3Writer(fs.readFileSync('./' + title + '.mp3'));

                writer.setFrame('TIT2', arama[0].title)

                    .setFrame('TPE1', [arama[0].author.name])

                    .setFrame('APIC', {

                        type: 3,

                        data: fs.readFileSync(title + '.jpg'),

                        description: arama[0].description

                    });

                writer.addTag();

                reply = await message.client.sendMessage(message.jid,Lang.UPLOADING_SONG,MessageType.text, {quoted: message.data});

                await message.client.sendMessage(message.jid,Buffer.from(writer.arrayBuffer), MessageType.document, {filename: title + '.mp3', mimetype: 'audio/mpeg', quoted: message.data});

            });

    }));

}
