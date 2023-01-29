# Welcome to Kaspa Node Monitor 👋
This tool lets you easily monitor your Kaspa Node.

<span style="color:yellow">**NOTE: Kaspa Node Monitor is still in beta, it may contain bugs.**</span>


## Displayed information 📚
Kaspa Node Monitor displays information such as:

- Block count
- Header count
- Peers count
- DAA Score
- Blue score
- Node version
- Node sync status
- Node network
- Network difficulty
- Hardware information (this can be disabled), such as:
    - Hostname
    - Location
    - CPU Model
    - CPU Thread Count
    - RAM (Free & Total)
    - System load

## Setup ☎
Below you will find the instructions to set up Kaspa Node Monitor with your Kaspa Node. These instructions are for Linux, some steps may be different on other operating systems, for example `nano` is a linux package.

**You need to have [NodeJS](https://nodejs.org/) and [Git](https://git-scm.com/) installed on your system.**
<span style="color:yellow">**NOTE: These instructions are for the beta version, the setup process on the final release may change.**</span>

1. Clone this GitHub Repository

   		$ git clone https://github.com/imalfect/KaspaNodeMonitor
2. Go to the cloned directory

   		$ cd KaspaNodeMonitor
3. Install all the required packages

   		$ npm install
4. Configure Kaspa Node Monitor
    1. Configure the backend
        1. Go to the backend directory

           		$ cd server
       
        2. Copy the example .env file

           		$ cp .env.example .env
    
        3. Edit and save the .env file to your preferences with your favorite editor (More about the .env file later in the README)

           		$ nano .env
       
        4. Go back to the main directory and follow the next steps

           		$ cd ..
       
    2. Configure the frontend
        1. Go to the frontend directory

           		$ cd client
       
        2. Copy the example config.json file

           		$ cp config.json.example config.json
       
        3. Edit and save the config.json file to your preferences with your favorite editor (More about the config.json file later in the README)

           		$ nano config.json
       
        4. Build the frontend, and go back to the main directory and follow the next steps.

           		$ npm run build && cd ..
       
5. Once you're all finished with the configuration, and you've built the frontend you're ready to go! If you set the `SERVE_FRONTEND` parameter in the backend `.env` to `false`, you'll have to copy the `dist` folder from the `client` directory and serve it to the user. If you set it to true, it will be served automatically with the backend on the same port.
6. Run the backend


    	$ npm start

Congratulations! You have successfully set up Kaspa Node Monitor, and it is now running on the port that you've set, If you want the domain monitor to run under a domain, you'll have to configure it in your reverse proxy and/or DNS records.

## .env and config.json
.env and config.json are configuration files for Kaspa Node Monitor, the .env file is used for the backend, and the config.json is used for the frontend. Both of them are explained below.

### .env
The .env file is used for the backend and can be found in the `backend` directory.

#### Parameters

---
| Parameter                | Description                                                                                                                                                                                                                        |
|--------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ALLOW_SERVER_INFORMATION | This setting allows the server to send information about itself to the client. If you're running the node monitor on a different machine that the node is running on, you'll be able to set the information manually in the future |
| NODE_LOCATION            | The location of the server the node runs on (preferably the country)                                                                                                                                                               |
| LOG_LEVEL                | This setting allows you to set the log level for the backend, the default one is `info`, if you want to see the debug information, you can set it to `debug`                                                                       |
| PORT                     | The port that the server will run on                                                                                                                                                                                               |
| HOST                     | The host ip that the node monitor should run on (hint: use 127.0.0.1 for local installation and 0.0.0.0 for public)                                                                                                                |
| SERVE_FRONTEND           | If you want to serve the frontend with the server, set this to true                                                                                                                                                                |
---

### config.json
The config.json file is used for the frontend and can be found in the `client` directory

#### Parameters

---

| Parameter   | Description                                                                                                                                              |
|-------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| welcomeText | This text will be displayed on the frontend under the Kaspa Node Monitor header                                                                          |
| wsApiURL    | Put the WebSocket API URL here (eg. ws://127.0.0.1:3000/ws), it's basically your backend url with /ws added to it                                        |
| theme       | This setting is used to specify the theme that the frontend will use, more on themes in the themes.md file, which can be found in the `client` directory |
								
---

## Docker

_IMPORTANT_: When using with Docker, your Hardware information for RAM and Load will be what Docker has access to. It will not represent the state of the host.

### Production

_NOTE_: Temporary. When released, this will be using a published image.

Only the server will be started in this environment. It is expected your run this in the server that contains

To use with Docker, run the command:

```
cd <root of folder>
docker compose up -d
```

### Development

To use with Docker for development, run the command:

```
cd <root of folder>
docker compose -f docker-compose-dev.yaml up -d
```

If this is the first time you run `docker-compose up`, it will take about 5mins to install dependencies. You should have `node_modules` in both `client` and `server` folders.

After it's done installing, you can access the monitor at `localhost:2989`.

### Config changes for Docker

Changes to `server/.env`:
- If you're running the `server` container on the same host as kaspad, you can use the NODE_URL: `NODE_URL=host.docker.internal:16110`

Changes to `client/config.json`:
- Use this for `wsApiURL`: `"wsApiURL": "ws://127.0.0.1:8124/ws"`
  - The `8124` here matches the port in `docker-compose.yaml`

## Contributing
Pull requests are welcome on our [GitHub](https://github.com/imalfect/KaspaNodeMonitor). For major changes, please open an issue first to discuss what you would like to change.

## Credits 🎩
Kaspa Node Monitor is created by [iMalFect](https://github.com/imalfect)

## License 📜
Kaspa Node Monitor is licensed under [ISC](https://choosealicense.com/licenses/isc/)



