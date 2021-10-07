const { MessageType } = require("@adiwajshing/baileys");
const { sticker } = require("../lib/sticker");
const WSF = require("wa-sticker-formatter");
const uploadFile = require("../lib/uploadFile");
const uploadImage = require("../lib/uploadImage");
let { webp2png } = require("../lib/webp2mp4");
let handler = async (m, { conn, args, usedPrefix, command }) => {
  let stiker = false;
  let wsf = false;
  try {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || "";
    if (/webp/.test(mime)) {
      let img = await q.download();
      if (!img) throw `balas media dengan caption ${usedPrefix + command}`;
      wsf = new WSF.Sticker(img, {
        pack: global.packname,
        author: global.author,
        crop: true,
      });
    } else if (/image/.test(mime)) {
      let img = await q.download();
      let link = await uploadImage(img);
      if (!img) throw `balas media dengan caption ${usedPrefix + command}`;
      wsf = new WSF.Sticker(link, {
        pack: global.packname,
        author: global.author,
        crop: true,
      });
    } else if (/video/.test(mime)) {
      if ((q.msg || q).seconds > 11) throw "Maksimal 10 detik!";
      let img = await q.download();
      let link = await uploadImage(img);
      if (!img) throw `balas media dengan caption ${usedPrefix + command}`;
      wsf = new WSF.Sticker(link, {
        pack: global.packname,
        author: global.author,
        crop: true,
      });
    } else if (args[0]) {
      if (isUrl(args[0]))
        wsf = new WSF.Sticker(args[0], {
          pack: global.packname,
          author: global.author,
          crop: true,
        });
      else throw "URL tidak valid!";
    }
  } catch (e) {
    throw e;
  } finally {
    if (wsf) {
      await wsf.build();
      const sticBuffer = await wsf.get();
      if (sticBuffer)
        await conn.sendMessage(m.chat, sticBuffer, MessageType.sticker, {
          quoted: m,
          mimetype: "image/webp",
        });
    }
    if (stiker)
      await conn.sendMessage(m.chat, stiker, MessageType.sticker, {
        quoted: m,
      });
    // else throw `Gagal${m.isGroup ? ', balas gambarnya!' : ''}`
  }
};
handler.help = ["stiker ", "stiker <url>"];
handler.tags = ["sticker"];
handler.command = /^s(tic?ker)?(gif)?(wm)?$/i;

module.exports = handler;

const isUrl = (text) => {
  return text.match(
    new RegExp(
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png|mp4)/,
      "gi"
    )
  );
};
