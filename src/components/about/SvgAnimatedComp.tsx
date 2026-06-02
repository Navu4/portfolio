import { memo, useEffect, useRef } from "react";
import styles from "@/components/about/about.module.css";

interface Props {
    completeAnimation?: boolean;
    /** 0–1 draw amount driven by About section scroll */
    drawProgress?: number;
}

const AboutSVGComp = ({ completeAnimation, drawProgress = 0 }: Props) => {
    const ref = useRef<SVGPathElement | null>(null);

    useEffect(() => {
        const path = ref.current;
        if (!path) return;

        const length = path.getTotalLength();
        path.style.strokeDasharray = `${length}`;

        if (completeAnimation) {
            path.style.strokeDashoffset = "0";
            return;
        }

        const clamped = Math.min(1, Math.max(0, drawProgress));
        path.style.strokeDashoffset = `${length * (1 - clamped)}`;
    }, [completeAnimation, drawProgress]);

    return (
        <svg className={styles.mySVG} x={0} y={0} viewBox="0 0 591.7 313.3">
            <path
                ref={ref}
                fill="none"
                d="M 191.9 118.2 L128 7.3 L463.8 7.3 L295.9 298 L233.2 189.5 Z"
            />
            <rect
                x="150"
                y="82"
                className={styles.quoteTextBG}
                width="93"
                height="55"
            />
            <rect
                x="360"
                y="82"
                className={styles.quoteTextBG}
                width="93"
                height="55"
            />
            <text
                x="210.2858"
                y="130.9107"
                className={styles.quoteText}
                transform="matrix(1,0,0,1,-60,0)"
            >
                My Expertise
            </text>
        </svg>
    );
};

export default memo(AboutSVGComp);
