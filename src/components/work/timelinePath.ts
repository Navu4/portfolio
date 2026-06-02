export const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));

const fmt = (n: number) => Math.round(n * 10) / 10;

/** Straight vertical line on the center rail. */
export const buildTimelinePath = (
    height: number,
    centerX: number
): string => `M ${fmt(centerX)} 0 L ${fmt(centerX)} ${fmt(height)}`;

/** Horizontal branch: center rail → card header at logo/title row. */
export const buildConnectorPaths = (
    wrapRect: DOMRect,
    rows: Element[]
): string[] =>
    rows
        .map((row) => {
            const node = row.querySelector("[data-timeline-node]");
            const meta = row.querySelector("[data-card-anchor]");
            if (!node || !meta) return "";

            const nodeRect = node.getBoundingClientRect();
            const metaRect = meta.getBoundingClientRect();

            const railX = fmt(
                nodeRect.left - wrapRect.left + nodeRect.width / 2
            );
            const y = fmt(
                metaRect.top - wrapRect.top + metaRect.height / 2
            );
            const side = row.getAttribute("data-side");
            const attachX = fmt(
                side === "left"
                    ? metaRect.right - wrapRect.left
                    : metaRect.left - wrapRect.left
            );

            return `M ${railX} ${y} L ${attachX} ${y}`;
        })
        .filter(Boolean);

/** Keep rail dots vertically aligned with each card header. */
export const syncTimelineNodes = (
    rows: Element[],
    nodes: (HTMLElement | null)[]
) => {
    rows.forEach((row, index) => {
        const node = nodes[index];
        const meta = row.querySelector("[data-card-anchor]");
        if (!node || !meta) return;

        const rowRect = row.getBoundingClientRect();
        const metaRect = meta.getBoundingClientRect();
        const centerY = metaRect.top - rowRect.top + metaRect.height / 2;

        node.style.marginTop = `${fmt(centerY - node.offsetHeight / 2)}px`;
    });
};

export const scrollProgressInTimeline = (
    timelineTop: number,
    timelineHeight: number,
    viewportAnchor = 0.42
): number => {
    const anchorY = window.innerHeight * viewportAnchor;
    return clamp((anchorY - timelineTop) / timelineHeight, 0, 1);
};
