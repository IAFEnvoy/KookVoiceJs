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
    for (let i = 0; i < result.length; i++) 
        modules.push({
            "type": "section",
            "text": {
                "type": "plain-text",
                "content": result[i].name + '-' + result[i].artist
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
    return JSON.stringify([
        {
            "type": "card",
            "theme": "info",
            "size": "lg",
            "modules": modules
        }
    ]);
}

module.exports = { searchResult };