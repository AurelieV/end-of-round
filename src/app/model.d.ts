export type TableStatus = "playing" | "covered" | "featured" | "done" | "";

export interface Table {
    status: TableStatus;
    time: number;
}

export interface Zone {
    start: number;
    end: number;
    leader: string;
}

export interface Tournament {
    information: string;
    zones: { [name: string]: Zone };
    tables: { [id: string]: Table };
    start: number;
    end: number;
}