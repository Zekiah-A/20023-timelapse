import {View2D, Rect, Txt} from "@motion-canvas/2d"
import {useRandom, createRef, Vector2, all, linear, tween, waitFor} from "@motion-canvas/core"
import {easeInOutQuad, easeOutExpo, map} from "@motion-canvas/core/lib/tweening";

import {WhiteLabel} from "./styles"
import {Stop, Top} from "../private/stats"
import {formatTimeShort, lerpHex} from "./utils"

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

interface ListValueRenderer {
    (
        view: View2D,
        topRange: number,
        topItem: Top,
        topCount: number,
        i: number,
        lineX: number,
        lineY: number
    ): Generator
}

export const listChartBarChart: ListValueRenderer = function* (view: View2D, topRange: number, topItem: Top, topCount: number, i: number, lineX: number, lineY: number): Generator<any, void, any> {
    const colour = lerpHex(lerpHex("#FFD700", "#C0C0C0", Math.min(i / (topCount / 2), 1)),
    "#cd7f32", Math.max((i - (topCount / 2)) / topCount, 0) * 2)
    const stops = [{id:"", title: "%c", label: "", value: topItem.total, colour: colour}]
    const width = 400 * (topItem.total / topRange)
    yield* barChart(view, topItem.total, stops, lineX + 360, lineY, width, 50, 50, 3, true)
}

export const listChartTimeS: ListValueRenderer = function* (view: View2D, topRange: number, topItem: Top, topCount: number, i: number, lineX: number, lineY: number): Generator<any, void, any> {
    const valueRef = createRef<Txt>()
    view.add(<Txt ref={valueRef} x={lineX + 540} y={lineY} fill={WhiteLabel.fill}>0</Txt>)
    yield* tween(3, value => {
        const timeSecs = Math.floor(map(0, topItem.total, easeOutExpo(value)))
        valueRef().text(formatTimeShort(timeSecs))
    })
}

export function* listChart(view:View2D, topRange: number, top:Top[], columnWidth:number, statsX:number, statsY:number, statsHeight:number, valueRenderer: ListValueRenderer = listChartBarChart) {
    const rowsMax = 10
    for (let i = 0; i < top.length; i++) {
        const lineY = (i % rowsMax) / top.length * statsHeight + statsY
        const lineX = Math.floor(i / rowsMax) * columnWidth + statsX
        const userRef = createRef<Txt>()
        view.add(<Txt ref={userRef} fill={WhiteLabel.fill} x={0} y={0} opacity={0} offsetX={-1}>{top[i].title || "#" + top[i].id}</Txt>)
        const moveT = 0.5
        yield* all(
            userRef().x(lineX, moveT),
            userRef().y(lineY, moveT),
            userRef().opacity(1, moveT)
        )
        yield valueRenderer(view, topRange, top[i], top.length, i, lineX, lineY)
    }
    yield* waitFor(3) // ValueRenderers should be 3s staggered
}

