const { play, connect } = require("./process");
const VoiceWebSocket = require("./websocket");

class Voice {
    constructor(token, bot) {
        this.token = token;
        this.voiceWebSocket = new VoiceWebSocket(token);
        this.queue = [];
        this.nowPlay = null;
        this.playing = false;
        this.bot = bot;
        this.channel_id = null;
    }
    connect = (channel_id, source_channel_id, callback) => {
        if (this.voiceWebSocket.connection != null) return callback();
        this.channel_id = source_channel_id;
        this.voiceWebSocket.connect(channel_id, url => {
            connect(url);
            if (callback != null) callback();
        });
    }
    disconnect = () => this.voiceWebSocket.disconnect();
    addSong = (name, url, extra_data) => {
        this.queue.push({ name, url, extra_data });
        if (!this.playing) {
            this.playing = true;
            this.play();
        }
    }
    play = () => {
        this.nowPlay = this.queue.shift();
        this.bot.API.message.create(9, this.channel_id, '正在播放：' + this.nowPlay.name);
        play(this.nowPlay.url, _ => {
            if (this.queue.length == 0) {
                this.playing = false;
                this.bot.API.message.create(9, this.channel_id, '播放结束');
            } else {
                this.play();
            }
        });
    }
}

module.exports = { Voice };