import { View2D, Rect, Txt } from "@motion-canvas/2d"
import { useRandom, createRef, Vector2, all, linear, tween } from "@motion-canvas/core"
import { WhiteLabel } from "./styles"
import { Stop, Top } from "../private/stats"
import { lerpHex } from "./utils"

export function* barChart(view:View2D, total:number, stops:Stop[], left=0, top=0, maxWidth=-1, maxHeight=100, minHeight=-1, animTime=5, titleCount=false) {
    maxWidth = maxWidth === -1 ? 1920 - left : maxWidth
    minHeight = minHeight === -1 ? maxHeight : minHeight
    
    const random = useRandom()

    let lastLeft = left
    let lastHeight = maxHeight // last starting height
    let completed = 0
    for (let i = 0; i < stops.length; i++) {
        const proportion = stops[i].value / total
        const endWidth = proportion * maxWidth 
        const durationW = proportion * animTime
        const colour = stops[i].colour || "#" + random.nextInt().toString(16)
        const radius:[number,number,number,number] = [0, 0, 0, 0]
        if (i == 0) {
            radius[0] = 16
            radius[3] = 16
        }
        if (i == stops.length - 1) {
            radius[1] = 16
            radius[2] = 16
        }
        const fontSize = Math.min(endWidth / stops[i].title.length, 48)
        const labelOffset = 36

        const barRef = createRef<Rect>()
        const labelRef = createRef<Txt>()
        const titleRef = createRef<Txt>()
        view.add(<Rect ref={barRef} fill={colour} radius={radius} offsetX={-1} height={lastHeight} width={0} left={new Vector2(lastLeft, top)}>
            <Txt ref={titleRef} shadowBlur={titleCount ? 0 : 10} shadowColor={"black"}>{stops[i].title}</Txt>
            <Txt ref={labelRef} fontSize={fontSize} fill={WhiteLabel.fill} y={lastHeight / 2 + labelOffset}>{stops[i].label}</Txt>
        </Rect>)

        const durationH = (1 - completed) * animTime
        yield all (
            barRef().height(minHeight, durationH, linear),
            labelRef().y(minHeight / 2 + labelOffset, durationH, linear),
        )
        yield* all(
            barRef().width(endWidth, durationW, linear),
            titleCount ?
                tween(durationW, value => {
                    titleRef().text(stops[i].title.replace("%c", Math.floor(value * stops[i].value).toString()))
                }) : tween(durationW, value => {
                    const text = `${stops[i].label ? `${stops[i].label}: ` : ""}${Math.floor(value * stops[i].value)}`
                    labelRef().text(text)
                })
        )
        lastLeft += endWidth
        completed += proportion
        lastHeight = barRef().height()
    }
}

export function* listChart(view:View2D, topRange: number, top:Top[], columnWidth:number, statsX:number, statsY:number, statsHeight:number) {
    const rowsMax = 10
    for (let i = 0; i < top.length; i++) {
        const chatter = top[i]
        const lineY = (i % rowsMax) / top.length * statsHeight + statsY
        const lineX = Math.floor(i / rowsMax) * columnWidth + statsX
        const userRef = createRef<Txt>()
        view.add(<Txt ref={userRef} fill={WhiteLabel.fill} x={0} y={0} opacity={0} offsetX={-1}>{chatter.title || "#" + chatter.id}</Txt>)
        const moveT = 0.5
        yield* all(
            userRef().x(lineX, moveT),
            userRef().y(lineY, moveT),
            userRef().opacity(1, moveT)
        )
    
        const colour = lerpHex(lerpHex("#FFD700", "#C0C0C0", Math.min(i / (top.length / 2), 1)),
            "#cd7f32", Math.max((i - (top.length / 2)) / top.length, 0) * 2)
        const stops = [{id:"", title: "%c", label: "", value: chatter.total, colour: colour}]
        const width = 400 * (chatter.total / topRange)
        yield all(
            barChart(view, chatter.total, stops, lineX + 360, lineY, width, 50, 50, 3, true)
        )
    }
}

