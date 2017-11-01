export interface TournamentData {
    name: string;
    start: number;
    end: number;
    information: string;
}

export interface Tournament extends TournamentData {
    key: string;
}

export interface ZoneData {
    name: string;
    start: number;
    end: number;
    leader: string;
    needHelp: boolean;
    zoneLeaderPlace?: string;
}

export interface Zone extends ZoneData {
    key: string;
}

export interface Message {
    login: string;
    message: string;
    timestamp: number;
}