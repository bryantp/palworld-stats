"use server"

import {getPlayersFromRedis, getServerVersionFromRedis} from './redis/palworldredis'
import {getPlayers, getVersion} from './rcon/palworldrcon';

export type PalworldPlayer = {
    username: string;
    playerUid: string;
}

export type PalworldServerData = {
    players: PalworldPlayer[];
    version: string;
}

const getRedisData = async (): Promise<[PalworldPlayer[], string]> => {
  try {
    const [players, version] = await Promise.all([getPlayersFromRedis(), getServerVersionFromRedis()]);
    return [players, version];
  } catch(err) {
    console.error(`Unable to get redis data ${err}`);
    return [[], ''];
  }
}

const getServerData = async (): Promise<PalworldServerData> => {
  const [players, version] = await getRedisData();


  if(!players || !version) {
    const [rconPlayers, rconVersion] = await Promise.all([getPlayers(), getVersion()]);
    return {
      players: rconPlayers,
      version: rconVersion
    }
  }


  return {
    players: players,
    version: version
  }
};

export default getServerData;