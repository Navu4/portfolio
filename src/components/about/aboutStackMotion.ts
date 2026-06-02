import { useTransform, type MotionValue } from "framer-motion";

export const INTRO_END = 0.2;
export const STACK_END = 0.78;

export type SkillSection = {
    i: number;
    heading: string;
    imgUrls: string[];
    desc: string;
};

const STACK_ENTER_SHARE = 0.68;
const ENTER_SLOT_RATIO = 0.92;
const STACK_HOLD_SHARE = 0.05;
const STACK_SETTLE_SHARE = 0.27;

const TRIANGLE_SIDE_ANCHORS = [
    { x: 0.07, y: 0.44 },
    { x: 0.93, y: 0.44 },
    { x: 0.5, y: 0.97 },
] as const;

const MOBILE_TRIANGLE_SIDE_ANCHORS = [
    { x: 0.11, y: 0.42 },
    { x: 0.89, y: 0.42 },
    { x: 0.5, y: 0.94 },
] as const;

const SETTLE_OUTWARD_PUSH = 1.08;
const SETTLE_SCALE_DESKTOP = 0.84;
const SETTLE_SCALE_MOBILE = 0.78;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

const easeInOutCubic = (t: number) =>
    t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;

const segmentT = (p: number, start: number, end: number) => {
    if (end <= start) return p >= start ? 1 : 0;
    return easeInOutCubic(clamp01((p - start) / (end - start)));
};

export type StackPhases = {
    perCard: number;
    enterStart: number;
    enterEnd: number;
    settleStart: number;
    settleEnd: number;
    cardSettleStart: number;
    cardSettleEnd: number;
};

export const getStackPhases = (index: number, total: number): StackPhases => {
    const perCard = STACK_ENTER_SHARE / Math.max(total, 1);
    const enterStart = index * perCard;
    const enterEnd = enterStart + perCard * ENTER_SLOT_RATIO;

    const lastEnterEnd =
        (total - 1) * perCard + perCard * ENTER_SLOT_RATIO;
    const settleStart = lastEnterEnd + STACK_HOLD_SHARE;
    const settleEnd = Math.min(1, settleStart + STACK_SETTLE_SHARE);

    const stagger = (STACK_SETTLE_SHARE / Math.max(total, 1)) * 0.35;
    const cardSettleStart = settleStart + index * stagger;
    const cardSettleEnd = settleEnd;

    return {
        perCard,
        enterStart,
        enterEnd,
        settleStart,
        settleEnd,
        cardSettleStart,
        cardSettleEnd,
    };
};

export const getTriangleSideAnchor = (
    index: number,
    total: number,
    isMobile: boolean
): { x: number; y: number } => {
    const sides = isMobile ? MOBILE_TRIANGLE_SIDE_ANCHORS : TRIANGLE_SIDE_ANCHORS;

    if (total <= sides.length) {
        return sides[index] ?? sides[0];
    }

    const sideIndex = index % sides.length;
    const slotOnSide = Math.floor(index / sides.length);
    const offset = slotOnSide * 0.06;

    const anchor = sides[sideIndex];
    if (sideIndex === 0) return { x: anchor.x - offset, y: anchor.y + offset * 0.5 };
    if (sideIndex === 1) return { x: anchor.x + offset, y: anchor.y + offset * 0.5 };
    return { x: anchor.x, y: Math.min(0.96, anchor.y + offset) };
};

export const anchorToOffset = (
    anchor: { x: number; y: number },
    stageWidth: number,
    stageHeight: number,
    push = SETTLE_OUTWARD_PUSH
) => ({
    x: (anchor.x * stageWidth - stageWidth / 2) * push,
    y: (anchor.y * stageHeight - stageHeight / 2) * push,
});

export const useStackCardMotion = (
    progress: MotionValue<number>,
    index: number,
    total: number,
    isMobile: boolean,
    stageWidth: number,
    stageHeight: number
) => {
    const phases = getStackPhases(index, total);
    const {
        perCard,
        enterStart,
        enterEnd,
        settleStart,
        cardSettleStart,
        cardSettleEnd,
    } = phases;

    const stackY = index * 18;
    const stackScale = 1 - index * 0.028;
    const stackCenterY = stageHeight * -0.09;
    const enterFromY = stageHeight * 0.55;

    const anchor = getTriangleSideAnchor(index, total, isMobile);
    const { x: finalX, y: finalY } = anchorToOffset(
        anchor,
        stageWidth,
        stageHeight
    );
    const settleScale = isMobile ? SETTLE_SCALE_MOBILE : SETTLE_SCALE_DESKTOP;

    const x = useTransform(progress, (p) => {
        if (p < enterEnd) return 0;
        if (p < settleStart) return 0;
        const t = segmentT(p, cardSettleStart, cardSettleEnd);
        return finalX * t;
    });

    const y = useTransform(progress, (p) => {
        const stacked = stackCenterY + stackY;
        if (p <= 0 || p < enterStart) return enterFromY;
        if (p < enterEnd) {
            const t = easeOutCubic(clamp01((p - enterStart) / (enterEnd - enterStart)));
            return enterFromY + (stacked - enterFromY) * t;
        }
        if (p < settleStart) return stacked;
        const t = segmentT(p, cardSettleStart, cardSettleEnd);
        return stacked + (finalY - stacked) * t;
    });

    const scale = useTransform(progress, (p) => {
        if (p <= 0 || p < enterStart) return 1;
        if (p < enterEnd) {
            const t = easeOutCubic(clamp01((p - enterStart) / (enterEnd - enterStart)));
            return 1 + (stackScale - 1) * t;
        }
        if (p < settleStart) return stackScale;
        const t = segmentT(p, cardSettleStart, cardSettleEnd);
        return stackScale + (settleScale - stackScale) * t;
    });

    const opacity = useTransform(progress, (p) => {
        if (p <= 0 || p < enterStart) return 0;
        if (p < enterStart + perCard * 0.12) {
            return easeOutCubic(clamp01((p - enterStart) / (perCard * 0.12)));
        }
        return 1;
    });

    return { x, y, scale, opacity, zIndex: index + 10 };
};
