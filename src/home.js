const { Router } = require("express");
const router = Router();
const { getVideoListInfo } = require('./video-list-info');
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

const renderVideo = ({ filename, duration }) => {
  const [datename, extension] = filename.split(".");
  const [date, name] = datename.split(" - ");
  const revdate = date.split("-").reverse().join("/");
  return `
    <video controls="true">
      <source src="/videos/${filename}" />
    </video>
    <div class="info">
      <div class="header">
        <h2>${name}</h2>
        <span class="duration">${duration}</span>
      </div>
      <time>${revdate}</time>
    </div>
  `;
};

const userVideoList = async () => {
  const info = await getVideoListInfo();
  return info.map(vid => 
    `<div class="video">
      ${renderVideo(vid)}
    </div>`
  ).join('\n');
}

const adminVideoList = async () => {
  const info = await getVideoListInfo();
  return info.map(vid => 
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
