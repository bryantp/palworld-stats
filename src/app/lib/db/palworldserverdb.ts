"use server"

import { sql } from '@vercel/postgres';
import { PalworldPlayer } from '../data';

type PalworldPlayerDb = {
    username: string,
    player_server_uuid: string
}

type PalworldPlayerDbConversionFn = (rows: PalworldPlayerDb[]) => PalworldPlayer[];

type ServerInfoDb = {
    version: string
}

type  ServerInfoDbConversionFn = (rows: ServerInfoDb) => string;

// export const getActivePlayers = (conversionFn: PalworldPlayerDbConversionFn): Promise<PalworldPlayer[]> => {
//     try {
//         const data = sql`SELECT username, player_server_uuid, joined_timestamp from users_online`;
//         return data.then((a: PalworldPlayerDb[]) => conversionFn(a));
//     } catch(error) {
//         console.error(`Unable to connect to DB ${error}`);
//         return new Promise<PalworldPlayer[]>(r => r([]));
//     }
// }

// export const insertActivePlayers = () => {

// }
  
// export const getServerVersion = (conversionFn: ServerInfoDbConversionFn): Promise<string> => {
//     try {
//         const data = sql`SELECT version from server_version_history order by version_date DESC LIMIT 1`;
//         return data.then((r: ServerInfoDb) => conversionFn(r));
//     } catch(error) {
//         console.error(`Unable to connect to DB ${error}`);
//         return new Promise<string>(r => r(""));
//     }
// }
