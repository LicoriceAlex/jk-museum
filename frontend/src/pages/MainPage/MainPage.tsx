import React, { useEffect, useState } from 'react';
import styles from './MainPage.module.scss'
import Header from '../../components/layout/Header/Header.tsx';
import PhotoSlider from './components/PhotoSlider/PhotoSlider.tsx';
import ExhibitionsGrid from './components/ExhibitionsGrid/ExhibitionsGrid.tsx';
import { fetchExhibitions } from '../../features/exhibitions/service';
import { Exhibition } from './components/ExhibitionCard/ExhibitionCard.tsx';

const MainPage: React.FC = () => {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const images = [
    '/slider1.png',
    '/slider2.png',
    '/slider3.png'
  ];

  useEffect(() => {
    const loadExhibitions = async () => {
      try {
        setIsLoading(true);
        const response = await fetchExhibitions();
        const serverExhibitions: Exhibition[] = (response.data || []).map((item: any) => ({
          id: item.id,
          title: item.title,
          author: 'Автор не указан',
          creation_date: item.created_at || new Date().toISOString(),
          description: item.description || '',
          exhibit_type: item.tags?.[0]?.name || 'Выставка',
          image_key: item.cover_image_key
            ? `${import.meta.env.VITE_API_URL || ''}/api/v1/files/${item.cover_image_key}`
            : '/placeholder-museum.jpg',
          organization_id: item.organization_id || '',
          created_at: item.created_at || new Date().toISOString(),
          updated_at: item.updated_at || item.created_at || new Date().toISOString(),
        }));
        
        setExhibitions(serverExhibitions);
      } catch (error) {
        console.error('Ошибка загрузки выставок:', error);
        // В случае ошибки оставляем пустой массив, будут показаны только mock данные
        setExhibitions([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadExhibitions();
  }, []);
  
  return (
    <div className={styles.wrapper}>
      <Header/>
      <PhotoSlider images={images}
                   autoplayInterval={7000}
                   className="my-custom-carousel"/>
      <ExhibitionsGrid variant={'full'} exhibitions={exhibitions} />
    </div>
  );
};

export default MainPage;
