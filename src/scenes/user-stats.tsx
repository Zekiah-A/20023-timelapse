import {makeScene2D, Img, Txt, Rect, Layout, View2D} from '@motion-canvas/2d';
import {createRef, waitFor, all, Vector2, slideTransition, Direction, useRandom, tween, debug} from '@motion-canvas/core';
import {easeInOutExpo, easeOutCubic, easeOutExpo, linear, map} from "@motion-canvas/core/lib/tweening";

import {stats} from '../project'
import {WhiteLabel} from '../styles';
import {barChart, listChart} from '../controls';
import {lerpHex} from '../utils';

function formatTime(timeS:number) {
    const days = Math.floor(timeS / 86400)
    const hours = Math.floor((timeS % 86400) / 3600)
    const minutes = Math.floor((timeS % 3600) / 60)
    const seconds = timeS % 60
    return (
        (timeS > 86400 ? `${days} ${days === 1 ? 'day' : 'days'}, ` : '') +
        (timeS > 3600 ? `${hours.toString().padStart(2, "0")} ${hours === 1 ? 'hour' : 'hours'}, ` : '') +
        (timeS > 60 ? `${minutes.toString().padStart(2, "0")} ${minutes === 1 ? 'minute' : 'minutes'}, ` : '') +
        (`${seconds.toString().padStart(2, "0")} ${seconds === 1 ? 'second' : 'seconds'}`)
    )
}

export default makeScene2D(function* (view) {
    const titleRef = createRef<Txt>()
    view.add(<Txt ref={titleRef} fill={WhiteLabel.fill} y={-480}>User statistics (as of October 29, 2023)</Txt>)
    yield* slideTransition(Direction.Left)

    const playedForRef = createRef<Txt>()
    const sel1Ref = createRef<Rect>()
    const sel2Ref = createRef<Rect>()
    view.add(<Layout ref={playedForRef} y={-180} opacity={0}>
            <Rect ref={sel1Ref} fill={"#FF5700"} width={0} height={50} y={-2} x={-198} offsetX={-1} opacity={0} radius={10}></Rect>
            <Txt fill={WhiteLabel.fill} x={0} fontWeight={100}>Within the last three months of the site,</Txt>
            <Rect ref={sel2Ref} fill={"#336699"} width={0} height={50} y={76} x={-160} offsetX={-1} opacity={0} radius={10}></Rect>
            <Txt fill={WhiteLabel.fill} x={0} y={80} fontWeight={100}>players were actively online for a total of:</Txt>
        </Layout>)
    
    const fadeInT = 1.5
    const selFadeT = 0.5
    yield* all(
        playedForRef().opacity(1, fadeInT),
        sel1Ref().width(0, 1).to(385, selFadeT),
        sel1Ref().opacity(0, 1).to(0.4, selFadeT),
        playedForRef().y(-300, fadeInT),
        sel2Ref().width(0, 2).to(320, selFadeT),
        sel2Ref().opacity(0, 2).to(0.4, selFadeT),
    )
    const timeTotalRef = createRef<Txt>()
    view.add(<Txt ref={timeTotalRef} fill={WhiteLabel.fill} x={0} y={0} opacity={0} fontWeight={100}></Txt>)
    yield* all(
        timeTotalRef().opacity(1, 2),
        timeTotalRef().fontWeight(1600, 14, easeInOutExpo),
        timeTotalRef().fontSize(90, 14, easeInOutExpo),
        tween(12, value => {
            const timeSecs = Math.floor(map(0, stats.time.totalSeconds, easeInOutExpo(value)))
            timeTotalRef().text(formatTime(timeSecs))
        })
    )

    // stats.time.totalSeconds
    yield* waitFor(2)
    const userRef = createRef<Txt>()
    view.add(<Txt ref={userRef} fill={WhiteLabel.fill} x={0} y={0} offsetX={-1}>Most active players:</Txt>)
    const liveChatT = 1
    yield* all(
        userRef().opacity(0, 0).to(1, liveChatT),
        userRef().x(-900, liveChatT),
        userRef().y(-380, liveChatT),
    )

    //yield* listChart(view, )
});
