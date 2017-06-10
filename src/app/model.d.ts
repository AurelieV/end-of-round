export type TableStatus = "playing" | "covered" | "featured" | "done" | "";

export interface Table {
    status: TableStatus;
    time: number;
    doneTime?: Date;
    hasResult?: boolean;
}

export interface Zone {
    start: number;
    end: number;
    leader: string;
    needHelp?: boolean;
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