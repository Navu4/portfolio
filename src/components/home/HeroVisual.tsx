import Image from "next/image";
import {
    motion,
    useMotionTemplate,
    useMotionValue,
    useReducedMotion,
    useSpring,
} from "framer-motion";
import { PointerEvent } from "react";
import styles from "./home.module.css";
import { HERO_IMAGE_HEIGHT, HERO_IMAGE_SRC, HERO_IMAGE_WIDTH } from "./heroImage";

const HeroVisual = () => {
    const reduceMotion = useReducedMotion();

    const rotateX = useSpring(0, { stiffness: 120, damping: 18 });
    const rotateY = useSpring(0, { stiffness: 120, damping: 18 });
    const glowX = useMotionValue(50);
    const glowY = useMotionValue(40);

    const glow = useMotionTemplate`radial-gradient(circle at ${glowX}% ${glowY}%, rgba(59,130,246,0.14), transparent 58%)`;

    const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
        if (reduceMotion) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        rotateY.set((px - 0.5) * 14);
        rotateX.set((0.5 - py) * 12);
        glowX.set(px * 100);
        glowY.set(py * 100);
    };

    const handlePointerLeave = () => {
        rotateX.set(0);
        rotateY.set(0);
        glowX.set(50);
        glowY.set(40);
    };

    return (
        <div className={styles.heroVisual}>
            <motion.div
                className={styles.heroVisualInner}
                onPointerMove={handlePointerMove}
                onPointerLeave={handlePointerLeave}
                style={
                    reduceMotion
                        ? undefined
                        : { rotateX, rotateY, transformPerspective: 1000 }
                }
                animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
                transition={
                    reduceMotion
                        ? undefined
                        : { duration: 7, repeat: Infinity, ease: "easeInOut" }
                }
                whileHover={
                    reduceMotion
                        ? undefined
                        : { scale: 1.02, transition: { duration: 0.25 } }
                }
            >
                <motion.div
                    className={styles.heroVisualGlow}
                    style={{ background: glow }}
                    aria-hidden
                />
                <Image
                    src={HERO_IMAGE_SRC}
                    alt="Engineering expertise overview"
                    width={HERO_IMAGE_WIDTH}
                    height={HERO_IMAGE_HEIGHT}
                    priority
                    unoptimized
                    sizes="(max-width: 1100px) 85vw, 820px"
                    className={styles.heroVisualImg}
                />
            </motion.div>
        </div>
    );
};

export default HeroVisual;
