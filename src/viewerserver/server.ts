import express from 'express';
import WebSocket from 'ws';
import path from 'path'
import fs from 'fs'
import {processInput} from '../mapper'
import {targets} from './serversettings'

const app = express();
app.use(express.static(path.resolve('../../viewer/public')));

interface Message {
    command: string;
    payload: string;
}

const server = app.listen(3000, () => {
    console.log('Server started on port 3000');
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected');

    ws.on('message', (data) => {        
        try {
            const message:Message = JSON.parse(data.toString());
            if (message.command === 'transform'){
                const input=JSON.parse(message.payload);

                processInput(input,targets).then(
                    (output)=>{
                        ws.send(JSON.stringify(output));
                    }

                );
            }            

        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });

});


type transformationOutput = {
    source: string;
    output: string;
}

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

