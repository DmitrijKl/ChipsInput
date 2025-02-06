import React, { useState, ChangeEvent, KeyboardEvent, useEffect } from "react";
import styles from "./ChipsInput.module.scss";
import { Chip } from "./Chip";
import { useSelectedChips } from "./useSelectedChips";

interface ChipsInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const ChipsInput: React.FC<ChipsInputProps> = ({ value, onChange }) => {
  const chips = value
    .split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/)
    .map((chip) => chip.trim())
    .filter(Boolean);
  const [inputValue, setInputValue] = useState<string>("");
  const [isInQuotes, setIsInQuotes] = useState<boolean>(false);
  const [isWarningVisible, setIsWarningVisible] = useState<boolean>(false);
  const [editedChips, setEditedChips] = useState<string[]>(chips);
  const { selectedChips, handleMouseMove, handleMouseDown, handleMouseUp } =
    useSelectedChips(chips, onChange);

  useEffect(() => {
    setEditedChips(chips);
  }, [value]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newInputValue = e.target.value;
    if (newInputValue.trim().startsWith(",")) {
      return;
    }
    setInputValue(newInputValue);
    const quoteCount = (newInputValue.match(/"/g) || []).length;
    setIsInQuotes(quoteCount % 2 !== 0);
  };

  const handleInputKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    const trimmedValue = inputValue.trim();
    if (e.key === "," && trimmedValue && !isInQuotes) {
      setIsWarningVisible(false);
      const newChipsValue = value ? `${value}, ${trimmedValue}` : trimmedValue;
      onChange(newChipsValue);
      setInputValue("");
    }
  };

  const handleInputKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Backspace" || e.key === "Delete") && inputValue === "") {
      const updatedChips = [...editedChips];
      updatedChips.pop();
      onChange(updatedChips.join(", "));
    }
  };

  const handleInputBlur = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue) {
      if (isInQuotes) {
        setIsWarningVisible(true);
      } else {
        const newChipsValue = value
          ? `${value}, ${trimmedValue}`
          : trimmedValue;
        onChange(newChipsValue);
        setInputValue("");
        setIsWarningVisible(false);
      }
    }
  };

  return (
    <div className={styles.root}>
      <div
        className={styles.chipsInputContainer}
        onMouseUp={handleMouseUp}
        onMouseDown={handleMouseDown}
      >
        <div className={styles.chipsContainer}>
          {editedChips.map((chip, index) => (
            <Chip
              key={index}
              index={index}
              chip={chip}
              selectedChips={selectedChips}
              editedChips={editedChips}
              setEditedChips={setEditedChips}
              onChange={onChange}
              isSelected={selectedChips.has(index)}
              handleMouseMove={handleMouseMove}
            />
          ))}
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={(e) => {
              handleInputKeyUp(e);
              handleInputKeyPress(e);
            }}
            size={chips.length === 0 ? undefined : inputValue.length + 1}
            placeholder={chips.length === 0 ? "Введите ключевые слова" : ""}
            className={styles.inputField}
          />
        </div>
      </div>
      {isWarningVisible && (
        <p className={styles.warning}>Закройте кавычки с двух сторон</p>
      )}
    </div>
  );
};

export default ChipsInput;
