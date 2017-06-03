export type TableStatus = "ok" | "not-finished" | "need-info";

export interface Table {
    status: TableStatus | null;
    time: string | null;
    id: number;
}

export interface Zone {
    start: number;
    end: number;
    name: string;
    id: number;
}

export interface Tournament {
    name: string;
    zones: Zone[];
    tables: Table[];
    start: number;
    end: number;
}