
const TYPE = {
  DmType: {
    0: "Text",
    1: "Emoji",
    2: "Voice",
    Text: 0,
    Emoji: 1,
    Voice: 2
  }
}
function parse(e: Array<any>) {
  var t = e[0][12]
    , n = e[0][14]
    , i = e[0][13]
    , o = {
      stime: -1,
      mode: e[0][1],
      size: e[0][2],
      color: e[0][3],
      date: performance.now(),
      uid: e[2][0],
      dmid: e[0][5],
      text: e[1],
      uname: e[2][1],
      user: {
        level: e[4][0],
        rank: e[2][5],
        verify: Boolean(e[2][6])
      },
      checkInfo: {
        ts: e[9].ts,
        ct: e[9].ct
      },
      type: e[0][9],
      dmType: TYPE.DmType.Text,
      modeInfo: e[0][15]
    };
  return t === TYPE.DmType.Emoji ? Object.assign({}, o, {
    emoticonOptions: i,
    dmType: TYPE.DmType.Emoji
  }) : t === TYPE.DmType.Voice ? Object.assign({}, o, {
    dmType: TYPE.DmType.Voice,
    voiceConfig: n
  }) : o
}