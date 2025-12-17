import React from 'react';
import styles from './ExhibitionActions.module.scss';

interface ExhibitionActionsProps {
  onCreateNewItem?: () => void;
  onSelectExisting?: () => void;
  onCreateExhibition?: () => void;
  onAddToDrafts?: () => void;
}

const ExhibitionActions: React.FC<ExhibitionActionsProps> = ({
  onCreateNewItem,
  onSelectExisting,
  onCreateExhibition,
  onAddToDrafts,
}) => {
  return (
    <div className={styles.actionsBar}>
      <div className={styles.actionsLeft}>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={onCreateNewItem}
        >
          Новый экспонат
        </button>

        <button
          type="button"
          className={styles.textButton}
          onClick={onSelectExisting}
        >
          Выбрать из существующих
          <span className={styles.arrow}>→</span>
        </button>
      </div>

      <div className={styles.actionsRight}>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={onCreateExhibition}
        >
          Создать выставку
        </button>

        <button
          type="button"
          className={styles.textButton}
          onClick={onAddToDrafts}
        >
          Добавить в черновики
        </button>
      </div>
    </div>
  );
};

export default ExhibitionActions;
