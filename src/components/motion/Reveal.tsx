import { motion } from "framer-motion";
import { CSSProperties, FC, ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

type Direction = "up" | "down" | "left" | "right" | "none";

interface RevealProps {
    children: ReactNode;
    direction?: Direction;
    delay?: number;
    duration?: number;
    distance?: number;
    once?: boolean;
    amount?: number;
    className?: string;
    style?: CSSProperties;
    as?: "div" | "section" | "li" | "article" | "span";
}

const offset = (direction: Direction, distance: number) => {
    switch (direction) {
        case "up":
            return { y: distance };
        case "down":
            return { y: -distance };
        case "left":
            return { x: distance };
        case "right":
            return { x: -distance };
        default:
            return {};
    }
};

const Reveal: FC<RevealProps> = ({
    children,
    direction = "up",
    delay = 0,
    duration = 0.7,
    distance = 40,
    once = true,
    amount = 0.2,
    className,
    style,
    as = "div",
}) => {
    const MotionTag = motion[as];
    return (
        <MotionTag
            className={className}
            style={style}
            initial={{ opacity: 0, ...offset(direction, distance) }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once, amount }}
            transition={{ duration, delay, ease: EASE }}
        >
            {children}
        </MotionTag>
    );
};

export default Reveal;
