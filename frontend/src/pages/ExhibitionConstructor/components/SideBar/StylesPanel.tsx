import React, { useState, useEffect, useRef } from 'react';
import { FontSettings, ColorSettings } from '../../types';
import styles from './StylesPanel.module.scss';
import { HexColorPicker, HexColorInput } from 'react-colorful';

interface StylesPanelProps {
  fontSettings: FontSettings;
  setFontSettings: (settings: FontSettings) => void;
  colorSettings: ColorSettings;
  setColorSettings: (settings: ColorSettings) => void;
}

// Расширенный набор предустановленных цветовых схем
const COLOR_PRESETS = [
  {
    id: 'classic',
    name: 'Классическая',
    colors: {
      primary: '#1F3B2C',
      secondary: '#A67F5D',
      background: '#F7F5F0',
      text: '#333333',
    },
  },
  {
    id: 'warm',
    name: 'Тёплая',
    colors: {
      primary: '#B85C38',
      secondary: '#E09F3E',
      background: '#FFF8E8',
      text: '#513B2C',
    },
  },
  {
    id: 'cool',
    name: 'Холодная',
    colors: {
      primary: '#335C67',
      secondary: '#9EC5AB',
      background: '#F2F5F7',
      text: '#222E3A',
    },
  },
  {
    id: 'monochrome',
    name: 'Монохромная',
    colors: {
      primary: '#2D3748',
      secondary: '#4A5568',
      background: '#EDF2F7',
      text: '#1A202C',
    },
  },
  {
    id: 'vibrant',
    name: 'Яркая',
    colors: {
      primary: '#6B46C1',
      secondary: '#4299E1',
      background: '#EBF8FF',
      text: '#2D3748',
    },
  },
  {
    id: 'earth',
    name: 'Земляная',
    colors: {
      primary: '#5F370E',
      secondary: '#B7791F',
      background: '#FAF5EB',
      text: '#4A5568',
    },
  },
];

// Типы цветовых ролей
type ColorRole = 'primary' | 'secondary' | 'background' | 'text';

const StylesPanel: React.FC<StylesPanelProps> = ({
                                                   fontSettings,
                                                   setFontSettings,
                                                   colorSettings,
                                                   setColorSettings,
                                                 }) => {
  const [showFontDetails, setShowFontDetails] = useState(false);
  const [expandedPanels, setExpandedPanels] = useState({
    font: true,
    color: true,
  });
  const [editingColorRole, setEditingColorRole] = useState<ColorRole | null>(null);
  const [tempColor, setTempColor] = useState<string>('');
  const [pickerPosition, setPickerPosition] = useState<{ top: number; left: number } | null>(null);
  
  // Ref для элемента, по которому кликнули, чтобы отслеживать его позицию
  const clickedSwatchRef = useRef<HTMLDivElement | null>(null);
  
  const togglePanel = (panel: 'font' | 'color') => {
    setExpandedPanels({
      ...expandedPanels,
      [panel]: !expandedPanels[panel],
    });
  };
  
  const applyColorPreset = (presetId: string) => {
    const preset = COLOR_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setColorSettings(preset.colors);
    }
  };
  
  const calculatePickerPosition = () => {
    if (clickedSwatchRef.current) {
      const rect = clickedSwatchRef.current.getBoundingClientRect();
      // Позиционируем пикер справа от кликнутого элемента
      // и по центру по вертикали относительно него
      setPickerPosition({
        top: rect.top + window.scrollY + (rect.height / 2) - 100, // Центрируем по вертикали, вычитаем половину высоты пикера (приблизительно 200px / 2 = 100)
        left: rect.right + window.scrollX + 15, // 15px отступ справа от элемента
      });
    }
  };
  
  const handleColorSwatchClick = (role: ColorRole, event: React.MouseEvent<HTMLDivElement>) => {
    setEditingColorRole(role);
    setTempColor(colorSettings[role]); // Initialize temp color with current color
    clickedSwatchRef.current = event.currentTarget; // Сохраняем ссылку на элемент
    calculatePickerPosition(); // Вычисляем начальную позицию
  };
  
  const handleConfirmColor = () => {
    if (editingColorRole) {
      setColorSettings({
        ...colorSettings,
        [editingColorRole]: tempColor,
      });
    }
    setEditingColorRole(null);
    setPickerPosition(null);
    clickedSwatchRef.current = null; // Очищаем ссылку
  };
  
  const handleCancelColor = () => {
    setEditingColorRole(null);
    setPickerPosition(null);
    clickedSwatchRef.current = null; // Очищаем ссылку
  };
  
  // Эффект для отслеживания прокрутки
  useEffect(() => {
    if (editingColorRole && clickedSwatchRef.current) {
      window.addEventListener('scroll', calculatePickerPosition);
      // Очистка слушателя события при размонтировании компонента или закрытии пикера
      return () => {
        window.removeEventListener('scroll', calculatePickerPosition);
      };
    }
  }, [editingColorRole]);
  
  return (
    <div className={styles.sidebar__styles}>
      {/* Панель настройки шрифта */}
      <div className={styles.sidebar__stylesGroup}>
        <h3
          className={styles.sidebar__stylesTitle}
          onClick={() => togglePanel('font')}
        >
          Шрифт
          <span className={styles.arrow}>
            {expandedPanels.font ? '▼' : '▲'}
          </span>
        </h3>
        
        {expandedPanels.font && !showFontDetails && (
          <>
            <div className={styles.sidebar__stylesGroup}>
              <label className={styles.sidebar__label}>ШРИФТОВАЯ ПАРА</label>
              <select
                className={styles.sidebar__select}
                value={fontSettings.titleFont}
                onChange={(e) =>
                  setFontSettings({ ...fontSettings, titleFont: e.target.value })
                }
              >
                <option value="PT Serif">PT Serif</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Roboto">Roboto</option>
                <option value="Playfair Display">Playfair Display</option>
              </select>
            </div>
            
            <div className={styles.sidebar__fontExample}>
              <h4 className={styles.exampleTitle}>Цифровой музей</h4>
              <p className={styles.exampleText}>
                Искусство становится ближе — исследуйте коллекции онлайн в любое
                время.
              </p>
            </div>
            
            <button
              className={styles.sidebar__editButton}
              onClick={() => setShowFontDetails(true)}
            >
              РЕДАКТИРОВАТЬ ШРИФТ
              <span className={styles.arrow}>→</span>
            </button>
          </>
        )}
        
        {expandedPanels.font && showFontDetails && (
          <div className={styles.sidebar__fontDetails}>
            {/* Кнопка "Назад" */}
            <button
              className={styles.sidebar__editButton}
              onClick={() => setShowFontDetails(false)}
              style={{ marginBottom: '10px' }}
            >
              <span className={styles.arrow}>←</span>
              НАЗАД
            </button>
            
            <div className={styles.fontDetail}>
              <label className={styles.sidebar__label}>ЗАГОЛОВОК</label>
              <select
                className={styles.sidebar__fontDetailSelect}
                value={fontSettings.titleFont}
                onChange={(e) =>
                  setFontSettings({ ...fontSettings, titleFont: e.target.value })
                }
              >
                <option value="PT Serif">PT Serif</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Roboto">Roboto</option>
                <option value="Playfair Display">Playfair Display</option>
              </select>
            </div>
            
            <div className={styles.fontDetail}>
              <label className={styles.sidebar__label}>НАЧЕРТАНИЕ</label>
              <select
                className={styles.sidebar__fontDetailSelect}
                value={fontSettings.titleWeight || 'Bold'}
                onChange={(e) =>
                  setFontSettings({ ...fontSettings, titleWeight: e.target.value })
                }
              >
                <option value="Normal">Normal</option>
                <option value="Bold">Bold</option>
                <option value="Light">Light</option>
                <option value="Italic">Italic</option>
              </select>
            </div>
            
            <div className={styles.fontDetail}>
              <label className={styles.sidebar__label}>РАЗМЕР</label>
              <div className={styles.sidebar__rangeContainer}>
                <input
                  type="range"
                  min="12"
                  max="48"
                  step="1"
                  className={styles.sidebar__range}
                  value={fontSettings.fontSize}
                  onChange={(e) =>
                    setFontSettings({
                      ...fontSettings,
                      fontSize: Number(e.target.value),
                    })
                  }
                />
                <span className={styles.sidebar__rangeValue}>
                  {fontSettings.fontSize}px
                </span>
              </div>
            </div>
            
            <div className={styles.sidebar__fontExample}>
              <h4 className={styles.exampleTitle}>Подзаголовок</h4>
              <p className={styles.exampleText}>ПРИМЕР ВЫБРАННЫХ ШРИФТОВ</p>
              <p className={styles.exampleText}>Цифровой музей</p>
              <p className={styles.exampleText}>
                Искусство становится ближе — исследуйте коллекции онлайн в любое
                время.
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Панель настройки цвета */}
      <div className={styles.sidebar__stylesGroup}>
        <h3
          className={styles.sidebar__stylesTitle}
          onClick={() => togglePanel('color')}
        >
          Цвет
          <span className={styles.arrow}>
            {expandedPanels.color ? '▼' : '▲'}
          </span>
        </h3>
        
        {expandedPanels.color && (
          <>
            <div className={styles.sidebar__colorScheme}>
              <h4 className={styles.sidebar__colorSchemeTitle}>
                ТЕКУЩАЯ ПАЛИТРА
              </h4>
              
              {/* Текущая палитра с возможностью редактирования */}
              <div className={styles.sidebar__currentPaletteDisplay}>
                {(['primary', 'secondary', 'background', 'text'] as ColorRole[]).map(
                  (role) => (
                    <div
                      key={role}
                      className={styles.sidebar__currentPaletteItem}
                      onClick={(e) => handleColorSwatchClick(role, e)}
                    >
                      <div
                        className={styles.currentPaletteColor}
                        style={{ backgroundColor: colorSettings[role] }}
                      />
                      <span className={styles.colorRoleLabel}>
                        {role === 'primary' && 'Основной'}
                        {role === 'secondary' && 'Вторичный'}
                        {role === 'background' && 'Фон'}
                        {role === 'text' && 'Текст'}
                      </span>
                    </div>
                  )
                )}
              </div>
              
              {/* Custom Color Picker */}
              {editingColorRole && pickerPosition && (
                <div
                  className={styles.colorPickerPopover} // New class for positioning
                  style={{ top: pickerPosition.top, left: pickerPosition.left }}
                >
                  <div className={styles.colorPickerPopoverContent}>
                    <div className={styles.colorPickerPopoverHeader}>
                      <span>
                        {editingColorRole === 'primary' && 'Основной'}
                        {editingColorRole === 'secondary' && 'Вторичный'}
                        {editingColorRole === 'background' && 'Фон'}
                        {editingColorRole === 'text' && 'Текст'}
                      </span>
                      <button onClick={handleCancelColor}>✕</button>
                    </div>
                    <HexColorPicker
                      color={tempColor}
                      onChange={setTempColor} // Update temp color directly
                      className={styles.hexColorPicker}
                    />
                    <div className={styles.colorCodeSection}>
                      Цветовой код
                      <HexColorInput
                        color={tempColor}
                        onChange={setTempColor} // Update temp color directly
                        className={styles.hexColorInput}
                      />
                    </div>
                    <button onClick={handleConfirmColor} className={styles.confirmColorButton}>ОК</button>
                  </div>
                </div>
              )}
              
              {/* Предустановленные цветовые схемы */}
              <h4
                className={styles.sidebar__colorSchemeTitle}
                style={{ marginTop: '24px' }}
              >
                ПРЕДУСТАНОВЛЕННЫЕ ПАЛИТРЫ
              </h4>
              
              <div className={styles.sidebar__presetPalettesGrid}>
                {COLOR_PRESETS.map((preset) => (
                  <div
                    key={preset.id}
                    className={styles.sidebar__presetPalette}
                    onClick={() => applyColorPreset(preset.id)}
                  >
                    <div className={styles.presetPaletteName}>
                      {preset.name}
                    </div>
                    <div className={styles.sidebar__palette}>
                      <div
                        className={styles.paletteColor}
                        style={{ backgroundColor: preset.colors.primary }}
                      ></div>
                      <div
                        className={styles.paletteColor}
                        style={{ backgroundColor: preset.colors.secondary }}
                      ></div>
                      <div
                        className={styles.paletteColor}
                        style={{ backgroundColor: preset.colors.background }}
                      ></div>
                      <div
                        className={styles.paletteColor}
                        style={{ backgroundColor: preset.colors.text }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <button
              className={styles.sidebar__button}
              onClick={() => {
                /* Implement apply styles logic */
              }}
            >
              Применить стили
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default StylesPanel;
