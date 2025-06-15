import React, { useState, useEffect, useRef } from 'react';
import { FontSettings, ColorSettings } from '../../types';
import styles from './StylesPanel.module.scss';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import { ChevronDown } from 'lucide-react';

interface StylesPanelProps {
  fontSettings: FontSettings;
  setFontSettings: (settings: FontSettings) => void;
  colorSettings: ColorSettings;
  setColorSettings: (settings: ColorSettings) => void;
}

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

type ColorRole = 'primary' | 'secondary' | 'background' | 'text';

const fontOptions = [
  "PT Serif",
  "Open Sans",
  "Roboto",
  "Playfair Display",
  "Merriweather",
  "Lato",
  "Montserrat"
];


const StylesPanel: React.FC<StylesPanelProps> = ({
                                                   fontSettings,
                                                   setFontSettings,
                                                   colorSettings,
                                                   setColorSettings,
                                                 }) => {
  const [showFontDetails, setShowFontDetails] = useState(false);
  const [expandedPanels, setExpandedPanels] = useState({
    font: true,
    color: false,
  });
  const [editingColorRole, setEditingColorRole] = useState<ColorRole | null>(null);
  const [tempColor, setTempColor] = useState<string>('');
  const [pickerPosition, setPickerPosition] = useState<{ top: number; left: number } | null>(null);
  
  const clickedSwatchRef = useRef<HTMLDivElement | null>(null);
  
  const togglePanel = (panel: 'font' | 'color') => {
    setExpandedPanels((prev) => {
      const newState = { ...prev };
      if (newState[panel]) {
        newState[panel] = false;
      } else {
        Object.keys(newState).forEach((key) => {
          newState[key as 'font' | 'color'] = false;
        });
        newState[panel] = true;
      }
      return newState;
    });
    if (panel === 'font' && expandedPanels.font === false) {
      setShowFontDetails(false);
    }
    if (editingColorRole && panel !== 'color') {
      setEditingColorRole(null);
      setPickerPosition(null);
      clickedSwatchRef.current = null;
    }
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
      setPickerPosition({
        top: rect.top + window.scrollY + (rect.height / 2) - 100,
        left: rect.right + window.scrollX + 15,
      });
    }
  };
  
  const handleColorSwatchClick = (role: ColorRole, event: React.MouseEvent<HTMLDivElement>) => {
    setEditingColorRole(role);
    setTempColor(colorSettings[role]);
    clickedSwatchRef.current = event.currentTarget;
    calculatePickerPosition();
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
    clickedSwatchRef.current = null;
  };
  
  const handleCancelColor = () => {
    setEditingColorRole(null);
    setPickerPosition(null);
    clickedSwatchRef.current = null;
  };
  
  useEffect(() => {
    if (editingColorRole && clickedSwatchRef.current) {
      window.addEventListener('scroll', calculatePickerPosition);
      return () => {
        window.removeEventListener('scroll', calculatePickerPosition);
      };
    }
  }, [editingColorRole]);
  
  return (
    <div className={styles.sidebar__styles}>
      <div className={styles.sidebar__stylesGroup}>
        <h3
          className={styles.sidebar__stylesTitle}
          onClick={() => togglePanel('font')}
        >
          Шрифт
          <ChevronDown
            size={20}
            className={`${styles.arrowIcon} ${expandedPanels.font ? styles.arrowIconActive : ''}`}
          />
        </h3>
        
        {expandedPanels.font && (
          <div className={styles.sidebar__fontContent} style={{ display: showFontDetails ? 'none' : 'block' }}>
            <div className={styles.sidebar__stylesGroup}>
              <label className={styles.sidebar__label}>Шрифтовая пара (заголовок)</label>
              <select
                className={styles.sidebar__select}
                value={fontSettings.titleFont}
                onChange={(e) =>
                  setFontSettings({ ...fontSettings, titleFont: e.target.value })
                }
              >
                {fontOptions.map(font => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
            </div>
            
            <div className={styles.sidebar__stylesGroup}>
              <label className={styles.sidebar__label}>Шрифтовая пара (основной текст)</label>
              <select
                className={styles.sidebar__select}
                value={fontSettings.bodyFont || fontSettings.titleFont}
                onChange={(e) =>
                  setFontSettings({ ...fontSettings, bodyFont: e.target.value })
                }
              >
                {fontOptions.map(font => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
            </div>
            
            <div className={styles.sidebar__fontExample}>
              <h4 className={styles.exampleTitle} style={{ fontFamily: fontSettings.titleFont }}>Цифровой музей</h4>
              <p className={styles.exampleText} style={{ fontFamily: fontSettings.bodyFont || fontSettings.titleFont }}>
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
                onChange={(e) =>
                  setFontSettings({ ...fontSettings, titleFont: e.target.value })
                }
              >
                {fontOptions.map(font => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
            </div>
            
            <div className={styles.fontDetail}>
              <label className={styles.sidebar__label}>ЗАГОЛОВОК (начертание)</label>
              <select
                className={styles.sidebar__fontDetailSelect}
                value={fontSettings.titleWeight || 'Normal'}
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
              <label className={styles.sidebar__label}>ОСНОВНОЙ ТЕКСТ (шрифт)</label>
              <select
                className={styles.sidebar__fontDetailSelect}
                value={fontSettings.bodyFont || 'Open Sans'}
                onChange={(e) =>
                  setFontSettings({ ...fontSettings, bodyFont: e.target.value })
                }
              >
                {fontOptions.map(font => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
            </div>
            
            <div className={styles.fontDetail}>
              <label className={styles.sidebar__label}>ОСНОВНОЙ ТЕКСТ (начертание)</label>
              <select
                className={styles.sidebar__fontDetailSelect}
                value={fontSettings.bodyWeight || 'Normal'}
                onChange={(e) =>
                  setFontSettings({ ...fontSettings, bodyWeight: e.target.value })
                }
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
              <h4 className={styles.exampleTitle} style={{ fontFamily: fontSettings.titleFont,
                fontWeight: fontSettings.titleWeight === 'Normal' ? 'normal' :
                  fontSettings.titleWeight === 'Bold' ? 'bold' :
                    fontSettings.titleWeight === 'Light' ? 300 :
                      'normal',
                fontStyle: fontSettings.titleWeight === 'Italic' ? 'italic' : 'normal',
                fontSize: `${fontSettings.fontSize * 2}px`
              }}>Подзаголовок</h4>
              <p className={styles.exampleText} style={{ fontFamily: fontSettings.bodyFont || fontSettings.titleFont,
                fontWeight: fontSettings.bodyWeight === 'Normal' ? 'normal' :
                  fontSettings.bodyWeight === 'Bold' ? 'bold' :
                    fontSettings.bodyWeight === 'Light' ? 300 :
                      'normal',
                fontStyle: fontSettings.bodyWeight === 'Italic' ? 'italic' : 'normal',
                fontSize: `${fontSettings.fontSize}px`
              }}>ПРИМЕР ВЫБРАННЫХ ШРИФТОВ</p>
              <p className={styles.exampleText} style={{ fontFamily: fontSettings.bodyFont || fontSettings.titleFont,
                fontWeight: fontSettings.bodyWeight === 'Normal' ? 'normal' :
                  fontSettings.bodyWeight === 'Bold' ? 'bold' :
                    fontSettings.bodyWeight === 'Light' ? 300 :
                      'normal',
                fontStyle: fontSettings.bodyWeight === 'Italic' ? 'italic' : 'normal',
                fontSize: `${fontSettings.fontSize}px`
              }}>Цифровой музей</p>
              <p className={styles.exampleText} style={{ fontFamily: fontSettings.bodyFont || fontSettings.titleFont,
                fontWeight: fontSettings.bodyWeight === 'Normal' ? 'normal' :
                  fontSettings.bodyWeight === 'Bold' ? 'bold' :
                    fontSettings.bodyWeight === 'Light' ? 300 :
                      'normal',
                fontStyle: fontSettings.bodyWeight === 'Italic' ? 'italic' : 'normal',
                fontSize: `${fontSettings.fontSize * 0.9}px`
              }}>
                Искусство становится ближе — исследуйте коллекции онлайн в любое
                время.
              </p>
            </div>
          </div>
        )}
      </div>
      
      <div className={styles.sidebar__stylesGroup}>
        <h3
          className={styles.sidebar__stylesTitle}
          onClick={() => togglePanel('color')}
        >
          Цвет
          <ChevronDown
            size={20}
            className={`${styles.arrowIcon} ${expandedPanels.color ? styles.arrowIconActive : ''}`}
          />
        </h3>
        
        {expandedPanels.color && (
          <>
            <div className={styles.sidebar__colorScheme}>
              <h4 className={styles.sidebar__colorSchemeTitle}>
                ТЕКУЩАЯ ПАЛИТРА
              </h4>
              
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
              
              {editingColorRole && pickerPosition && (
                <div
                  className={styles.colorPickerPopover}
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
                      onChange={setTempColor}
                      className={styles.hexColorPicker}
                    />
                    <div className={styles.colorCodeSection}>
                      Цветовой код
                      <HexColorInput
                        color={tempColor}
                        onChange={setTempColor}
                        className={styles.hexColorInput}
                      />
                    </div>
                    <button onClick={handleConfirmColor} className={styles.confirmColorButton}>ОК</button>
                  </div>
                </div>
              )}
              
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
