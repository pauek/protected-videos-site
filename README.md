# Environment file
Create a .env file in this directory with the following information:
```
PORT=8080
PASSWORD=yourpwd
LOG=false      
```
# Start, stop and running in dev mode:

```
npm start
npm stop
npm run dev
```

# Logs
The variable LOG in .env manages internal logs. 

You can also check pm2 logs with:
```
pm2 logs
```
