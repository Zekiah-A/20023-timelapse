import {Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, waitFor, all, slideTransition, Direction} from '@motion-canvas/core';

import {stats} from '../project'
import {WhiteLabel} from '../styles';
import {listChart} from '../controls';

export default makeScene2D(function* (view) {
    const titleRef = createRef<Txt>()
    view.add(<Txt ref={titleRef} fill={WhiteLabel.fill}>User statistics (as of October 29, 2023)</Txt>)
    yield* slideTransition(Direction.Left)
    yield* titleRef().y(0, 0.5).to(-480, 0.5)
    
    const userMessagesRef = createRef<Txt>()
    view.add(<Txt ref={userMessagesRef} fill={WhiteLabel.fill} x={0} y={0} offsetX={-1}>Top chatters (canvas, live chat):</Txt>)
    const liveChatT = 1
    yield* all(
        userMessagesRef().opacity(0, 0).to(1, liveChatT),
        userMessagesRef().x(-900, liveChatT),
        userMessagesRef().y(-380, liveChatT),
    )
    
    yield* listChart(view, stats.chatters.topRange, stats.chatters.top, 900, -860, -300, 1600)
    yield* waitFor(2)
});
 