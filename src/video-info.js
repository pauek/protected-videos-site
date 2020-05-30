const util = require("util");
const fs = require("fs");
const path = require("path");
const exec = util.promisify(require("child_process").exec);

const videoInfo = async (filename) => {
  const cmd = `ffprobe -v quiet -print_format json -show_format "${filename}"`;
  const { stdout } = await exec(cmd);
  return JSON.parse(stdout);
};

async function* walkDir(dir) {
  for await (const x of await fs.promises.opendir(dir)) {
    const entry = path.join(dir, x.name);
    if (x.isFile) yield entry;
  }
}

const getVideoListInfo = async () => {
  let videoListInfo = [];
  for await (const file of walkDir("videos")) {
    videoListInfo.push(await videoInfo(file));
  }
  return videoListInfo.map(vid => {
    const { filename, duration, format_name } = vid.format;
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor(duration % 3600 / 60);
    const seconds = Math.floor(duration % 60);
    const HH = (hours < 10 ? "0" : "") + `${hours}`;
    const MM = (minutes < 10 ? "0" : "") + `${minutes}`;
    const SS = (seconds < 10 ? "0" : "") + `${seconds}`;
    return { 
      filename: path.basename(filename),
      duration: `${HH}:${MM}:${SS}`,
    };
  });
};

module.exports = {
  getVideoListInfo,
};
