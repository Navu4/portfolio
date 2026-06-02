import styles from "@/components/work/work.module.css";
import { motion, useReducedMotion, useSpring } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ConnectWithMeNudge from "../info/connectWithMeNudge";
import { resolveExperience, isCurrentRole } from "./experienceData";
import { ExperienceInput } from "@/types/experience";
import {
    buildConnectorPaths,
    buildTimelinePath,
    scrollProgressInTimeline,
    syncTimelineNodes,
} from "./timelinePath";

interface Props {
    isMobile: boolean;
    work?: ExperienceInput[];
}

interface SvgSize {
    w: number;
    h: number;
}

const monogram = (name: string) =>
    name.replace(/[^A-Za-z]/g, "").charAt(0).toUpperCase();

const CARD_EASE = [0.22, 1, 0.36, 1] as const;

const Work = (props: Props) => {
    const reduceMotion = useReducedMotion();
    const experience = useMemo(
        () => resolveExperience(props.work),
        [props.work]
    );

    const timelineRef = useRef<HTMLDivElement>(null);
    const pathRef = useRef<SVGPathElement>(null);
    const nodeRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [pathD, setPathD] = useState("");
    const [connectorPaths, setConnectorPaths] = useState<string[]>([]);
    const [svgSize, setSvgSize] = useState<SvgSize>({ w: 0, h: 0 });

    const pointerX = useSpring(0, { stiffness: 120, damping: 24 });
    const pointerY = useSpring(0, { stiffness: 120, damping: 24 });

    const measurePath = useCallback(() => {
        const wrap = timelineRef.current;
        if (!wrap) return;

        const w = wrap.clientWidth;
        const h = wrap.clientHeight;
        if (w <= 0 || h <= 0) return;

        const firstNode = nodeRefs.current.find(Boolean);
        if (!firstNode) return;

        const wrapRect = wrap.getBoundingClientRect();
        const nodeRect = firstNode.getBoundingClientRect();
        const centerX =
            nodeRect.left - wrapRect.left + nodeRect.width / 2;

        const rows = Array.from(
            wrap.querySelectorAll("[data-exp-block]")
        );

        setSvgSize({ w, h });
        setPathD(buildTimelinePath(h, centerX));
        syncTimelineNodes(rows, nodeRefs.current);
        setConnectorPaths(
            props.isMobile || w <= 820
                ? []
                : buildConnectorPaths(wrapRect, rows)
        );
    }, [props.isMobile]);

    const updatePointerOnPath = useCallback(() => {
        const wrap = timelineRef.current;
        const pathEl = pathRef.current;
        if (!wrap || !pathEl || !pathD) return;

        const rect = wrap.getBoundingClientRect();
        const progress = scrollProgressInTimeline(rect.top, rect.height);
        const length = pathEl.getTotalLength();
        if (length <= 0) return;

        const point = pathEl.getPointAtLength(progress * length);
        pointerX.set(point.x);
        pointerY.set(point.y);
    }, [pathD, pointerX, pointerY]);

    useEffect(() => {
        const blocks = timelineRef.current?.querySelectorAll("[data-exp-block]");
        if (!blocks?.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
                if (!visible.length) return;
                const idx = Number(visible[0].target.getAttribute("data-index"));
                if (!Number.isNaN(idx)) setActiveIndex(idx);
            },
            { rootMargin: "-35% 0px -35% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
        );

        blocks.forEach((block) => observer.observe(block));
        return () => observer.disconnect();
    }, [experience.length]);

    useEffect(() => {
        nodeRefs.current = nodeRefs.current.slice(0, experience.length);

        const raf = requestAnimationFrame(() => {
            measurePath();
            updatePointerOnPath();
        });

        return () => cancelAnimationFrame(raf);
    }, [experience.length, measurePath, updatePointerOnPath]);

    useEffect(() => {
        const wrap = timelineRef.current;
        if (!wrap) return;

        let rafId = 0;
        const scheduleMeasure = () => {
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(measurePath);
        };

        const resizeObserver = new ResizeObserver(scheduleMeasure);
        resizeObserver.observe(wrap);

        wrap.querySelectorAll("[data-exp-block]").forEach((row) => {
            resizeObserver.observe(row);
            row.querySelectorAll("article, [data-card-anchor]").forEach((el) => {
                resizeObserver.observe(el);
            });
        });

        window.addEventListener("scroll", updatePointerOnPath, { passive: true });
        window.addEventListener("resize", scheduleMeasure);

        if (document.fonts?.ready) {
            document.fonts.ready.then(scheduleMeasure);
        }

        return () => {
            cancelAnimationFrame(rafId);
            resizeObserver.disconnect();
            window.removeEventListener("scroll", updatePointerOnPath);
            window.removeEventListener("resize", scheduleMeasure);
        };
    }, [experience.length, measurePath, updatePointerOnPath]);

    useEffect(() => {
        if (!pathD) return;
        const raf = requestAnimationFrame(updatePointerOnPath);
        return () => cancelAnimationFrame(raf);
    }, [pathD, updatePointerOnPath]);

    useEffect(() => {
        const raf = requestAnimationFrame(measurePath);
        return () => cancelAnimationFrame(raf);
    }, [activeIndex, measurePath]);

    return (
        <section className={styles.workSection}>
            <div className={styles.workHeading}>
                <div className={styles.titleRow}>
                    <h3>Experience</h3>
                    <span className={styles.titleLine} aria-hidden />
                </div>
            </div>

            <div className={styles.timelineWrap} ref={timelineRef}>
                {svgSize.w > 0 && pathD && (
                    <svg
                        className={styles.timelineSvg}
                        width={svgSize.w}
                        height={svgSize.h}
                        viewBox={`0 0 ${svgSize.w} ${svgSize.h}`}
                        aria-hidden
                    >
                        <defs>
                            <linearGradient
                                id="timelineGrad"
                                gradientUnits="userSpaceOnUse"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2={svgSize.h}
                            >
                                <stop offset="0%" stopColor="rgba(59,130,246,0.2)" />
                                <stop offset="50%" stopColor="rgba(59,130,246,0.75)" />
                                <stop offset="100%" stopColor="rgba(158,197,255,0.35)" />
                            </linearGradient>
                        </defs>
                        <path
                            ref={pathRef}
                            className={styles.timelineLine}
                            d={pathD}
                        />
                        {connectorPaths.map((d, i) => (
                            <path
                                key={i}
                                className={`${styles.timelineConnector} ${activeIndex === i || isCurrentRole(experience[i]) ? styles.timelineConnectorActive : ""} ${isCurrentRole(experience[i]) ? styles.timelineConnectorCurrent : ""}`}
                                d={d}
                            />
                        ))}
                    </svg>
                )}

                <motion.span
                    className={styles.scrollPointer}
                    style={{ x: pointerX, y: pointerY }}
                    aria-hidden
                />

                {experience.map((exp, index) => {
                    const isLeft = index % 2 === 0;
                    const isActive = activeIndex === index;
                    const isCurrent = isCurrentRole(exp);

                    return (
                        <div
                            key={exp.order}
                            data-exp-block
                            data-index={index}
                            data-side={isLeft ? "left" : "right"}
                            className={`${styles.expRow} ${isLeft ? styles.expRowLeft : styles.expRowRight}`}
                        >
                            <motion.article
                                className={`${styles.workCard} ${isCurrent ? styles.workCardCurrent : ""} ${isActive ? styles.workCardActive : ""}`}
                                initial={
                                    reduceMotion
                                        ? false
                                        : {
                                              opacity: 0,
                                              x: isLeft ? -48 : 48,
                                          }
                                }
                                whileInView={
                                    reduceMotion
                                        ? undefined
                                        : { opacity: 1, x: 0 }
                                }
                                viewport={{ once: true, amount: 0.25 }}
                                animate={{ scale: isActive ? 1.04 : 1 }}
                                transition={{
                                    opacity: {
                                        duration: 0.65,
                                        delay: index * 0.12,
                                        ease: CARD_EASE,
                                    },
                                    x: {
                                        duration: 0.65,
                                        delay: index * 0.12,
                                        ease: CARD_EASE,
                                    },
                                    scale: { duration: 0.4, ease: CARD_EASE },
                                }}
                            >
                                <div
                                    className={styles.cardHead}
                                    data-card-anchor
                                >
                                    <span
                                        className={`${styles.milestoneBox} ${isActive || isCurrent ? styles.milestoneActive : ""}`}
                                    >
                                        {exp.logoUrl ? (
                                            <img
                                                src={exp.logoUrl}
                                                alt={exp.logoAlt ?? exp.company}
                                                width={100}
                                                height={100}
                                            />
                                        ) : (
                                            <span className={styles.monogram}>
                                                {monogram(exp.company)}
                                            </span>
                                        )}
                                    </span>
                                    <div className={styles.cardHeadText}>
                                        <p className={styles.jobTitle}>{exp.role}</p>
                                        <Link
                                            href={exp.websiteUrl}
                                            target="_blank"
                                            className={styles.companyName}
                                        >
                                            {exp.company}
                                        </Link>
                                        {exp.location && (
                                            <p className={styles.meta}>
                                                <span>{exp.location}</span>
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <ul className={styles.descList}>
                                    {exp.highlights.map((text, i) => (
                                        <li
                                            key={i}
                                            className={styles.descPoint}
                                            dangerouslySetInnerHTML={{ __html: text }}
                                        />
                                    ))}
                                </ul>

                                {exp.techStack && exp.techStack.length > 0 && (
                                    <div className={styles.techRow}>
                                        {exp.techStack.map((t) => (
                                            <span key={t} className={styles.techChip}>
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </motion.article>

                            <motion.span
                                className={`${styles.timelineNode} ${isActive || isCurrent ? styles.timelineNodeActive : ""} ${isCurrent ? styles.timelineNodeCurrent : ""}`}
                                data-timeline-node
                                initial={
                                    reduceMotion ? false : { opacity: 0, scale: 0 }
                                }
                                whileInView={
                                    reduceMotion
                                        ? undefined
                                        : { opacity: 1, scale: 1 }
                                }
                                viewport={{ once: true, amount: 0.25 }}
                                transition={{
                                    duration: 0.45,
                                    delay: index * 0.12 + 0.15,
                                    ease: CARD_EASE,
                                }}
                                ref={(el) => {
                                    nodeRefs.current[index] = el;
                                }}
                                aria-hidden
                            />

                            <div className={styles.expSpacer} aria-hidden />
                        </div>
                    );
                })}
            </div>

            <ConnectWithMeNudge />
        </section>
    );
};

export default Work;
