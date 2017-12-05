export interface TournamentData {
    name: string;
    start: number;
    end: number;
    information: string;
    isTeam: boolean;
}

export interface Tournament extends TournamentData {
    key: string;
}

export interface ZoneData {
    name: string;
    leader?: string;
    needHelp?: boolean;
    zoneLeaderPlace?: string;
    tables?: {
        start: number,
        end: number
    }[]
}

export interface Zone extends ZoneData {
    key: string;
}

export interface Message {
    login: string;
    message: string;
    timestamp: number;
}