import {setPlayersToRedis, setServerVersionToRedis} from '../redis/palworldredis';
import {getPlayers, getVersion} from '../rcon/palworldrcon';

//TODO: Error handling
const updater = async (interval: number) => {
    "use server"
    setInterval(async () => {
        console.log('Updating from palworld server...');
        const [players, version] = await Promise.all([getPlayers(), getVersion()]);
        console.log('Updating Redis...');
        setPlayersToRedis(players);
        setServerVersionToRedis(version);
    }, interval)
}

export default class UpdaterService {
    init: boolean;
    updaterInterval: number;


    constructor() {
        this.init = false;
        this.updaterInterval = Number(process.env.UPDATE_INTERVAL_MS) || 1500
    }

    start() {
        "use server"
        if(this.init) return;
        console.log("Starting Updater...");
        updater(this.updaterInterval);
        this.init = true;
    }

}