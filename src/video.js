
const express = require('express');
const { videoInfo } = require('./video-info');
const router = express.Router();

const videoPage = (content) => {
  return `
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Posgrado Fullstack - Vídeos</title>
      <link rel="stylesheet" href="styles.css" types="text/css" />
      <style>
        body {          
          margin: 0;
        }
        video {
          width: 100vw;
          height: 100vh;
        }
      </style>
    </head>
    <body>
      ${content}
    </body>
  </html>
  `;
};

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const info = videoInfo(id);
  res.send(videoPage(`
    <video controls>
      <source src="/video/${id}/file" />
    </video>
  `));
});

router.get('/:id/file', (req, res) => {
  const { id } = req.params;
  res.sendFile(videoInfo(id).absolute_filename);
})

router.get('/:id/thumbnail', (req, res) => {
  const { id } = req.params;
  res.sendFile(videoInfo(id).absolute_thumbnail);
})

module.exports = router;