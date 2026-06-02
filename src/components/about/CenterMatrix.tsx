import styles from "./about.module.css";

const MATRIX_SRC = "/expertise-matrix.png";

const CenterMatrix = () => (
    <div className={styles.centerMatrix} aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
            src={MATRIX_SRC}
            alt=""
            className={styles.centerMatrixAsset}
            width={1024}
            height={626}
            decoding="async"
            draggable={false}
        />
    </div>
);

export default CenterMatrix;
