import {makeScene2D, Txt} from '@motion-canvas/2d';
import {createRef, waitFor, all, slideTransition, Direction, tween} from '@motion-canvas/core';

import {stats} from '../project'
import {WhiteLabel} from '../styles';
import { barChart } from '../controls';

export default makeScene2D(function* (view) {
    const titleRef = createRef<Txt>()
    view.add(<Txt ref={titleRef} fill={WhiteLabel.fill}>Server statistics (as of October 29, 2023)</Txt>)
    yield* slideTransition(Direction.Left)
    yield* titleRef().y(0, 0.5).to(-480, 0.5)
    
    // live
    const liveChatRef = createRef<Txt>()
    view.add(<Txt ref={liveChatRef} fill={WhiteLabel.fill} x={0} y={0} zIndex={1} offsetX={-1}>Live chat messages: 0</Txt>)
    const liveChatT = 1
    const liveChatBarT = 4
    yield* all(
        liveChatRef().opacity(0, 0).to(1, liveChatT),
        liveChatRef().x(-900, liveChatT),
        liveChatRef().y(-380, liveChatT),
    )
    yield* all(
        barChart(view, stats.liveChat.total, stats.liveChat.stops, -880, -240, 1780, 300, 100, liveChatBarT),
        tween(liveChatBarT, progress => {
            liveChatRef().text(`Live chat messages: ${Math.floor(progress * stats.liveChat.total)}`)
        }),
    )
    // canv
    const canvasChatRef = createRef<Txt>()
    view.add(<Txt ref={canvasChatRef} fill={WhiteLabel.fill} x={0} y={0} offsetX={-1} zIndex={1} opacity={0}>Canvas chat messages: 0</Txt>)
    yield* all(
        canvasChatRef().x(-900, liveChatT),
        canvasChatRef().opacity(1, liveChatT)
    )
    yield* all(
        barChart(view, stats.placeChat.total, stats.placeChat.stops, -880, 140, 1780, 300, 100, liveChatBarT),
        tween(liveChatBarT, progress => {
            canvasChatRef().text(`Canvas chat messages: ${Math.floor(progress * stats.placeChat.total)}`)
        }),
    )

    yield* waitFor(1)
});
