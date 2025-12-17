import React, { useEffect, useMemo, useRef, useState } from 'react';
import { HexColorInput, HexColorPicker } from 'react-colorful';
import { ChevronDown, Image as ImageIcon, Palette as PaletteIcon, Pencil, Plus, Trash2, X } from 'lucide-react';

import { ColorSettings, FontSettings, PageBackgroundSettings } from '../../types';
import styles from './StylesPanel.module.scss';

interface StylesPanelProps {
  fontSettings: FontSettings;
  setFontSettings: (settings: FontSettings) => void;
  colorSettings: ColorSettings;
  setColorSettings: (settings: ColorSettings) => void;
  pageBackground: PageBackgroundSettings;
  setPageBackground: (settings: PageBackgroundSettings) => void;
}

type ColorRole = keyof ColorSettings;

const DEFAULT_COLORS: ColorSettings = {
  primary: '#1F3B2C',
  secondary: '#E8E5DE',
  background: '#FFFFFF',
  text: '#333333',
};

const COLOR_ROLE_LABELS: Record<ColorRole, string> = {
  primary: 'Заголовок',
  secondary: 'Акцент',
  background: 'Фон',
  text: 'Текст',
};

const COLOR_ROLE_LIST: ColorRole[] = ['primary', 'secondary', 'background', 'text'];

const fontOptions = [
  'PT Serif',
  'Open Sans',
  'Roboto',
  'Playfair Display',
  'Merriweather',
  'Lato',
  'Montserrat',
];

type ModalMode = 'add' | 'edit';

const StylesPanel: React.FC<StylesPanelProps> = ({
  fontSettings,
  setFontSettings,
  colorSettings,
  setColorSettings,
  pageBackground,
  setPageBackground,
}) => {
  const [showFontDetails, setShowFontDetails] = useState(false);
  const [expandedPanels, setExpandedPanels] = useState({ font: true, color: false });

  const [modalMode, setModalMode] = useState<ModalMode | null>(null);
  const [modalRole, setModalRole] = useState<ColorRole>('primary');
  const [modalColor, setModalColor] = useState<string>('#FFFFFF');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const togglePanel = (panel: 'font' | 'color') => {
    setExpandedPanels((prev) => {
      const next = { ...prev };
      if (next[panel]) {
        next[panel] = false;
      } else {
        (Object.keys(next) as Array<keyof typeof next>).forEach((k) => (next[k] = false));
        next[panel] = true;
      }
      return next;
    });

    if (panel === 'font') setShowFontDetails(false);
    if (panel !== 'color') setModalMode(null);
  };

  const openAddColor = () => {
    setModalMode('add');
    setModalRole('primary');
    setModalColor('#FFFFFF');
  };

  const openEditColor = (role: ColorRole) => {
    setModalMode('edit');
    setModalRole(role);
    setModalColor(colorSettings[role]);
  };

  const closeModal = () => setModalMode(null);

  const handleModalRoleChange = (role: ColorRole) => {
    setModalRole(role);
    if (modalMode === 'edit') {
      setModalColor(colorSettings[role]);
    }
  };

  const applyModalColor = () => {
    setColorSettings({
      ...colorSettings,
      [modalRole]: modalColor,
    });
    closeModal();

    // если редактировали фон и выбран режим "фон-цвет" — сразу применится
    if (modalRole === 'background' && pageBackground.mode === 'color') {
      setPageBackground({ mode: 'color', imageUrl: undefined });
    }
  };

  const deleteRoleColor = () => {
    setColorSettings({
      ...colorSettings,
      [modalRole]: DEFAULT_COLORS[modalRole],
    });
    closeModal();

    if (modalRole === 'background') {
      setPageBackground({ mode: 'color', imageUrl: undefined });
    }
  };

  const handlePickBackgroundColor = () => {
    setPageBackground({ mode: 'color', imageUrl: undefined });
    openEditColor('background');
  };

  const handlePickBackgroundImage = () => {
    fileInputRef.current?.click();
  };

  const handleBackgroundFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const url = reader.result as string;
      setPageBackground({ mode: 'image', imageUrl: url });
    };
    reader.readAsDataURL(file);

    // чтобы при повторной загрузке того же файла change срабатывал
    e.currentTarget.value = '';
  };

  const handleSave = () => {
    // в учебном конструкторе сейчас “сохранить” — UX-кнопка.
    // если нужно — потом привяжем к API/сохранению в settings.
  };

  const activeSwatch = useMemo(() => {
    if (modalMode !== 'edit') return null;
    return modalRole;
  }, [modalMode, modalRole]);

  useEffect(() => {
    if (!modalMode) return;
    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [modalMode]);

  return (
    <div className={styles.sidebar__styles}>
      {/* ШРИФТ */}
      <div className={styles.sidebar__stylesGroup}>
        <h3 className={styles.sidebar__stylesTitle} onClick={() => togglePanel('font')}>
          Шрифт
          <ChevronDown
            size={20}
            className={`${styles.arrowIcon} ${expandedPanels.font ? styles.arrowIconActive : ''}`}
          />
        </h3>

        {expandedPanels.font && !showFontDetails && (
          <div className={styles.sidebar__fontContent}>
            <div className={styles.sidebar__stylesGroup}>
              <label className={styles.sidebar__label}>Шрифтовая пара (заголовок)</label>
              <select
                className={styles.sidebar__select}
                value={fontSettings.titleFont}
                onChange={(e) => setFontSettings({ ...fontSettings, titleFont: e.target.value })}
              >
                {fontOptions.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.sidebar__stylesGroup}>
              <label className={styles.sidebar__label}>Шрифтовая пара (основной текст)</label>
              <select
                className={styles.sidebar__select}
                value={fontSettings.bodyFont || fontSettings.titleFont}
                onChange={(e) => setFontSettings({ ...fontSettings, bodyFont: e.target.value })}
              >
                {fontOptions.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.sidebar__fontExample}>
              <h4 className={styles.exampleTitle} style={{ fontFamily: fontSettings.titleFont }}>
                Цифровой музей
              </h4>
              <p className={styles.exampleText} style={{ fontFamily: fontSettings.bodyFont || fontSettings.titleFont }}>
                Искусство становится ближе — исследуйте коллекции онлайн в любое время.
              </p>
            </div>

            <button className={styles.sidebar__editButton} onClick={() => setShowFontDetails(true)}>
              РЕДАКТИРОВАТЬ ШРИФТ
              <span className={styles.arrow}>→</span>
            </button>
          </div>
        )}

        {expandedPanels.font && showFontDetails && (
          <div className={styles.sidebar__fontDetails}>
            <button
              className={styles.sidebar__editButton}
              onClick={() => setShowFontDetails(false)}
              style={{ marginBottom: '10px' }}
            >
              <span className={styles.arrow}>←</span>
              НАЗАД
            </button>

            <div className={styles.fontDetail}>
              <label className={styles.sidebar__label}>ЗАГОЛОВОК (шрифт)</label>
              <select
                className={styles.sidebar__fontDetailSelect}
                value={fontSettings.titleFont}
                onChange={(e) => setFontSettings({ ...fontSettings, titleFont: e.target.value })}
              >
                {fontOptions.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.fontDetail}>
              <label className={styles.sidebar__label}>ЗАГОЛОВОК (начертание)</label>
              <select
                className={styles.sidebar__fontDetailSelect}
                value={fontSettings.titleWeight || 'Normal'}
                onChange={(e) => setFontSettings({ ...fontSettings, titleWeight: e.target.value })}
              >
                <option value="Normal">Normal</option>
                <option value="Bold">Bold</option>
                <option value="Light">Light</option>
                <option value="Italic">Italic</option>
              </select>
            </div>

            <div className={styles.fontDetail}>
              <label className={styles.sidebar__label}>ОСНОВНОЙ ТЕКСТ (шрифт)</label>
              <select
                className={styles.sidebar__fontDetailSelect}
                value={fontSettings.bodyFont || 'Open Sans'}
                onChange={(e) => setFontSettings({ ...fontSettings, bodyFont: e.target.value })}
              >
                {fontOptions.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.fontDetail}>
              <label className={styles.sidebar__label}>ОСНОВНОЙ ТЕКСТ (начертание)</label>
              <select
                className={styles.sidebar__fontDetailSelect}
                value={fontSettings.bodyWeight || 'Normal'}
                onChange={(e) => setFontSettings({ ...fontSettings, bodyWeight: e.target.value })}
              >
                <option value="Normal">Normal</option>
                <option value="Bold">Bold</option>
                <option value="Light">Light</option>
                <option value="Italic">Italic</option>
              </select>
            </div>

            <div className={styles.fontDetail}>
              <label className={styles.sidebar__label}>РАЗМЕР БАЗОВОГО ШРИФТА (px)</label>
              <div className={styles.sidebar__rangeContainer}>
                <input
                  type="range"
                  min="12"
                  max="24"
                  step="1"
                  className={styles.sidebar__range}
                  value={fontSettings.fontSize}
                  onChange={(e) => setFontSettings({ ...fontSettings, fontSize: Number(e.target.value) })}
                />
                <span className={styles.sidebar__rangeValue}>{fontSettings.fontSize}px</span>
              </div>
            </div>

            <div className={styles.sidebar__fontExample}>
              <h4
                className={styles.exampleTitle}
                style={{
                  fontFamily: fontSettings.titleFont,
                  fontWeight:
                    fontSettings.titleWeight === 'Normal'
                      ? 'normal'
                      : fontSettings.titleWeight === 'Bold'
                        ? 'bold'
                        : fontSettings.titleWeight === 'Light'
                          ? 300
                          : 'normal',
                  fontStyle: fontSettings.titleWeight === 'Italic' ? 'italic' : 'normal',
                  fontSize: `${fontSettings.fontSize * 2}px`,
                }}
              >
                Подзаголовок
              </h4>

              <p
                className={styles.exampleText}
                style={{
                  fontFamily: fontSettings.bodyFont || fontSettings.titleFont,
                  fontWeight:
                    fontSettings.bodyWeight === 'Normal'
                      ? 'normal'
                      : fontSettings.bodyWeight === 'Bold'
                        ? 'bold'
                        : fontSettings.bodyWeight === 'Light'
                          ? 300
                          : 'normal',
                  fontStyle: fontSettings.bodyWeight === 'Italic' ? 'italic' : 'normal',
                  fontSize: `${fontSettings.fontSize}px`,
                }}
              >
                ПРИМЕР ВЫБРАННЫХ ШРИФТОВ
              </p>

              <p className={styles.exampleText} style={{ fontFamily: fontSettings.bodyFont || fontSettings.titleFont }}>
                Цифровой музей
              </p>

              <p
                className={styles.exampleText}
                style={{
                  fontFamily: fontSettings.bodyFont || fontSettings.titleFont,
                  fontSize: `${fontSettings.fontSize * 0.9}px`,
                }}
              >
                Искусство становится ближе — исследуйте коллекции онлайн в любое время.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ЦВЕТ */}
      <div className={styles.sidebar__stylesGroup}>
        <h3 className={styles.sidebar__stylesTitle} onClick={() => togglePanel('color')}>
          Цвет
          <ChevronDown
            size={20}
            className={`${styles.arrowIcon} ${expandedPanels.color ? styles.arrowIconActive : ''}`}
          />
        </h3>

        {expandedPanels.color && (
          <div className={styles.colorSection}>
            <div className={styles.sectionTitle}>ЦВЕТОВАЯ СХЕМА</div>

            <div className={styles.colorSchemeRow}>
              {COLOR_ROLE_LIST.map((role) => (
                <button
                  key={role}
                  type="button"
                  className={`${styles.colorSwatch} ${activeSwatch === role ? styles.colorSwatchActive : ''}`}
                  style={{ backgroundColor: colorSettings[role] }}
                  onClick={() => openEditColor(role)}
                  aria-label={`Изменить цвет: ${COLOR_ROLE_LABELS[role]}`}
                >
                  {activeSwatch === role && (
                    <span className={styles.swatchIcon}>
                      <Pencil size={16} />
                    </span>
                  )}
                </button>
              ))}
            </div>

            <button type="button" className={styles.addColorButton} onClick={openAddColor}>
              <Plus size={16} />
              Добавить цвет
            </button>

            <div className={styles.sectionTitle} style={{ marginTop: 18 }}>
              ФОН СТРАНИЦЫ
            </div>

            <div className={styles.backgroundRow}>
              <button
                type="button"
                className={`${styles.backgroundButton} ${pageBackground.mode === 'color' ? styles.backgroundButtonActive : ''}`}
                onClick={handlePickBackgroundColor}
                aria-label="Выбрать фон цветом"
              >
                <PaletteIcon size={22} />
              </button>

              <button
                type="button"
                className={`${styles.backgroundButton} ${pageBackground.mode === 'image' ? styles.backgroundButtonActive : ''}`}
                onClick={handlePickBackgroundImage}
                aria-label="Загрузить изображение фона"
              >
                <ImageIcon size={22} />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleBackgroundFileChange}
                className={styles.hiddenFileInput}
              />
            </div>

            <button type="button" className={styles.saveButton} onClick={handleSave}>
              Сохранить
            </button>
          </div>
        )}
      </div>

      {/* MODAL */}
      {modalMode && (
        <div className={styles.modalOverlay} onMouseDown={closeModal}>
          <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <select
                className={styles.modalSelect}
                value={modalRole}
                onChange={(e) => handleModalRoleChange(e.target.value as ColorRole)}
              >
                {COLOR_ROLE_LIST.map((role) => (
                  <option key={role} value={role}>
                    {COLOR_ROLE_LABELS[role]}
                  </option>
                ))}
              </select>

              <button type="button" className={styles.modalClose} onClick={closeModal} aria-label="Закрыть">
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalPickerWrap}>
              <HexColorPicker color={modalColor} onChange={setModalColor} className={styles.hexColorPicker} />
            </div>

            <div className={styles.modalCodeRow}>
              <div className={styles.modalCodeLabel}>Цветовой код</div>
              <HexColorInput color={modalColor} onChange={setModalColor} className={styles.modalHexInput} />
            </div>

            <button type="button" className={styles.modalPrimaryButton} onClick={applyModalColor}>
              {modalMode === 'add' ? 'Добавить' : 'Изменить'}
            </button>

            {modalMode === 'edit' && (
              <button type="button" className={styles.modalDangerButton} onClick={deleteRoleColor}>
                Удалить <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StylesPanel;
