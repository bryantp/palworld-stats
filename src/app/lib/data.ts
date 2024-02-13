"use server"

import {getPlayersFromRedis, getServerVersionFromRedis} from './redis/palworldredis'
import {getPlayers, getVersion} from './rcon/palworldrcon';
import UpdaterService from './async/updater';

export type PalworldPlayer = {
    username: string;
    playerUid: string;
}

export type PalworldServerData = {
    players: PalworldPlayer[];
    version: string;
}

const updater = new UpdaterService();

const getServerData = async (): Promise<PalworldServerData> => {
  updater.start();
  const [players, version] = await Promise.all([getPlayersFromRedis(), getServerVersionFromRedis()]);

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