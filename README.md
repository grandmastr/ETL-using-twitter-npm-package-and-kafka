# IP Address Finder
> This programme gets tweet streams from twitter api using the Twitter package from npm and sends the transformed data from there to kafka, and from kafka they are written in a json file

## Installation
Install dependencies
```bash
npm install or yarn install
```
To start the production
```bash
npm run produce or yarn produce
```

To start the consumption and json file writing
```bash
npm run consume or yarn consume
```

After setting up the app environment, open the `.env` file generated in 
your app and fill the value of Twitter API keys and secrets with the key gotten from [IPStack](http://api.ipstack.com)

Dependencies
```bash
dotenv, jsonfile, kafka-node, node-cron, prettier, redis, twitter
```

