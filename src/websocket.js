const fs = require('fs');
const WebSocket = require('websocket').client;

const ranInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;
let stage = 0, callbackFunction = null;

const loadJsonAndGenId = (path) => {
    let json = JSON.parse(fs.readFileSync(path));
    json.id = ranInt(1000000, 10000000);
    return json;
}

class VoiceWebSocket {
    constructor(token) {
        this.token = token;
        this.socket = new WebSocket();
        this.socket.addListener('connect', (connection) => {
            console.log("WebSocket Connected");
            this.connection = connection;
            console.log('Stage 1');
            connection.send(JSON.stringify(loadJsonAndGenId('./data/stage1.json')));
            stage = 1;
            connection.on('error', (error) => console.log("Connection Error: " + error.toString()));
            connection.on('close', () => console.log('echo-protocol Connection Closed'));
            connection.on('message', function (message) {
                if (message.type === 'utf8') {
                    console.log("<- " + message.utf8Data + "");
                    let data = JSON.parse(message.utf8Data);
                    if (stage == 1) {
                        console.log('Stage 2');
                        connection.send(JSON.stringify(loadJsonAndGenId('./data/stage2.json')));
                        stage = 2;
                    } else if (stage == 2) {
                        console.log('Stage 3');
                        connection.send(JSON.stringify(loadJsonAndGenId('./data/stage3.json')));
                        stage = 3;
                    } else if (stage == 3) {
                        console.log('Stage 4');
                        this.rtcpUrl = `rtp://${data.data.ip}:${data.data.port}?rtcpport=${data.data.rtcpPort}`;
                        let json = loadJsonAndGenId('./data/stage4.json');
                        json.data.transportId = data.data.id;
                        connection.send(JSON.stringify(json));
                        stage = 4;
                    } else if (stage == 4) {
                        console.log('Complete rtcp url receive');
                        console.log('Rtcp url: ' + this.rtcpUrl);
                        if (callbackFunction != null) callbackFunction(this.rtcpUrl);
                    }
                }
            });
        });
        this.connection = null;
        this.rtcpUrl = "";
        setInterval(_ => {
            if (this.connection != null) {
                console.log('Running WebSocket keep-alive ping');
                this.connection.ping();
            }
        }, 30 * 1000);
    }
    connect = async (channel_id, callback) => {
        callbackFunction = callback;
        console.log("Getting WS Url");
        let url = await fetch('https://www.kookapp.cn/api/v3/gateway/voice?channel_id=' + channel_id, {
            headers: { Authorization: 'Bot ' + this.token }
        }).catch(err => console.log(err)).then(res => res.json()).then(json => json.data.gateway_url);
        console.log('WebSocket Url: ' + url);
        this.socket.connect(url);
    }
    disconnect = () => {
        this.connection.close();
        this.connection = null;
    }
}

module.exports = VoiceWebSocket;