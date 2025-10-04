module.exports.config = {
  name: ",Raja7",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Shaon Ahmed",
  description: "Send best Islamic Video",
  commandCategory: "noprefix",
  usages: "😒",
  cooldowns: 5,
  dependencies: {
    "request":"",
    "fs-extra":"",
    "axios":""
  }
};

module.exports.handleEvent = async ({ api, event, Threads }) => {
  if(!event.body) return; // সেফটি চেক

  const triggers = ["aso","janina","ami","Dhur","oi","Suna","Jan","Kemon","oi jan","Ki"];
  if(!triggers.some(word => event.body.startsWith(word))) return;

  const axios = global.nodemodule["axios"];
  const request = global.nodemodule["request"];
  const fs = global.nodemodule["fs-extra"];
  
  const link = [
    "https://i.imgur.com/JxSYk0b.mp4",
    "https://i.imgur.com/6LHAb4R.mp4",
    "https://i.imgur.com/Vnuam22.mp4",
    "https://i.imgur.com/h1TEgbn.mp4",
    "https://i.imgur.com/iC5t8Xd.mp4",
    "https://i.imgur.com/jRCtMZM.mp4",
    "https://i.imgur.com/flgABWM.mp4",
    "https://i.imgur.com/fTobCMI.mp4",
    "https://i.imgur.com/4nWaJed.mp4",
    "https://i.imgur.com/r2bzwnt.mp4",
    "https://i.imgur.com/m1WJX4L.mp4",
    "https://i.imgur.com/U3vUCU4.mp4",
    "https://i.imgur.com/eCy6iyu.mp4",
    "https://i.imgur.com/i0vXz4A.mp4",
    "https://i.imgur.com/BNIR463.mp4",
    "https://i.imgur.com/azfa064.mp4",
    "https://i.imgur.com/NVkqTV3.mp4",
    "https://i.imgur.com/oP4RHOZ.mp4",
    "https://i.imgur.com/oTgxKfg.mp4",
    "https://i.imgur.com/efpHAn8.mp4",
    "https://i.imgur.com/MLtfe0L.mp4",
    "https://i.imgur.com/s1HpoDU.mp4",
    "https://i.imgur.com/X3FdGKj.mp4",
    "https://i.imgur.com/cxxJ9mK.mp4",
    "https://i.imgur.com/Yn4aJO2.mp4",
    "https://i.imgur.com/qKX9s2j.mp4"
  ];

  const timeStart = Date.now();
  const PREFIX = global.config.PREFIX || "";

  const callback = () => {
    api.sendMessage({
      body: `•—»✨[ 𝐏𝐫𝐞𝐟𝐢𝐱 𝐄𝐯𝐞𝐧𝐭 ]✨«—•\n•┄┅════❁🌺❁════┅┄•\n\n❂\n🫶💜🪽\n___কষ্ট আর কষ্ট এতো কষ্ট আর আমার মনে রাখার জায়গা নেই জানিনা কখন হার্ট স্ট্রোক করে মারা যায় ♡🩷🕌\n\n#RAJA 卝 চৌধুরীヅ\n\n•┄┅════❁🌺❁════┅┄•\n•—»✨[ 𝐑𝐚𝐣𝐚 𝐏𝐫𝐨𝐣𝐞𝐜𝐭 ]✨«—•\n[🐰] Prefix : [ ${PREFIX} ]\n[🫰] 𝐍𝐎𝐏𝐑𝐄𝐅𝐈𝐗 : 😒\n[⌛] Date : ${Date.now() - timeStart} ms\n[🍒] ${global.config.BOTNAME}`,
      attachment: fs.createReadStream(__dirname + "/cache/2024.mp4")
    }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/2024.mp4"), event.messageID);
  };

  const videoLink = link[Math.floor(Math.random() * link.length)];
  request(encodeURI(videoLink)).pipe(fs.createWriteStream(__dirname+"/cache/2024.mp4")).on("close", callback);
};

module.exports.languages = {
  "vi": {
    "on": "Dùng sai cách rồi lêu lêu",
    "off": "sv ngu, đã bão dùng sai cách",
    "successText": `🧠`,
  },
  "en": {
    "on": "on",
    "off": "off",
    "successText": "success!",
  }
};

module.exports.run = async ({ event, api, Threads, getText }) => {
  let { threadID, messageID } = event;
  let data = (await Threads.getData(threadID)).data;
  if (typeof data["😒"] == "undefined" || data["😒"] == true) data["😒"] = false;
  else data["😒"] = true;
  await Threads.setData(threadID, { data });
  global.data.threadData.set(threadID, data);
  api.sendMessage(`${(data["😒"] == false) ? getText("off") : getText("on")} ${getText("successText")}`, threadID, messageID);
};
