const { VIDEO_DIR, THUMBNAIL_DIR } = require("./config");
const util = require("util");
const fs = require("fs");
const path = require("path");
const { log } = require("./log");
const exec = util.promisify(require("child_process").exec);

const scanVideo = async (filename) => {
  const cmd = `ffprobe -v quiet -print_format json -show_format "${filename}"`;
  try {
    const { stdout } = await exec(cmd);
    const { format } = JSON.parse(stdout);
    console.log(`- Found video: "${format.filename}"`);
    return format;
  } catch (e) {
    return null;
  }
};

async function* walkDir(dir) {
  for await (const x of await fs.promises.opendir(dir)) {
    const entry = path.join(dir, x.name);
    if (x.isFile) yield entry;
  }
}

let __videoInfo = null;

const scanVideoList = async () => {
  let videoInfo = [];
  for await (const file of walkDir(VIDEO_DIR)) {
    const info = await scanVideo(file);
    // Avoid files with format_name === 'tty' (text files)
    if (info && info.format_name !== "tty") {
      videoInfo.push(info);
    }
  }
  videoInfo.sort((a, b) => {
    if (a.filename < b.filename) return -1;
    if (a.filename > b.filename) return 1;
    return 0;
  });
  videoInfo = videoInfo.map((vid) => {
    const { filename, duration } = vid;
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor(duration % 60);
    const HH = (hours < 10 ? "0" : "") + `${hours}`;
    const MM = (minutes < 10 ? "0" : "") + `${minutes}`;
    const SS = (seconds < 10 ? "0" : "") + `${seconds}`;
    return {
      absolute_filename: filename,
      filename: path.basename(filename),
      duration: `${HH}:${MM}:${SS}`,
    };
  });
  __videoInfo = videoInfo;
};

const produceThumbnails = async () => {
  // Create a directory for thumbnails if it doesn't exist
  if (!fs.existsSync(THUMBNAIL_DIR)) {
    fs.mkdirSync(THUMBNAIL_DIR);
  }
  // Produce each thumbnail
  __videoInfo.forEach(async (info, index) => {
    const { absolute_filename } = info;
    const basename = path.basename(absolute_filename);
    const absolute_thumbnail = `${THUMBNAIL_DIR}/${basename}.png`;
    if (fs.existsSync(absolute_thumbnail)) {
      log(`- Thumbnail for "${basename}" already exists`);
      info.thumbnail = `${basename}.png`;
      info.absolute_thumbnail = absolute_thumbnail;
    } else {
      const cmd = `ffmpeg -i "${absolute_filename}" -y -vframes 1 -an -s 800x600 -ss 30 "${absolute_thumbnail}"`;
      try {
        await exec(cmd);
        log(`- Wrote thumbnail: ${basename}.png`);
        info.thumbnail = `${basename}.png`;
        info.absolute_thumbnail = absolute_thumbnail;
      } catch (e) {
        log(`Error: can't get thumbnail for ${absolute_filename}: ${e.toString()}`);
        info.thumbnail = null;
        info.absolute_thumbnail = null;
      }
    }
  });
};

// Scan videos and product thumbnails
(async () => {
  await scanVideoList();
  await produceThumbnails();
})();

const videoInfo = (index) => {
  if (index) {
    return __videoInfo[index];
  } else {
    return __videoInfo;
  }
};

module.exports = {
  videoInfo,
};
