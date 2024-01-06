import {makeScene2D, Img, Txt, Rect, Layout} from '@motion-canvas/2d';
import {createRef, waitFor, all, zoomOutTransition, BBox} from '@motion-canvas/core';
import {CodeBlock, edit, remove, insert} from '@motion-canvas/2d/lib/components/CodeBlock';

import rplacePng from "../../assets/rplace.png";
import { WhiteLabel } from '../styles';

export default makeScene2D(function* (view) {
    const sceneLayoutRef = createRef<Layout>()
    const txtRef = createRef<CodeBlock>() 
    const thankRef = createRef<Txt>()
    const nameRef = createRef<Txt>()
    view.add(<Layout ref={sceneLayoutRef}>
        <CodeBlock ref={txtRef} fill={WhiteLabel.fill}>In 2023, together</CodeBlock>
        <Txt ref={thankRef} fill={WhiteLabel.fill} y={100} opacity={0}>Thank you for being part of rplace.live</Txt>
        <Txt ref={nameRef} fill={WhiteLabel.fill} y={160} fontSize={20} opacity={0}>- Zekiah-A, BlobKat and the rplace.live staff tem</Txt>
    </Layout>)

    yield* zoomOutTransition(new BBox(-960, -540, 1920, 1080), 1)
    
    const messages = ["the discord community reached 13,000 members", "thousands of messages were sent in chat",
        "more pixels were placed than ever before", "you created art on a canvas..."]
    for (let i = 0; i < messages.length; i++) {
        const last = i == 0 ? "" : messages[i - 1]
        if (i == messages.length - 1) {
            yield txtRef().scale(1.1, 0.5)
        }
        yield* txtRef().edit(2.2)`In 2023, together ${edit(last, messages[i])}`
    }
    yield* waitFor(0.5)
    yield* thankRef().opacity(1, 0.5)
    yield* nameRef().opacity(1, 0.5)
    yield* waitFor(2)
    yield* sceneLayoutRef().opacity(0, 1)

    const rplaceRef = createRef<Img>()
    view.add(<Img ref={rplaceRef} src={rplacePng} scale={0.1} rotation={0} opacity={0} />)

    const growT = 1
    yield* all(
        rplaceRef().opacity(1, 0.2),
        rplaceRef().scale(8.1, growT),
        rplaceRef().absoluteRotation(90, growT),
    )

    const linksRef = createRef<Layout>()
    view.add(<Layout ref={linksRef} opacity={0}>
        <Txt fill={"#ADD8E6"} y={-150}>rplace.live</Txt>
        <Txt fill={"#ADD8E6"} y={-50}>twitter.com/rplacetk</Txt>
        <Txt fill={"#ADD8E6"} y={50}>reddit.com/rplacetk</Txt>
        <Txt fill={"#ADD8E6"} y={150}>telegram.org/rplacelive</Txt>
    </Layout>)
    yield* linksRef().opacity(1, 0.5)
    yield* waitFor(3)
});
