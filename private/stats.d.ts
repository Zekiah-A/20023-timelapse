export type Stop = {
    id: string|number,
    title: string,
    label: string,
    value: number,
    colour: string
}
export type Top = {
    id: string|number,
    title: string,
    total: number
}
export type Stats = {
    liveChat: {
        total: number,
        stops: Stop[]
    },
    placeChat: {
        total: number,
        stops: Stop[]
    },
    chatters: {
        topTotal: number,
        topRange: number,
        top: Top[],
    },
    time: {
        totalSeconds:number
    }
}