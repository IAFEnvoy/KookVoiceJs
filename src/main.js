const fs = require('fs');
const KBotify = require('kbotify').KBotify;
const { getSearchResult, neteaseSongData, setCookie } = require("./parse/netease");
const { danger, searchResult, info, list, operation } = require('./card');
const { Voice } = require("./voice");

const config = JSON.parse(fs.readFileSync('./main.json'))
const token = config.token;
const bot = new KBotify({
    mode: 'websocket',
    token: token,
    ignoreDecryptError: false
});
const voice = new Voice(token, bot);
setCookie(config.netease_music_cookie);

bot.message.on('text', async (msg) => {
    if (msg.author.bot) return;
    console.log(`<-TEXT ${msg.author.nickname}(${msg.author.id}) [${msg.channelName}] ${msg.content}`);
    if (msg.content.startsWith('/menu'))
        bot.API.message.create(10, msg.channelId, operation());
    if (msg.content.startsWith('/search')) {
        let keyWord = msg.content.substring(8);
        let result = await getSearchResult(keyWord);
        console.log(result);
        bot.API.message.create(10, msg.channelId, searchResult(keyWord, result));
    }
    if (msg.content.startsWith('/jump'))
        voice.jump();
});

bot.message.on('buttonEvent', async (event) => {
    console.log(`<-BUTTON ${event.user.nickname ?? event.user.username}(${event.userId}) [${event.channelId}] ${event.content}`);
    let s = event.content.split('-');
    if (s[0] == 'play') {
        let items = await fetch('https://www.kookapp.cn/api/v3/channel-user/get-joined-channel?user_id=' + event.userId + '&guild_id=' + event.guildId, {
            headers: { Authorization: 'Bot ' + token }
        }).then(res => res.json()).then(json => json.data.items);
        if (items.length == 0)
            bot.API.message.create(10, event.channelId, JSON.stringify(danger('你需要先加入一个语音频道')));
        else
            voice.connect(items[0].id, event.channelId, _ => {
                let data = neteaseSongData[s[1]];
                if (data != null)
                    voice.addSong(data.name, data.url, event.user.nickname ?? event.user.username, {});
            });
    }
    if (s[0] == 'operation') {
        if (s[1] == 'list') {
            if (!voice.playing)
                bot.API.message.create(10, event.channelId, JSON.stringify(info('当前没有正在播放的歌曲')));
            else
                bot.API.message.create(10, event.channelId, JSON.stringify(list(voice.nowPlay, voice.queue)));
        }
        if (s[1] == 'jump') {
            if (!voice.playing)
                bot.API.message.create(10, event.channelId, JSON.stringify(info('当前没有正在播放的歌曲')));
            else
                bot.API.message.create(10, event.channelId, JSON.stringify(list(voice.nowPlay, voice.queue)));
        }
        if (s[1] == 'stop') {
            if (!voice.playing)
                bot.API.message.create(10, event.channelId, JSON.stringify(info('当前没有正在播放的歌曲')));
            else
                bot.API.message.create(10, event.channelId, JSON.stringify(list(voice.nowPlay, voice.queue)));
        }
    }
});

bot.connect();
console.log('已连接到Kook服务器');