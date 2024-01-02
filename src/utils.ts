export function lerpHex(color1: string, color2: string, factor: number): string {
    const rgb1 = hexToRgb(color1)
    const rgb2 = hexToRgb(color2)
    const rgbResult: [number, number, number] = rgb1.map((channel1, index) =>
        Math.round(channel1 + factor * (rgb2[index] - channel1))
    ) as [number, number, number]
    return rgbToHex(...rgbResult)
}

export function hexToRgb(hex: string): [number, number, number] {
    const bigint = parseInt(hex.slice(1), 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return [r, g, b]
}

export function rgbToHex(r: number, g: number, b: number): string {
    return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`
}

export function formatTime(timeS:number) {
    const days = Math.floor(timeS / 86400)
    const hours = Math.floor((timeS % 86400) / 3600)
    const minutes = Math.floor((timeS % 3600) / 60)
    const seconds = timeS % 60
    return (
        (timeS > 86400 ? `${days} ${days === 1 ? "day" : "days"}, ` : "") +
        (timeS > 3600 ? `${hours.toString().padStart(2, "0")} ${hours === 1 ? "hour" : "hours"}, ` : "") +
        (timeS > 60 ? `${minutes.toString().padStart(2, "0")} ${minutes === 1 ? "minute" : "minutes"}, ` : "") +
        (`${seconds.toString().padStart(2, "0")} ${seconds === 1 ? "second" : "seconds"}`)
    )
}

export function formatTimeShort(timeS:number) {
    const days = Math.floor(timeS / 86400)
    const hours = Math.floor((timeS % 86400) / 3600)
    const minutes = Math.floor((timeS % 3600) / 60)
    const seconds = timeS % 60
    return (
        (timeS > 86400 ? `${days}d ` : "") +
        (timeS > 3600 ? `${hours.toString().padStart(2, "0")}h ` : "") +
        (timeS > 60 ? `${minutes.toString().padStart(2, "0")}m ` : "") +
        (`${seconds.toString().padStart(2, "0")}s`)
    )
}
