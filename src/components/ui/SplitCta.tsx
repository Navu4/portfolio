import Link from "next/link";
import styles from "./splitCta.module.css";

type Props = {
    href: string;
    label: string;
    external?: boolean;
    heroEnter?: boolean;
    ariaLabel?: string;
    className?: string;
};

const SplitCta = ({
    href,
    label,
    external = false,
    heroEnter = false,
    ariaLabel,
    className = "",
}: Props) => {
    const classNames = [
        styles.splitCta,
        heroEnter ? styles.heroEnter : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    const content = (
        <>
            <span className={styles.splitCtaLabel}>{label}</span>
            <i className={`bx bx-up-arrow-alt ${styles.splitCtaIcon}`} aria-hidden="true" />
        </>
    );

    if (external) {
        return (
            <a
                href={href}
                className={classNames}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={ariaLabel ?? label}
            >
                {content}
            </a>
        );
    }

    return (
        <Link href={href} className={classNames} aria-label={ariaLabel ?? label}>
            {content}
        </Link>
    );
};

export default SplitCta;
