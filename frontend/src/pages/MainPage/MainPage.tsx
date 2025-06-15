import React from 'react';
import styles from './MainPage.module.scss'
import Header from '../../components/layout/Header/Header.tsx';
import PhotoSlider from './components/PhotoSlider/PhotoSlider.tsx';
import ExhibitionsGrid from './components/ExhibitionsGrid/ExhibitionsGrid.tsx';

const MainPage: React.FC = () => {
  
  const images = [
    '/slider1.png',
    '/slider2.png',
    '/slider3.png'
  ];
  
  
  return (
    <div className={styles.wrapper}>
      <Header/>
      <PhotoSlider images={images}
                   autoplayInterval={7000}
                   className="my-custom-carousel"/>
      <ExhibitionsGrid variant={'full'} />
    </div>
  );
};

export default MainPage;
