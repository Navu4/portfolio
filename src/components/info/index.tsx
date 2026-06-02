import styles from '@/components/info/info.module.css'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react';

interface Props {}
const InfoComp = (props: Props) => {
    const myRef = useRef<HTMLDivElement>(null);
    const [showAnimation, setShowAnimation] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(function (entries) {
            const entry = entries[0];
            if (entry.isIntersecting) {
                setShowAnimation(true);
            }
        });
        if (myRef.current) observer.observe(myRef.current);
    }, []);
  return (
    <section className={styles.infoSection}>
        <div className={styles.infoContainer} ref={myRef}>
            <div className={`${styles.infoLane} ${styles.projectInfo} ${showAnimation ? styles.leftAnimation : ''}`}>
                <article>
                    <h1>I build &amp; <br /> design stuff</h1>
                    <p>Open source <br /> projects, web apps <br /> and experimentals.</p>
                </article>
                <Link href="/project" className={styles.animatedBtn}>
                    See the work <span>→</span>
                </Link>
           </div>
            <div className={`${styles.infoLane} ${styles.blogInfo} ${showAnimation ? styles.rightAnimation : ''}`}>
                <article>
                    <h1>I write, <br /> sometimes</h1>
                    <p>About design,  <br />  frontend dev,  <br />  learning and life.</p>
                </article>
                <Link
                    href="https://medium.com/@snav.jot5454"
                    className={styles.animatedBtn}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Read my blogs <span>→</span>
                </Link>
            </div>
        </div>
    </section>
  )
}
export default InfoComp
