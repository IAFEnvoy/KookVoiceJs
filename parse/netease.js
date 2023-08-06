let songCookie = null;

let neteaseSongData = {};

const getSearchResult = async (keyWord) => {
    keyWord = keyWord.replace(' ', '%20');
    let search = `http://music.163.com/api/search/pc?s=${keyWord}&offset=0&limit=20&type=1`;
    // if (songCookie == null)
    //     await setCookie(search);
    const a = await fetch(search, {
        headers: {
            Cookie: songCookie,
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
        }
    }).then(res => res.json());

    let result = [];
    if (a.code == 200) {
        let json = a.result;
        for (var i = 0; i < json.songs.length; i++) {
            result.push({
                name: json.songs[i].name,
                artist: json.songs[i].artists[0]?.name,
                id: json.songs[i].id
            });
            neteaseSongData[json.songs[i].id] = { url: `http://music.163.com/song/media/outer/url?id=${json.songs[i].id}.mp3`, name: json.songs[i].name + ' - ' + json.songs[i].artists[0]?.name };
        }
    }
    return result;
}

const setCookie = (cookie) => {
    songCookie = cookie;
}

module.exports = { getSearchResult, neteaseSongData, setCookie };