const searchResult = (keyWord, result) => {
    let modules = [{
        "type": "section",
        "text": {
            "type": "kmarkdown",
            "content": "搜索关键词：" + keyWord
        }
    },
    {
        "type": "divider"
    }];
    if (result.length == 0)
        modules.push('很抱歉，未能搜索到相关歌曲信息');
    for (let i = 0; i < result.length; i++)
        modules.push({
            "type": "section",
            "text": {
                "type": "plain-text",
                "content": result[i].name + ' - ' + result[i].artist
            },
            "mode": "right",
            "accessory": {
                "type": "button",
                "theme": "primary",
                "value": 'play-' + result[i].id,
                "click": "return-val",
                "text": {
                    "type": "plain-text",
                    "content": "点歌"
                }
            }
        });
    return JSON.stringify([{
        "type": "card",
        "theme": "info",
        "size": "lg",
        "modules": modules
    }]);
}
const nextSongCard = (data) => [{
    "type": "card",
    "theme": "info",
    "size": "lg",
    "modules": [{
        "type": "header",
        "text": {
            "type": "plain-text",
            "content": "正在播放：" + data.name
        }
    },
    {
        "type": "section",
        "text": {
            "type": "plain-text",
            "content": "点歌人：" + data.sender
        }
    }]
}]
const addSong = (data) => [{
    "type": "card",
    "theme": "info",
    "size": "lg",
    "modules": [{
        "type": "header",
        "text": {
            "type": "plain-text",
            "content": "添加音乐成功"
        }
    },
    {
        "type": "divider"
    },
    {
        "type": "section",
        "text": {
            "type": "kmarkdown",
            "content": `歌曲：${data.name}\n点歌人：${data.sender}`
        }
    }]
}]
const danger = (text) => [{
    "type": "card",
    "theme": "danger",
    "size": "lg",
    "modules": [{
        "type": "section",
        "text": {
            "type": "kmarkdown",
            "content": text
        }
    }]
}]
const info = (text) => [{
    "type": "card",
    "theme": "info",
    "size": "lg",
    "modules": [{
        "type": "section",
        "text": {
            "type": "kmarkdown",
            "content": text
        }
    }]
}]
const success = (text) => [{
    "type": "card",
    "theme": "success",
    "size": "lg",
    "modules": [{
        "type": "section",
        "text": {
            "type": "kmarkdown",
            "content": text
        }
    }]
}]
const list = (nowPlay, queue) => {
    let fields = [{
        "type": "kmarkdown",
        "content": "**歌曲**"
    },
    {
        "type": "kmarkdown",
        "content": "**点歌人**"
    }];
    for (let i = 0; i < queue.length; i++) {
        fields.push({
            "type": "kmarkdown",
            "content": (i + 1) + '.' + queue[i].name
        });
        fields.push({
            "type": "kmarkdown",
            "content": queue[i].sender
        });
    }
    return [{
        "type": "card",
        "theme": "info",
        "size": "lg",
        "modules": [{
            "type": "section",
            "text": {
                "type": "plain-text",
                "content": "正在播放"
            }
        },
        {
            "type": "header",
            "text": {
                "type": "plain-text",
                "content": nowPlay.name
            }
        },
        {
            "type": "section",
            "text": {
                "type": "plain-text",
                "content": "点歌人：" + nowPlay.sender
            }
        },
        {
            "type": "divider"
        },
        {
            "type": "section",
            "text": {
                "type": "plain-text",
                "content": "列表中的歌曲"
            }
        },
        {
            "type": "section",
            "text": {
                "type": "paragraph",
                "cols": 2,
                "fields": fields
            }
        }]
    }]
}
const operation = () => [{
    "type": "card",
    "theme": "secondary",
    "size": "lg",
    "modules": [{
        "type": "header",
        "text": {
            "type": "plain-text",
            "content": "控制台"
        }
    },
    {
        "type": "divider"
    },
    {
        "type": "action-group",
        "elements": [{
            "type": "button",
            "theme": "info",
            "value": "operation-list",
            "click": "return-val",
            "text": {
                "type": "plain-text",
                "content": "列表"
            }
        }]
    },
    {
        "type": "action-group",
        "elements": [{
            "type": "button",
            "theme": "info",
            "value": "operation-jump",
            "click": "return-val",
            "text": {
                "type": "plain-text",
                "content": "切歌"
            }
        },
        {
            "type": "button",
            "theme": "info",
            "value": "operation-stop",
            "click": "return-val",
            "text": {
                "type": "plain-text",
                "content": "停止"
            }
        }]
    }]
}]
module.exports = { searchResult, nextSongCard, success, danger, info, addSong, list, operation };