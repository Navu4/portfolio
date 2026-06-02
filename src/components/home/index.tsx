import styles from '@/components/home/home.module.css';
import Link from 'next/link';
import { CSSProperties, FC } from 'react';
import HeroVisual from './HeroVisual';
import ResumeCta from './ResumeCta';

type Profession = { text : string, i : number }
export interface HomeProps {
    socialMedia : { name : string, i : number, link : string }[]
    coverImgUrl : string
    name : string
    description : string
    professionAnimationData : Profession[]
    isMobile : boolean
    resumeUrl : string
}

const Home : FC<HomeProps> = (props) => {
  return (
    <section className={styles.home}>
        <div className={styles.homeContent}>
            <h3>Hello, I am</h3>
            <h1>{props.name}</h1>
            <p>{props.description}</p>

            <SocialMediaLinks socialMedia={props.socialMedia} />

            <ResumeCta resumeUrl={props.resumeUrl} />
        </div>
        {!props.isMobile && <HeroVisual />}
    </section>
  )
}
export default Home

export const SocialMediaLinks = ({socialMedia, styleOpposite} : { styleOpposite?: boolean, socialMedia : { name : string, i : number, link : string }[] }) => <div className={`${styles.socialMedia} ${styleOpposite ? styles.oppositeSocalMedia : ''}`}>
{    socialMedia.map(media => (
        <Link key={media.i} href={media.link} target='_blank' style={{ "--i" : media.i } as CSSProperties}> <i className={`bx ${media.name}`}></i> </Link>
    ))
}
</div>;
