export interface TournamentData {
  name: string
  start: number
  end: number
  information: string
  isTeam: boolean
}

export interface Tournament extends TournamentData {
  key: string
  clockEnd?: number
}

export interface Section {
  start: number
  end: number
}
export interface ZoneData {
  name: string
  leader?: string
  zoneLeaderPlace?: string
  tables?: Section[]
}

export interface Zone extends ZoneData {
  key: string
}

export interface Message {
  login: string
  message: string
  timestamp: number
  uid: string
}
