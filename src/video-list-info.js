const { VIDEO_DIR } = require("./config");
const util = require("util");
const fs = require("fs");
const path = require("path");
const express = require("express");
const exec = util.promisify(require("child_process").exec);

const videoInfo = async (filename) => {
  const cmd = `ffprobe -v quiet -print_format json -show_format "${filename}"`;
  try {
    const { stdout } = await exec(cmd);
    console.log("Success", stdout);
    return JSON.parse(stdout);
  } catch (e) {
    console.log("Error", e.toString());
    return {};
  }
};

async function* walkDir(dir) {
  for await (const x of await fs.promises.opendir(dir)) {
    const entry = path.join(dir, x.name);
    if (x.isFile) yield entry;
  }
}

const getVideoListInfo = async () => {
  let videoListInfo = [];
  for await (const file of walkDir(VIDEO_DIR)) {
    const { format } = await videoInfo(file);
    // Avoid files with format_name === 'tty' (text files)
    if (format && format.format_name !== "tty") {
      videoListInfo.push(format);
    }
  }
  videoListInfo.sort((a, b) => {
    if (a.filename < b.filename) return -1;
    if (a.filename > b.filename) return 1;
    return 0;
  });
  videoListInfo = videoListInfo.map((vid) => {
    const { filename, duration } = vid;
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor(duration % 60);
    const HH = (hours < 10 ? "0" : "") + `${hours}`;
    const MM = (minutes < 10 ? "0" : "") + `${minutes}`;
    const SS = (seconds < 10 ? "0" : "") + `${seconds}`;
    return {
      filename: path.basename(filename),
      duration: `${HH}:${MM}:${SS}`,
    };
  });
  return videoListInfo;
};

module.exports = {
  getVideoListInfo,
};
