const { Router } = require("express");
const router = Router();
const { videoInfo } = require('./video-info');
const { TITLE } = require('./config');

const htmlPage = (content, options) => {
  return `
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Posgrado Fullstack - Vídeos</title>
      <link rel="stylesheet" href="styles.css" types="text/css" />
    </head>
    <body>
      <header ${options && options.admin ? 'class="admin"' : ''}>
        <h4>${TITLE}</h4>
        <div class="spacer"></div>
        <a href="/logout">Logout</a>
      </header>
      <div id="content">
        ${content}
      </div>
    </body>
  </html>
  `;
};

const renderVideo = ({ filename, duration, thumbnail }, index) => {
  const [datename, extension] = filename.split(".");
  const [date, name] = datename.split(" - ");
  const revdate = date.split("-").reverse().join("/");
  return `
    <a href="/video/${index}">
      <img class="thumbnail" src="/video/${index}/thumbnail" alt="Video thumbnail" />
      <div class="icon"><div class="arrow"></div></div>
    </a>
    <div class="info">
      <div class="header">
        <h2>${name}</h2>
        <span class="duration">${duration}</span>
      </div>
      <time>${revdate}</time>
    </div>
  `;
};

const userVideoList = () => {
  return videoInfo().map((vid, index) => 
    `<div class="video">
      ${renderVideo(vid, index)}
    </div>`
  ).join('\n');
}

const adminVideoList = async () => {
  return videoInfo().map(vid => 
    `<div class="info">${vid.filename}</div>`
  ).join('\n');
}

router.get("/", async (req, res) => {
  if (req.isAdmin) {
    res.send(htmlPage(await adminVideoList(), { admin: true }));
  } else {
    res.send(htmlPage(await userVideoList()));
  }
});

module.exports = router;
