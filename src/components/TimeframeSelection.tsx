//Client
'use client';
import React, { useState } from "react";
import { useSearchParams } from 'next/navigation'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import PlayerPlayHistory from "./PlayerPlayHistory";

export enum PlayerTimeframe {
    DAY = 'DAY',
    WEEK = 'WEEK',
    MONTH = 'MONTH',
    MONTH_THREE = 'MONTH_THREE'
}

const getPlayerTimeframeFromString = (timeframe: string | null) => timeframe ? PlayerTimeframe[timeframe as keyof typeof PlayerTimeframe] as unknown as PlayerTimeframe : null;

export default function TimeFrameSelection() {
    const searchParams = useSearchParams()
    const searchTimeFrame = getPlayerTimeframeFromString(searchParams.get('timeframe'));
    const defaultTimeFrame = (): PlayerTimeframe => {
        if(searchTimeFrame == null) return PlayerTimeframe.DAY;
        return searchTimeFrame;
    }

    const [timeframe, setTimeframe] = useState<PlayerTimeframe>(defaultTimeFrame());

    const handleSelection = (selection: string | null) => {
        if(selection == null) return;
        const playerTimeFrame = getPlayerTimeframeFromString(selection);
        console.log(`Set Time Frame: ${selection}`);
        if(playerTimeFrame) {
            setTimeframe(playerTimeFrame);
        }
    }

    const getTitle = () => {
        if(timeframe === PlayerTimeframe.DAY) return 'Previous 24 Hours'
        if(timeframe === PlayerTimeframe.WEEK) return 'Previous Week';
        if(timeframe === PlayerTimeframe.MONTH) return 'Previous Month';
        if(timeframe === PlayerTimeframe.MONTH_THREE) return 'Previous 3 Months';
        return 'Please select time frame';
    }

    return (
        <div>
            <DropdownButton className="mb-3" onSelect={handleSelection} id="dropdown-basic-button" title={getTitle()}>
                <Dropdown.Item href={`?timeframe=${PlayerTimeframe.DAY}`} active={timeframe === PlayerTimeframe.DAY} eventKey={PlayerTimeframe.DAY}>Previous 24 Hours</Dropdown.Item>
                <Dropdown.Item href={`?timeframe=${PlayerTimeframe.WEEK}`} active={timeframe === PlayerTimeframe.WEEK}  eventKey={PlayerTimeframe.WEEK}>Previous Week</Dropdown.Item>
                <Dropdown.Item href={`?timeframe=${PlayerTimeframe.MONTH}`} active={timeframe === PlayerTimeframe.MONTH}  eventKey={PlayerTimeframe.MONTH}>Previous Month</Dropdown.Item>
                <Dropdown.Item href={`?timeframe=${PlayerTimeframe.MONTH_THREE}`} active={timeframe === PlayerTimeframe.MONTH_THREE}  eventKey={PlayerTimeframe.MONTH_THREE}>Previous 3 Months</Dropdown.Item>
            </DropdownButton>
            <PlayerPlayHistory timeframe={timeframe}/>
        </div>
    );
}