import {makeScene2D, Txt, Rect, Layout} from '@motion-canvas/2d';
import {createRef, waitFor, all, slideTransition, Direction, tween} from '@motion-canvas/core';
import {easeInOutExpo, easeInOutSine, map} from "@motion-canvas/core/lib/tweening";

import {stats} from '../project'
import {WhiteLabel} from '../styles';
import {listChart, listChartTimeS} from '../controls';
import {formatTime} from '../utils';

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
            <Rect ref={sel2Ref} fill={"#336699"} width={0} height={50} y={76} x={-266} offsetX={-1} opacity={0} radius={10}></Rect>
            <Txt fill={WhiteLabel.fill} x={0} y={80} fontWeight={100}>players were actively online for a collective total of:</Txt>
        </Layout>)
    
    const fadeInT = 1.5
    const selFadeT = 0.5
    yield* all(
        playedForRef().opacity(1, fadeInT),
        sel1Ref().width(0, 1).to(385, selFadeT),
        sel1Ref().opacity(0, 1).to(0.4, selFadeT),
        playedForRef().y(-300, fadeInT),
        sel2Ref().width(0, 2).to(315, selFadeT),
        sel2Ref().opacity(0, 2).to(0.4, selFadeT),
    )
    const timeTotalRef = createRef<Txt>()
    view.add(<Txt ref={timeTotalRef} fill={WhiteLabel.fill} x={0} y={0} opacity={0} fontWeight={100}></Txt>)
    yield* all(
        timeTotalRef().opacity(1, 2),
        timeTotalRef().fontWeight(800, 14, easeInOutSine),
        timeTotalRef().fontSize(90, 14, easeInOutSine),
        tween(12, value => {
            const timeSecs = Math.floor(map(0, stats.time.totalSeconds, easeInOutExpo(value)))
            timeTotalRef().text(formatTime(timeSecs))
        })
    )
    yield* waitFor(1)
    const transitionT = 1
    yield* all(
        playedForRef().y(-400, transitionT),
        playedForRef().opacity(0.4, transitionT),
        playedForRef().scale(0.6, transitionT),
        timeTotalRef().opacity(0.4, transitionT),
        timeTotalRef().scale(0.2, transitionT),
        timeTotalRef().y(-300, transitionT),
        timeTotalRef().fontWeight(400, 0.6),
    )

    const userRef = createRef<Txt>()
    view.add(<Txt ref={userRef} fill={WhiteLabel.fill} x={0} y={0} offsetX={-1}>Most active players:</Txt>)
    const liveChatT = 1
    yield* all(
        userRef().opacity(0, 0).to(1, liveChatT),
        userRef().x(-900, liveChatT),
        userRef().y(-380, liveChatT),
    )
    
    yield* listChart(view, stats.time.topRange, stats.time.top, 900, -860, -300, 1700, listChartTimeS)
    yield* waitFor(2)
});
