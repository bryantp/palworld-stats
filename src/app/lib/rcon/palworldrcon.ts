import { PalworldPlayer } from '../data';
import { parseServerStringToPlayers, parseVersionStringFromServer } from '../parser';

// @ts-ignore
import Rcon from './rcon';

const getRconConnection = () => {
    const connection = new Rcon(process.env.PALWORLD_HOST, process.env.PALWORLD_PORT, process.env.PALWORLD_ADMIN_PASSWORD);
    connection.setTimeout(5000);
    return connection;
  }
  
export const getPlayers = (): Promise<PalworldPlayer[]> => {
    return new Promise((resolve, reject) => {
        const conn = getRconConnection();
        conn.connect();

        let gotAnswer = false;

        // @ts-ignore
        conn.on('auth', function() {
            console.log("Authenticated");
            conn.send("ShowPlayers");
        }).on('response', function(str: any) {
            gotAnswer = true;
            console.log("Response: " + str);
            conn.disconnect();
            resolve(parseServerStringToPlayers(str));
        }).on('error', function(err: any) {
            console.log("Something went wrong: " + err);
            reject(err);
        }).on('server', function(str: any) {
            console.log('server response:\n' + str);
            gotAnswer = true;
            conn.disconnect();
            resolve(parseServerStringToPlayers(str));
        }).on('end', function() {
            if(!gotAnswer) {
                reject('Never got a response from server for ShowPlayers');
            }
            console.log("Connection closed");
        });
    });
}
    
export const getVersion = (): Promise<string> => {
    return new Promise((resolve, reject) => {
        const conn = getRconConnection();
        conn.connect();

        let gotAnswer = false;

        // @ts-ignore
        conn.on('auth', function() {
            console.log("Authenticated");
            conn.send("Info");
        }).on('response', function(str: any) {
            gotAnswer = true;
            console.log("Response: " + str);
            conn.disconnect();
            resolve(parseVersionStringFromServer(str));
        }).on('error', function(err: any) {
            console.log("Something went wrong: " + err);
            reject(err);
        }).on('server', function(str: any) {
            gotAnswer = true;
            console.log('server response:\n' + str);
            conn.disconnect();
            resolve(parseVersionStringFromServer(str));
        }).on('end', function() {
            if(!gotAnswer) {
                reject('Never got a response from server for Info');
            }
            console.log("Connection closed");
        });
    });
}