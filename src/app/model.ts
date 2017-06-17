export type TableStatus = "playing" | "covered" | "featured" | "done" | "";

export interface Result {
    player1: {
        score: number;
        drop: boolean;
    },
    player2: {
        score: number;
        drop: boolean;
    },
    draw: number;
}

export interface Table {
    status: TableStatus;
    time: number;
    doneTime?: Date;
    hasResult?: boolean;
    result?: Result;
}

export interface Zone {
    start: number;
    end: number;
    leader: string;
    needHelp?: boolean;
    message: string;
}

export interface Tournament {
    information: string;
    zones: { [name: string]: Zone };
    tables: { [id: string]: Table };
    start: number;
    end: number;
}

export interface TablesInformation {
    playing: number;
    covered: number;
    extraTimed: number;
}