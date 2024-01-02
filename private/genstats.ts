// bun run private/genstats.ts
import { Database } from "bun:sqlite";
import * as url from 'url';
import path from 'path';
import util from "node:util"
import type { Stats, Stop, Top } from "./stats";

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

// Address bug https://github.com/rslashplace2/rslashplace2.github.io/commit/babb65adb307a31377a3522fd95065e5e5fe3ad1
// UPDATE LiveChatMessages SET channel = "es" WHERE channel = "sp"
const liveChatStops = [
    {id: "en", title: "🇬🇧", label: "English", value: 0, colour: "#0033A0"},
    {id: "zh", title: "🇨🇳", label: "中文", value: 0, colour: "#DE2910"},
    {id: "hi", title: "🇮🇳", label: "हिन्दी", value: 0, colour: "#FF9933"},
    {id: "es", title: "🇪🇸", label: "Español", value: 0, colour: "#FFC300"},
    {id: "fr", title: "🇫🇷", label: "Français", value: 0, colour: "#0055A4"},
    {id: "ar", title: "🇸🇦", label: "عربي", value: 0, colour: "#006341"},
    {id: "bn", title: "🇧🇩", label: "বাংলা", value: 0, colour: "#006A4E"},
    {id: "ru", title: "🇷🇺", label: "pусский", value: 0, colour: "#D52B1E"},
    {id: "pt", title: "🇧🇷", label: "Português", value: 0, colour: "#009B3A"},
    {id: "ur", title: "🇵🇰", label: "اردو", value: 0, colour: "#00853F"},
    {id: "de", title: "🇩🇪", label: "Deutsch", value: 0, colour: "#000000"},
    {id: "jp", title: "🇯🇵", label: "日本語", value: 0, colour: "#BC002D"},
    {id: "tr", title: "🇹🇷", label: "Türkçe", value: 0, colour: "#E30A17"},
    {id: "vi", title: "🇻🇳", label: "Tiếng Việt", value: 0, colour: "#DA251D"},
    {id: "ko", title: "🇰🇷", label: "한국인", value: 0, colour: "#003478"},
    {id: "it", title: "🇮🇹", label: "Italiana", value: 0, colour: "#009246"},
    {id: "fa", title: "🇮🇹", label: "فارسی", value: 0, colour: "#E00034"},
    {id: "sr", title: "🇷🇸", label: "Српски", value: 0, colour: "#C8102E"},
    {id: "az", title: "🇦🇿", label: "Azərbaycan", value: 0, colour: "#3F9C35"}
]

// Template that can be pasted into outro
const stats:Stats = {
    liveChat: {
        total: 0,
        stops: []
    },
    placeChat: {
        total: 0,
        stops: []
    },
    chatters: {
        topTotal: 0,
        topRange: 0,
        top: []
    },
    time: {
        totalSeconds: 0
    }
}

function sortStops(stops: Stop[]) {
    stops.sort((a, b) => a.value < b.value ? 1 : a.value > b.value ? -1 : 0)
}

// Live chat
const db = new Database(path.join(__dirname, "/rplace-server.db"))
{
    const count = db.query("SELECT COUNT(message) as value from LiveChatMessages")
    stats.liveChat.total = count.get().value
    for (const stop of liveChatStops) { // HACK: WORKAROUND: "sp" is what is used in official UI, yet 'es' is the navigator channel
        let chanCount = db.query("SELECT COUNT(message) as value FROM LiveChatMessages WHERE channel = ?1")
        stop.value = chanCount.get(stop.id).value
    }
    sortStops(liveChatStops)
    stats.liveChat.stops = []
    for (let stop of liveChatStops) {
        stats.liveChat.stops.push(stop)
    }
}

const placeChatStops = [
    {id: 1698796740000, title:"October", label: "Messages", colour: "#ffc31f", value:0},
    {id: 1701475140000, title:"November", label: "Messages", colour: "#007ba7", value:0},
    {id: 1704067140000, title:"December", label: "Messages", colour: "#687a6d", value:0}
]
// Place chat
{
    const count = db.query("SELECT COUNT(message) as value from PlaceChatMessages")
    stats.placeChat.total = count.get().value
    // https://www.epochconverter.com/
    // Sun, 31 Oct 2023 23:59:00 GMT : 1698796740
    // Sun 31 Nov 2023 23:59:00 GMT : 1701475140
    // Sun, 31 Dec 2023 23:59:00 GMT : 1704067140
    for (let i = 0; i < placeChatStops.length; i++) {
        const current = placeChatStops[i]
        const last = i == 0 ? 0 : placeChatStops[i - 1].id
        const count = db.query("SELECT COUNT(message) as value from PlaceChatMessages WHERE sendDate BETWEEN ?1 AND ?2")
        current.value = count.get(last, current.id).value
    }
    stats.placeChat.stops = []
    for (let stop of placeChatStops) {
        stats.placeChat.stops.push(stop)
    }
}
// Chatters
{
    const topChatSql = `
        SELECT id, title, SUM(messageCount) AS total
        FROM (
            SELECT l.senderIntId AS id, u.chatName as title, COUNT(*) AS messageCount
            FROM LiveChatMessages l
            JOIN Users u ON l.senderIntId = u.intId
            GROUP BY l.senderIntId, u.chatName
        
            UNION ALL
        
            SELECT p.senderIntId AS id, u.chatName as title, COUNT(*) AS messageCount
            FROM PlaceChatMessages p
            JOIN Users u ON p.senderIntId = u.intId
            GROUP BY p.senderIntId, u.chatName
        )
        GROUP BY id, title
        ORDER BY total DESC
        LIMIT 20`
    const topChatQuery = db.query<Top, []>(topChatSql)
    const topChatters = topChatQuery.all()
    const messageCounts = topChatters.map(chatter => chatter.total)

    stats.chatters.topTotal = topChatters.reduce((acc, chatter) => acc + chatter.total, 0)
    stats.chatters.topRange = Math.max(...messageCounts) - Math.min(...messageCounts)
    stats.chatters.top = topChatters
}
// Time played
{
    const timeTotalQuery = db.query("SELECT SUM(playTimeSeconds) as value from Users")
    stats.time.totalSeconds = timeTotalQuery.get().value
}

console.log(JSON.stringify(stats))
