import React, { useEffect, useState } from "react";
import Header from "../../components/layout/Header/Header.tsx";
import styles from "./ExhibitionsPage.module.scss";
import { fetchExhibitions } from "../../features/exhibitions/service";
import { useNavigate } from "react-router-dom";

type ExhibitionItem = {
  id: string;
  title: string;
  description: string;
  cover_image_key?: string;
  tags?: Array<{ name: string }>;
};

const ExhibitionsPage: React.FC = () => {
  const [items, setItems] = useState<ExhibitionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const load = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetchExhibitions();
      setItems(res.data || []);
    } catch (e) {
      setError("Не удалось загрузить выставки");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const renderTagLine = (item: ExhibitionItem) => {
    if (!item.tags || item.tags.length === 0) return null;
    return item.tags.map((t) => t.name).join(" · ");
  };

  return (
    <div className={styles.page}>
      <Header currentPath="/exhibitions" />
      <main className={styles.main}>
        <div className={styles.topRow}>
          <div>
            <div className={styles.breadcrumb}>Главная — Конструктор — Выставки</div>
            <h1 className={styles.title}>Выставки</h1>
          </div>
          <button className={styles.primaryBtn} onClick={() => navigate("/constructor/new")}>
            Создать выставку
          </button>
        </div>

        {isLoading && <div className={styles.info}>Загружаем...</div>}
        {error && <div className={styles.error}>{error}</div>}

        {!isLoading && !error && (
          <div className={styles.list}>
            {items.length === 0 && <div className={styles.info}>Пока нет выставок</div>}
            {items.map((item) => {
              const cover = item.cover_image_key
                ? `${import.meta.env.VITE_API_URL}/api/v1/files/${item.cover_image_key}`
                : "/exhibit.png";
              return (
                <div className={styles.card} key={item.id}>
                  <div className={styles.coverWrap}>
                    <img src={cover} alt={item.title} className={styles.cover} />
                  </div>
                  <div className={styles.cardBody}>
                    <h2 className={styles.cardTitle}>{item.title}</h2>
                    <p className={styles.cardDesc}>{item.description}</p>
                    <div className={styles.tags}>{renderTagLine(item)}</div>
                  </div>
                  <div className={styles.actions}>
                    <button className={styles.secondaryBtn} onClick={() => navigate(`/constructor/${item.id}`)}>
                      Редактировать
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default ExhibitionsPage;

