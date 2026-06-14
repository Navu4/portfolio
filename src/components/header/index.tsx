import Link from 'next/link'
import styles from '@/components/header/header.module.css';
import { CSSProperties, memo } from 'react';
import { useScrollVisiblility } from '@/hooks';


interface Props {
  isMobile : boolean
}
const Header = (props: Props) => {
  const showOrHideNavbar = useScrollVisiblility();
  
  const navMenuData = [
    { link : '/', i : 7, imgUrl : 'https://cdn-icons-png.flaticon.com/512/3242/3242120.png', alt : 'coder-img', text : 'About', imgStyle: true, height: '36px' },
    { link : '/work', i : 8, imgUrl : 'https://cdn-icons-png.flaticon.com/512/4192/4192708.png', alt : 'work', text : 'My Work' },
    { link : '/project', i : 9, imgUrl : 'https://res.cloudinary.com/dr4kgyjzt/image/upload/v1692822420/ksvdpuzkshceakodosks.jpg', alt : 'project', text : 'My Project', imgStyle: true, height: '30px' },
    { link : 'https://medium.com/@snav.jot5454', i : 10, imgUrl : 'https://static.thenounproject.com/png/1453176-200.png', alt : 'my-blogs', text : 'My Blogs' },
    { link : '/contact', i : 11, imgUrl : 'https://cdn-icons-png.flaticon.com/512/3095/3095583.png', alt : 'contact', text : 'Contact', imgStyle: true },
  ]
  return (
    <header className={`${styles.header} ${props.isMobile ? styles.showHeader : showOrHideNavbar ? styles.showHeader : styles.hideHeader }`}>
      <div className={styles.headerContainer}>
        <div className={`${styles.logo} ${styles.logoMain}`}>
          <Link href={'/'} >
            Nav.
          </Link>
        </div>
        <nav className={styles.navMenu} >
          {
            navMenuData.map(navData => (
              <Link key={navData.i} href={navData.link} className={styles.list} style={{ "--i" : navData.i } as CSSProperties}>
                <div>
                  <img 
                    style={ navData.imgStyle ? { height: navData.height ? navData.height : '36px' } : {}}
                    src={navData.imgUrl}
                    alt={navData.alt}
                    />
                  <span>{navData.text}</span>
                </div>
              </Link>
            ))
          }
        </nav>
      </div>
    </header>
  )
}
export default memo(Header); 