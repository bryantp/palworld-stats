import {PalworldPlayer} from './data';

const parseServerStringToPlayers = (playerServerResponse: string) : PalworldPlayer[] => {
    if(!playerServerResponse) return [];

    const lines = playerServerResponse.split(/\r?\n/);

    const players = lines.map(line => {
        const playerDetails = line.split(',');
        if(!playerDetails || playerDetails.length < 2) {
        return {
            username: '',
            playerUid: ''
        }
        }

        return {
            username: playerDetails[0],
            playerUid: playerDetails[1]
        }
    });


    if(players.length <= 1) {
        return [];
    }

    return players.splice(1);
};

const parseVersionStringFromServer = (versionString: string) => {
    if(!versionString) return versionString;

    const start = versionString.indexOf('[');
    const end = versionString.indexOf(']');

    if(start < 0 || end < 0) return 'N/A';

    return versionString.substring(start + 1, end);
}

export {parseServerStringToPlayers, parseVersionStringFromServer}