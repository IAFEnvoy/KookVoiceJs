const child_process = require('child_process');

const spawn = (args) => child_process.spawn('ffmpeg', args, {
    shell: true,
    stdio: ['pipe', 'pipe', 'pipe']
});

let ffmpegRtcp = null, ffmpegMusic = null;

let loaded = true, length = 0, ended_time = 0, callbackFunction = null;
setInterval(_ => {
    if (!loaded) return;
    let now = new Date().getTime();
    if (now > ended_time) {
        loaded = false;
        if (callbackFunction != null) callbackFunction();
    }
}, 1000);

const connect = (rtcp) => {
    let ffmpegArg1 = [`-re`, `-loglevel`, `level+info`, `-nostats`, `-i`, `-`, `-map`, `0:a:0`, `-acodec`, `libopus`, `-ab`, `128k`, `-ac`, `2`, `-ar`, `48000`, `-f`, `tee`, `[select=a:f=rtp:ssrc=1357:payload_type=100]${rtcp}`];
    console.log('Running ffmpeg ' + ffmpegArg1.join(' '));
    ffmpegRtcp = spawn(ffmpegArg1);
}

const play = (file, callback) => {
    loaded = false;
    let ffmpegArg2 = [`-nostats`, `-i`, `"${file}"`, `-filter:a`, `volume=0.4`, `-ss ${0}`, `-format`, `pcm_s16le`, `-ac`, `2`, ``, `-ar`, `48000`, `-f`, `wav`, `-`];
    console.log('Running ffmpeg ' + ffmpegArg2.join(' '));
    ffmpegMusic = spawn(ffmpegArg2);
    let l = 0;
    ffmpegMusic.stdout.on('data', data => {
        l += data.length;
        length = l / 48000 / 4;
        try {
            ffmpegRtcp.stdin.write(data);
        } catch (err) {
            console.log(err);
        }
    });
    ffmpegMusic.on('close', _ => {
        ended_time = new Date().getTime() + length * 1000;
        loaded = true;
        callbackFunction = callback;
    });
}

module.exports = { connect, play, loaded, length };