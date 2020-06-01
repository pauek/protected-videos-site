# Dependencies

Apart from `npm install`, this package requires the `ffprobe` binary, which is
part of the [FFmpeg distribution](http://ffmpeg.org). In a debian-like system
you can install it as follows:

```
sudo apt install ffmpeg
```

Also, at least use **NodeJS version 12.12.0** (since the code needs the
`fs.promises.opendir` function).

# Video Directory

Prepare a directory with videos where each video is named according to the
following convention:

```
YYYY-MM-DD - Video Title.ext
```

That is: a date at the beginning, with year-month-day order; then a separator
which is exactly ` - `; and after that the title for the video. The video
extension (`ext`) depends on the video format.

The `VIDEO_DIR` environment variable should be set to the path to this
directory.

# Environment

Create an `.env` file in this directory with the following information:

```
PORT=8080
PASSWORD=yourpwd
ADMIN_PASSWORD=youradminpwd
VIDEO_DIR=/your/video/dir
TITLE=Your Page Title
```

If you want to see log messages add:

```
LOG=true
```

Logs appear normally if you run with `npm run dev`, and you can show them with
`pm2 logs` otherwise.

# Running

Start, stop or run in development mode:
```
npm start
npm stop
npm run dev
```
