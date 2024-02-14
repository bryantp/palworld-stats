//Client
'use client';
import React, {useState, useEffect} from 'react';
import { PlayerPlayHistory, getPlayersPlayHistory, PlayerPlayHistoryLookback} from '../app/lib/db/palworldserverdb';
import { PlayerTimeframe } from './TimeframeSelection';

const getPrettyTimeColumns = (timeInMinutes: number): String => {
    console.log(`Player Minutes ${timeInMinutes}`);
    if(timeInMinutes < 60) return `${timeInMinutes} Minutes`
    
    if(timeInMinutes < 1440) {
        //Hours and minutes 
        const hours = Math.floor(timeInMinutes / 60);
        const minutes = Math.floor(timeInMinutes % 60);
        return `${hours} Hours, ${minutes} Minutes`
    }

    //Days, Hours, Minutes
    const days =  Math.floor(timeInMinutes / 60 / 24);
    const hours = Math.floor(timeInMinutes / 60);
    const minutes = Math.floor(timeInMinutes % 60);
    return `${days} Days, ${hours} Hours, ${minutes} Minutes`
}

const getServerDataPage = async (timeframe: PlayerPlayHistoryLookback): Promise<React.JSX.Element[]> => {
    if(!timeframe) {
        return new Promise<React.JSX.Element[]>((accept) => accept([]));
    }

    console.log(`Timeframe: ${JSON.stringify(timeframe)}`);

    const data = await getPlayersPlayHistory(getPlayerPlayHistoryLookback(timeframe));

    console.log(data);
  
    const playerData = data?.filter(player => player.timePlayedMinutes >= 1)?.map((player: PlayerPlayHistory) => (
        <tr key={player.userName}>
            <th>{player.userName}</th>
            <th>{getPrettyTimeColumns(player.timePlayedMinutes)}</th>
        </tr>
    ));
  
    return playerData;
}

export const getPlayerPlayHistoryLookback = ({years = 0, months = 0, weeks = 0, days = 0, hours = 0}) => {
    return {
        years,
        months,
        weeks,
        days,
        hours
    }
}

const converTimeframeToPlayerLookback = (timeframe: PlayerTimeframe): PlayerPlayHistoryLookback => {
    if(timeframe.valueOf() === PlayerTimeframe.DAY.valueOf()) {
        return getPlayerPlayHistoryLookback({days: 1});
    }

    if(timeframe.valueOf() === PlayerTimeframe.WEEK.valueOf()) {
        return getPlayerPlayHistoryLookback({weeks: 1});
    }

    if(timeframe.valueOf() === PlayerTimeframe.MONTH.valueOf()) {
        return getPlayerPlayHistoryLookback({months: 1});
    }

    if(timeframe.valueOf() === PlayerTimeframe.MONTH_THREE.valueOf()) {
        return getPlayerPlayHistoryLookback({months: 3});
    }

    throw new Error(`Unknown player timeframe ${timeframe}`);
}

export default function PlayerPlayHistory({timeframe}: {timeframe: PlayerTimeframe}) {
    const [playerData, setPlayerData] = useState<React.JSX.Element[]>([]);

    useEffect(() => {
        getServerDataPage(converTimeframeToPlayerLookback(timeframe))
        .then((data: React.JSX.Element[]) => setPlayerData(data))
        .catch(error => console.error(`Error getting player data ${error}`));
    }, [timeframe]);

    return (
        <table className="table table-primary">
            <thead>
                <tr>
                    <th scope="col">Player Name</th>
                    <th scope="col">Player Play Time</th>
                </tr>
            </thead>
            <tbody>
               {playerData}
            </tbody>
        </table>

    )
}