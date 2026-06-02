import styles from "@/components/about/about.module.css";
import AboutSVGComp from "./SvgAnimatedComp";
import CenterMatrix from "./CenterMatrix";
import SkillCardMatrix from "./SkillCardMatrix";
import {
    INTRO_END,
    STACK_END,
    SkillSection,
    useStackCardMotion,
} from "./aboutStackMotion";
import {
    motion,
    useMotionValueEvent,
    useReducedMotion,
    useScroll,
    useTransform,
    type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface Props {
    completeAnimation?: boolean;
    isMobile: boolean;
    description: string;
    skills: SkillSection[];
}

const StackSkillCard = ({
    skill,
    index,
    total,
    progress,
    isMobile,
    stageWidth,
    stageHeight,
}: {
    skill: SkillSection;
    index: number;
    total: number;
    progress: MotionValue<number>;
    isMobile: boolean;
    stageWidth: number;
    stageHeight: number;
}) => {
    const motionValues = useStackCardMotion(
        progress,
        index,
        total,
        isMobile,
        stageWidth,
        stageHeight
    );

    return (
        <motion.article
            className={styles.skillCard}
            initial={{ opacity: 0 }}
            style={{
                x: motionValues.x,
                y: motionValues.y,
                scale: motionValues.scale,
                opacity: motionValues.opacity,
                zIndex: motionValues.zIndex,
            }}
        >
            <SkillCardMatrix />
            <div className={styles.skillCardContent}>
                <h2>{skill.heading}</h2>
                <div className={styles.iconContainer}>
                    {skill.imgUrls.map((url, i) => (
                        <img key={i} src={url} alt="" />
                    ))}
                </div>
                <p dangerouslySetInnerHTML={{ __html: skill.desc }} />
            </div>
        </motion.article>
    );
};

const About = (props: Props) => {
    const reduceMotion = useReducedMotion();
    const sectionRef = useRef<HTMLElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const [svgDraw, setSvgDraw] = useState(props.completeAnimation ? 1 : 0);
    const [stageSize, setStageSize] = useState({ width: 780, height: 560 });
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"],
    });

    const stackProgress = useTransform(
        scrollYProgress,
        [INTRO_END, STACK_END],
        [0, 1]
    );

    const drawProgress = useTransform(scrollYProgress, [0, INTRO_END], [0, 1]);

    useMotionValueEvent(drawProgress, "change", (v) => {
        if (!props.completeAnimation) setSvgDraw(v);
    });

    useEffect(() => {
        const stage = stageRef.current;
        if (!stage) return;

        const measure = () => {
            const rect = stage.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
                setStageSize({ width: rect.width, height: rect.height });
            }
        };

        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(stage);
        return () => observer.disconnect();
    }, []);

    const sectionHeight = `${Math.max(props.skills.length * 75 + 130, 200)}vh`;

    if (reduceMotion) {
        return (
            <section className={styles.aboutSection}>
                <div className={styles.aboutHeading}>
                    <div className={styles.introStageStatic}>
                    <CenterMatrix />
                    <div className={styles.introContent}>
                            <div className={styles.wrap}>
                                <AboutSVGComp completeAnimation />
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.desc}>
                    <p dangerouslySetInnerHTML={{ __html: props.description }} />
                </div>
                <div className={styles.settledGrid}>
                    {props.skills.map((skill) => (
                        <article key={skill.i} className={styles.skillCardStatic}>
                            <SkillCardMatrix />
                            <div className={styles.skillCardContent}>
                                <h2>{skill.heading}</h2>
                                <div className={styles.iconContainer}>
                                    {skill.imgUrls.map((url, i) => (
                                        <img key={i} src={url} alt="" />
                                    ))}
                                </div>
                                <p dangerouslySetInnerHTML={{ __html: skill.desc }} />
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section
            ref={sectionRef}
            className={styles.aboutSection}
            style={{ height: sectionHeight }}
        >
            <div className={styles.stickyStage}>
                <div className={styles.triangleStage} ref={stageRef}>
                    <CenterMatrix />

                    <div className={styles.introCenter}>
                        <div className={styles.introContent}>
                            <div className={styles.wrap}>
                                <AboutSVGComp
                                    completeAnimation={props.completeAnimation}
                                    drawProgress={
                                        props.completeAnimation ? 1 : svgDraw
                                    }
                                />
                            </div>
                            <div className={styles.desc}>
                                <p
                                    dangerouslySetInnerHTML={{
                                        __html: props.description,
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.stackDeck}>
                        {props.skills.map((skill, index) => (
                            <StackSkillCard
                                key={skill.i}
                                skill={skill}
                                index={index}
                                total={props.skills.length}
                                progress={stackProgress}
                                isMobile={props.isMobile}
                                stageWidth={stageSize.width}
                                stageHeight={stageSize.height}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
