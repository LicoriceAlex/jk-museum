import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchExhibitionById } from '../../features/exhibitions/service';
import { ExhibitionData, FontSettings, ColorSettings, PageBackgroundSettings, ExhibitionBlock } from '../ExhibitionConstructor/types';
import ExhibitionViewContent from './components/ExhibitionViewContent/ExhibitionViewContent';
import Header from '../../components/layout/Header/Header';
import styles from './ExhibitionView.module.scss';

const ExhibitionView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [exhibitionData, setExhibitionData] = useState<ExhibitionData | null>(null);
  const [fontSettings, setFontSettings] = useState<FontSettings>({
    titleFont: 'var(--font-main)',
    bodyFont: 'var(--font-secondary)',
    fontSize: 16,
    titleWeight: 'Normal',
    bodyWeight: 'Normal',
  });
  const [colorSettings, setColorSettings] = useState<ColorSettings>({
    primary: '#344E41',
    secondary: '#253A30',
    background: '#FFFFFF',
    text: '#1A2620',
  });
  const [pageBackground, setPageBackground] = useState<PageBackgroundSettings>({
    mode: 'color',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadExhibition = async () => {
      if (!id) {
        setError('ID выставки не указан');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchExhibitionById(id);
        
        // Маппинг типов блоков из API
        const mapTypeFromApi = (type: string, items: any[]): string => {
          // Если CAROUSEL с одним изображением - показываем как обычное фото
          if (type === 'CAROUSEL' && items && items.length === 1) {
            return 'IMAGE';
          }
          if (type === 'PHOTO' && items && items.length > 0) {
            if (items.length === 2) return 'IMAGES_2';
            if (items.length === 3) return 'IMAGES_3';
            if (items.length === 4) return 'IMAGES_4';
            return 'PHOTO';
          }
          return type;
        };

        const exhibition: ExhibitionData = {
          id: data.id || id,
          title: data.title || '',
          description: data.description || '',
          organization: data.settings?.constructor?.organization || '',
          team: data.settings?.constructor?.team || '',
          tags: (data.settings?.constructor?.tags as string[]) || data.tags?.map((t: any) => t.name) || [],
          cover: data.cover_image_key
            ? `${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') : ''}/api/v1/files/${data.cover_image_key}`
            : '',
          blocks: (data.blocks || [])
            .sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0))
            .map((b: any, idx: number) => ({
              id: b.id || `block-${Date.now()}-${idx}`,
              type: mapTypeFromApi(b.type, b.items) as any,
              position: b.position ?? idx,
              content: b.content || '',
              settings: b.settings || {},
              items: (b.items || []).map((it: any, i: number) => ({
                id: it.id || `${b.id || idx}-item-${i}`,
                text: it.text,
                image_url: it.image_key
                  ? `${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') : ''}/api/v1/files/${it.image_key}`
                  : undefined,
              })),
            })),
        };

        setExhibitionData(exhibition);

        if (data.settings?.constructor?.fontSettings) {
          setFontSettings(data.settings.constructor.fontSettings);
        }
        if (data.settings?.constructor?.colorSettings) {
          setColorSettings(data.settings.constructor.colorSettings);
        }
        if (data.settings?.constructor?.pageBackground) {
          setPageBackground(data.settings.constructor.pageBackground);
        }
      } catch (e) {
        console.error('Не удалось загрузить выставку', e);
        setError('Не удалось загрузить выставку');
      } finally {
        setIsLoading(false);
      }
    };

    loadExhibition();
  }, [id]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Header />
        <div className={styles.loading}>Загрузка выставки...</div>
      </div>
    );
  }

  if (error || !exhibitionData) {
    return (
      <div className={styles.container}>
        <Header />
        <div className={styles.error}>
          <p>{error || 'Выставка не найдена'}</p>
          <button onClick={() => navigate('/')} className={styles.backButton}>
            Вернуться на главную
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <ExhibitionViewContent
          exhibitionData={exhibitionData}
          fontSettings={fontSettings}
          colorSettings={colorSettings}
          pageBackground={pageBackground}
        />
      </main>
    </div>
  );
};

export default ExhibitionView;

