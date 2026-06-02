import styles from "./about.module.css";

const SkillCardMatrix = () => (
    <svg
        className={styles.matrixBg}
        viewBox="0 0 360 220"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
    >
        <defs>
            <pattern
                id="skillCardGrid"
                width="18"
                height="18"
                patternUnits="userSpaceOnUse"
            >
                <path
                    d="M 18 0 L 0 0 0 18"
                    fill="none"
                    stroke="rgba(15, 23, 42, 0.07)"
                    strokeWidth="0.6"
                />
            </pattern>
            <linearGradient id="matrixFade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.92" />
                <stop offset="55%" stopColor="#f8fafc" stopOpacity="0.78" />
                <stop offset="100%" stopColor="#f1f5f9" stopOpacity="0.95" />
            </linearGradient>
        </defs>

        <rect width="360" height="220" fill="url(#matrixFade)" />

        {/* perspective tunnel lines */}
        <g stroke="rgba(15, 23, 42, 0.09)" strokeWidth="0.65" fill="none">
            <rect x="118" y="72" width="124" height="76" rx="2" />
            <rect
                x="118"
                y="72"
                width="124"
                height="76"
                fill="url(#skillCardGrid)"
                stroke="rgba(15, 23, 42, 0.11)"
            />
            <line x1="0" y1="0" x2="118" y2="72" />
            <line x1="360" y1="0" x2="242" y2="72" />
            <line x1="0" y1="220" x2="118" y2="148" />
            <line x1="360" y1="220" x2="242" y2="148" />
            <line x1="118" y1="72" x2="0" y2="110" />
            <line x1="242" y1="72" x2="360" y2="110" />
            <line x1="118" y1="148" x2="0" y2="110" />
            <line x1="242" y1="148" x2="360" y2="110" />
        </g>

        {/* inner grid on back wall */}
        <g stroke="rgba(15, 23, 42, 0.06)" strokeWidth="0.5">
            {[88, 106, 124, 142, 160].map((y) => (
                <line key={`h-${y}`} x1="124" y1={y} x2="236" y2={y} />
            ))}
            {[136, 154, 172, 190, 208, 226].map((x) => (
                <line key={`v-${x}`} x1={x} y1="76" x2={x} y2="144" />
            ))}
        </g>

        {/* broken double frame */}
        <g stroke="rgba(15, 23, 42, 0.14)" strokeWidth="0.85" fill="none">
            <path d="M 14 14 H 168 M 192 14 H 346" />
            <path d="M 14 206 H 168 M 192 206 H 346" />
            <path d="M 14 14 V 98 M 14 122 V 206" />
            <path d="M 346 14 V 98 M 346 122 V 206" />
        </g>
        <g stroke="rgba(15, 23, 42, 0.08)" strokeWidth="0.55" fill="none">
            <path d="M 22 22 H 160 M 200 22 H 338" />
            <path d="M 22 198 H 160 M 200 198 H 338" />
            <path d="M 22 22 V 102 M 22 118 V 198" />
            <path d="M 338 22 V 102 M 338 118 V 198" />
        </g>
    </svg>
);

export default SkillCardMatrix;
