import { FC, ReactNode } from 'react';
import Header from '../header/index';
import Footer from '../footer/index';
import styles from './layout.module.css';

interface LayoutProps {
  children?: ReactNode
  isMobile : boolean
}
const Layout : FC<LayoutProps> = ({ children, isMobile }) => {
  return (
    <>
        <div className={styles.glow} aria-hidden />
        <Header isMobile={isMobile} />
        {children}
        <Footer />
    </>
  )
}
export default Layout
