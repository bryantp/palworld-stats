"use server"

import { PalworldPlayer } from "../data";
import { Redis, RedisOptions  } from 'ioredis';


const PLAYER_LIST_KEY = "pal:server:players";
const SERVER_VERSION_KEY = "pal:server:version";

let instance : Redis; 

const getRedisInstance = () => {
    if(!instance) {
        const connectionInfo: RedisOptions   = {
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
            username: process.env.REDIS_USERNAME,
            password: process.env.REDIS_PASSWORD,
            tls: {
                rejectUnauthorized: false
            },
            readOnly: true
        };
        instance = new Redis(connectionInfo);
    }


    return instance;
}

export const getPlayersFromRedis = (): PalworldPlayer[] => {
    getRedisInstance();
    return instance.get(PLAYER_LIST_KEY).then((result: string | null) => result ? JSON.parse(result) : []) as unknown as PalworldPlayer[];
}
  
export const getServerVersionFromRedis = (): string => {
    getRedisInstance();
    return instance.get(SERVER_VERSION_KEY) as unknown as string;
}