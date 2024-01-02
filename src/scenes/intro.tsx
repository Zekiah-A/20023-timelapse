import {makeScene2D, Img, Txt, Rect, Layout} from '@motion-canvas/2d';
import {createRef, waitFor, all} from '@motion-canvas/core';
import {CodeBlock, remove} from '@motion-canvas/2d/lib/components/CodeBlock';

import rplacePng from "../../assets/rplace.png";
import { WhiteLabel } from '../styles';

export default makeScene2D(function* (view) {
    const rplaceRef = createRef<Img>()
    const txtRef = createRef<CodeBlock>() 
    
    const rootDescRef = createRef<Layout>()
    const desc1Ref = createRef<Rect>()
    const desc2Ref = createRef<Txt>()
    const desc2SelRef = createRef<Rect>()
    const desc3Ref = createRef<Txt>()
    const desc3SelRef = createRef<Rect>()
    const desc4Ref = createRef<Txt>()
    const desc4SelRef = createRef<Rect>()
    const desc5Ref = createRef<Txt>()
    view.add(<Layout>
        <Layout ref={rootDescRef}>
            <Rect ref={desc1Ref} opacity={0}>
                <Txt fill={WhiteLabel.fill} y={-300}>
                    On the 6th april 2022, we started a project to create a massive,
                </Txt>
                <Txt fill={WhiteLabel.fill} y={-200}>
                    community-run multiplayer canvas, based off of reddit's r/place
                </Txt>
            </Rect>
            <Rect ref={desc2SelRef} fill={"#FF5700"} width={0} height={50} y={-5} x={38} opacity={0} radius={10}></Rect>
            <Txt ref={desc2Ref} fill={WhiteLabel.fill} opacity={0}>
                It has now been almost two years... with hundreds of millions of pixels placed
            </Txt>
            <Rect ref={desc3SelRef} fill={"#336699"} width={0} height={50} y={96} x={-336} opacity={0} radius={10}></Rect>
            <Txt ref={desc3Ref} fill={WhiteLabel.fill} y={100} opacity={0}>
                millions of chat messages sent
            </Txt>
            <Rect ref={desc4SelRef} fill={"#EFF7FF"} width={0} height={50} y={196} x={-456} opacity={0} radius={10}></Rect>
            <Txt ref={desc4Ref} fill={WhiteLabel.fill} y={200} opacity={0}>
                and thousands of players, who have visited the site 
            </Txt>
            <Txt ref={desc5Ref} fill={WhiteLabel.fill} y={300} opacity={0}>
                to experience the thrill of r/place once again..
            </Txt>
        </Layout>
        <Layout>
            <CodeBlock ref={txtRef} fill={"white"} {...WhiteLabel} y={50} scale={0.6} opacity={0} language="cs" code={"rplace.live official 2023 timelapse"}/>
            <Img ref={rplaceRef} src={rplacePng} scale={8} rotation={90} />
        </Layout>
    </Layout>)
    
    const shrinkT = 1
    yield* all(
        rplaceRef().scale(8, shrinkT).to(0.1, shrinkT),
        rplaceRef().absoluteRotation(90, shrinkT).to(0, shrinkT),
    )

    const textT = 0.5
    yield* all(
        txtRef().opacity(1, textT),
        txtRef().y(100, textT),
        txtRef().scale(1.2, textT),
    )

    const moveT = 1.2
    yield all(
        txtRef().edit(moveT)`rplace.live${remove(" official 2023 timelapse")}`,
        rplaceRef().position.x(0, moveT).to(860, moveT),
        rplaceRef().position.y(0, moveT).to(-440, moveT),

        txtRef().position.x(0, moveT).to(860, moveT),
        txtRef().position.y(100, moveT).to(-340, moveT),
        txtRef().scale(1.2, moveT).to(0.8, moveT)
    )
    yield* waitFor(moveT / 2)
 
    const fade1T = 2.2
    const fade2T = 1.2
    yield* desc1Ref().opacity(1, fade1T)
    // desc2
    yield desc2Ref().opacity(1, fade1T)
    yield* waitFor(fade1T * 0.55)
    yield all(
        desc2SelRef().width(440, 0.4),
        desc2SelRef().x(260, 0.4),
        desc2SelRef().opacity(0.2, 0.4)
    )
    yield* waitFor(fade1T * 0.35)
    // desc3
    yield desc3Ref().opacity(1, fade1T)
    yield* waitFor(fade1T * 0.25)
    yield all(
        desc3SelRef().width(176, 0.4),
        desc3SelRef().x(-250, 0.4),
        desc3SelRef().opacity(0.2, 0.4)
    )
    yield* waitFor(fade1T * 0.75)
    // desc4
    yield desc4Ref().opacity(1, fade2T)
    yield* waitFor(fade2T * 0.4)
    yield all(
        desc4SelRef().width(234, 0.4),
        desc4SelRef().x(-336, 0.4),
        desc4SelRef().opacity(0.2, 0.4)
    )
    yield* waitFor(fade2T * 0.6)
    yield* desc5Ref().opacity(1, fade1T)

    yield* waitFor(0.5)
    yield* rootDescRef().opacity(0, 2)

    const tlLblRef = createRef<Rect>()
    view.add(<Rect ref={tlLblRef} opacity={0}>
        <Txt fill={WhiteLabel.fill} y={-50}>So here's a full timelapse of Canvas 1</Txt>
        <Txt fill={WhiteLabel.fill} y={50}>From the start of 2022, to the end of 2023</Txt>
    </Rect>)

    yield* tlLblRef().opacity(1, 1)
    yield* tlLblRef().opacity(0, 2)
});
