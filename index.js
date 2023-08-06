const VoiceWebSocket = require("./websocket");
const KBotify = require('kbotify').KBotify;
const { play } = require("./process");
const { getSearchResult, neteaseSongData } = require("./parse/netease");
const Card = require('./card');
const { Voice } = require("./voice");

const token = '1/MTYxNTI=/Xs54ZjeKTxW78H0Lh0VkjQ==';
let rtcp = null;

const bot = new KBotify({
    mode: 'websocket',
    token: token,
    ignoreDecryptError: false
});
const voice = new Voice(token, bot);

bot.message.on('text', async (msg) => {
    if (msg.author.bot) return;
    console.log(`<-TEXT ${msg.author.nickname}(${msg.author.id}) [${msg.channelName}] ${msg.content}`);
    if (msg.content.startsWith('/play')) {
        let items = await fetch('https://www.kookapp.cn/api/v3/channel-user/get-joined-channel?user_id=' + msg.authorId + '&guild_id=' + msg.guildId, {
            headers: { Authorization: 'Bot ' + token }
        }).then(res => res.json()).then(json => json.data.items);
        if (items.length == 0) {
            bot.API.message.create(1, msg.channelId, '你需要先加入一个语音频道');
        } else {
            rtcp = new VoiceWebSocket(token, rtcpUrl => {
                console.log(rtcpUrl);
                play(rtcpUrl, msg.content.split(' ')[1].split(']')[0].substring(1));
            });
            await rtcp.connect(items[0].id);
        }
    }
    if (msg.content.startsWith('/search')) {
        let keyWord = msg.content.substring(8);
        let result = await getSearchResult(keyWord);
        console.log(result);
        bot.API.message.create(10, msg.channelId, Card.searchResult(keyWord, result));
    }
});

bot.message.on('buttonEvent', async (event) => {
    console.log(`<-BUTTON ${event.user.nickname ?? event.user.username}(${event.userId}) [${event.channelId}] ${event.content}`);
    let s = event.content.split('-');
    if (s[0] == 'play') {
        let items = await fetch('https://www.kookapp.cn/api/v3/channel-user/get-joined-channel?user_id=' + event.userId + '&guild_id=' + event.guildId, {
            headers: { Authorization: 'Bot ' + token }
        }).then(res => res.json()).then(json => json.data.items);
        if (items.length == 0) {
            bot.API.message.create(1, msg.channelId, '你需要先加入一个语音频道');
        } else {
            voice.connect(items[0].id, event.channelId, _ => {
                let data = neteaseSongData[s[1]];
                voice.addSong(data.name, data.url, { sender: { name: event.user.nickname ?? event.user.username } });
            });
        }
    }
});

bot.connect();
console.log('已连接到Kook服务器');