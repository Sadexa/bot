const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const { MessageType } = require("@adiwajshing/baileys");
const WSF = require("wa-sticker-formatter");

let handler = async (m, { conn, usedPrefix, command }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || "";
  if (/webp/.test(mime)) {
      let img = await q.download()
      let out = await webp2png(img)
      if (!img) throw `balas stiker dengan perintah ${usedPrefix + command} <packname>|<author>`
      stiker = await sticker(0, out, packname || '', author || '')
    } else if (/image/.test(mime)) {
      let img = await q.download()
      let link = await uploadImage(img)
      if (!img) throw `balas gambar dengan perintah ${usedPrefix + command} <packname>|<author>`
      stiker = await sticker(0, link, packname || '', author || '')
    } else if (/video/.test(mime)) {
      if ((q.msg || q).seconds > 11) throw 'Maksimal 10 detik!'
      let img = await q.download()
      let link = await uploadFile(img)
      if (!img) throw `balas video dengan perintah ${usedPrefix + command} <packname>|<author>`
      stiker = await sticker(0, link, packname || '', author || '')
    }
  } finally {
    if (stiker) await conn.sendMessage(m.chat, stiker, MessageType.sticker, {
      quoted: m
    })
    else throw 'Balas stikernya!'
  }
  
 }
    const encmedia = m.quoted ? m.quoted.fakeObj : m;
    const media = await conn.downloadAndSaveMediaMessage(encmedia);
    const ran = getRandom(".webp");
    await ffmpeg(`./${media}`)
      .input(media)
      .on("start", function (cmd) {
        console.log(`Started : ${cmd}`);
      })
      .on("error", function (e) {
        console.log(`Error : ${e}`);
        fs.unlinkSync(media);
        m.reply("Error!");
      })
      .on("end", function () {
        console.log("Finish");
        buff = fs.readFileSync(ran);
        conn.sendMessage(m.chat, buff, MessageType.sticker, {
          quoted: m,
          mimetype: "image/webp",
        });
        fs.unlinkSync(media);
        fs.unlinkSync(ran);
      })
      .addOutputOptions([
        `-vcodec`,
        `libwebp`,
        `-vf`,
        `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`,
      ])
      .toFormat("webp")
      .save(ran);
  } else if (/video/.test(mime)) {
    if ((q.msg || q).seconds > 11) throw "Maksimal 10 detik!";
    const encmedia = m.quoted ? m.quoted.fakeObj : m;
    const media = await conn.downloadAndSaveMediaMessage(encmedia);
    const ran = getRandom(".webp");
    await ffmpeg(`./${media}`)
      .inputFormat(media.split(".")[1])
      .on("start", function (cmd) {
        console.log(`Started : ${cmd}`);
      })
      .on("error", function (e) {
        console.log(`Error : ${e}`);
        fs.unlinkSync(media);
        tipe = media.endsWith(".mp4") ? "video" : "gif";
        m.reply(`_*Gagal, pada saat mengkonversi ${tipe} ke stiker*_`);
      })
      .on("end", function () {
        console.log("Finish");
        buff = fs.readFileSync(ran);
        conn.sendMessage(m.chat, buff, MessageType.sticker, {
          quoted: m,
          mimetype: "image/webp",
        });
        fs.unlinkSync(media);
        fs.unlinkSync(ran);
      })
      .addOutputOptions([
        `-vcodec`,
        `libwebp`,
        `-vf`,
        `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`,
      ])
      .toFormat("webp")
      .save(ran);
  } else throw `balas stiker dengan perintah ${usedPrefix + command}`;
};
handler.help = ["stiker2"];
handler.tags = ["sticker"];
handler.command = /^(take2|tk2|\?)$/i

handler.owner = true;

module.exports = handler;

const getRandom = (ext) => {
  return `${Math.floor(Math.random() * 10000)}${ext}`;
};
