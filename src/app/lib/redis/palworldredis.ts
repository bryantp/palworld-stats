import { kv } from "@vercel/kv";
import { PalworldPlayer } from "../data";

const PLAYER_LIST_KEY = "pal:server:players";
const SERVER_VERSION_KEY = "pal:server:version";

const KEY_EXPIRE_TIME_SECONDS = process.env.REDIS_EXPIRE_TIME_SECONDS || 15;

export const getPlayersFromRedis = () => {
    return kv.json.get(PLAYER_LIST_KEY);
}

export const setPlayersToRedis = (players: PalworldPlayer[]) => {
    kv.json.set(PLAYER_LIST_KEY, "$", players).then(() => kv.expire(PLAYER_LIST_KEY, KEY_EXPIRE_TIME_SECONDS));
}
  
export const getServerVersionFromRedis = () => {
    return kv.get(SERVER_VERSION_KEY);
}

export const setServerVersionToRedis = (version: string) => {
    kv.set(SERVER_VERSION_KEY, version).then(() => kv.expire(SERVER_VERSION_KEY, KEY_EXPIRE_TIME_SECONDS)); 
}