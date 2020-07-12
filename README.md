# Video Directory

Prepare a directory with videos where each video is named according to the
following convention:

```
YYYY-MM-DD - Video Title.ext
```

That is: a date at the beginning, with year-month-day order; then a separator
which is exactly ` - `; and after that the title for the video. The video
extension (`ext`) depends on the video format.

# Docker Compose

In the docker-compose.yml you can edit the external port to be exposed, and the environment variables.

```
PASSWORD=your_user_password
ADMIN_PASSWORD=your_admin_password
TITLE=Your Page Title
```

# Commands

## Start
docker-compose up -d 

## Stop
docker-compose down

## Logs
docker-compose logs
