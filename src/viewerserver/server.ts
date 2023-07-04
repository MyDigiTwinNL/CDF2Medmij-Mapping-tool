import express from 'express';
import WebSocket from 'ws';
import path from 'path'
import fs from 'fs'
import { processInput } from '../mapper'
import { targets } from './serversettings'

//To resolve all relative paths from the 'dist' folder.
const folderPath = path.resolve(__dirname);
process.chdir(folderPath);

const app = express();
app.use(express.static(path.resolve('../../viewer/public')));

interface ServerRequest {
    command: string;
    payload: string;
}

const server = app.listen(3000, () => {
    console.log('Server started on port 3000. Open http://localhost:3000 in a web browser');
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected');

    ws.on('message', (data) => {
        try {
            const message: ServerRequest = JSON.parse(data.toString());
            if (message.command === 'transform') {
                const input = JSON.parse(message.payload);
                processInput(input, targets).then(
                    (output) => {                    
                        ws.send(JSON.stringify({"responsetype":"output","payload":output}));
                    }

                ).catch((error) => {
                    const errmsg = error.cause!=null?error.cause.toString():error
                    console.info("Error:"+errmsg);
                    ws.send(JSON.stringify({"responsetype":"error","payload":errmsg}));
                }
                )
            }
        }
        catch (error) {
            ws.send(JSON.stringify({"responsetype":"error","payload":`Error parsing input:${error}`}));
            console.error('Error parsing message:', error);
        }

    })
})

type transformationOutput = {
    source: string;
    output: string;
}

/*
For real-time update
fs.watchFile(`/tmp/out.json`, { interval: 500 }, (curr, prev) => {
    if (curr.mtime > prev.mtime) {
        console.log(`File modified.`);
        const payload: string = fs.readFileSync(`/tmp/out.json`, 'utf8');

        wss.clients.forEach(client => {
            const message: transformationOutput = { source: "", output: payload }
            console.log(`Sending`);
            client.send(JSON.stringify(payload));
        });

        //ws.send(JSON.stringify(payload));
    }
});
*/
