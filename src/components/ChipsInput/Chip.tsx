import { ChangeEvent, KeyboardEvent, MouseEvent } from "react";
import styles from "./Chip.module.scss";
import { IoCloseSharp } from "react-icons/io5";

type СhipProps = {
  index: number;
  chip: string;
  editedChips: string[];
  setEditedChips: React.Dispatch<React.SetStateAction<string[]>>;
  onChange: (value: string) => void;
  isSelected: boolean;
  selectedChips: Set<number>;
  handleMouseMove: (e: MouseEvent, index: number) => void;
};
export const Chip: React.FC<СhipProps> = ({
  index,
  chip,
  editedChips,
  setEditedChips,
  onChange,
  isSelected,
  handleMouseMove,
  selectedChips,
}) => {
  const updateChips = (updatedChips: string[]) => {
    setEditedChips(updatedChips);
    onChange(updatedChips.join(", "));
  };

  const handleChipBlur = () => {
    const updatedChips = [...editedChips]
      .join(", ")
      .split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/)
      .map((chip) => chip.trim())
      .filter(Boolean);

    updateChips(updatedChips);
  };

  const handleChipChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const updatedChips = [...editedChips];
    updatedChips[index] = e.target.value;
    setEditedChips(updatedChips);
    if (e.target.value.trim() === "") {
      updatedChips.splice(index, 1);
      updateChips(updatedChips);
    }
  };

  const handleKeyChipPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Delete" && selectedChips.size > 0) {
      e.preventDefault();
    }
  };

  const handleChipDelete = (index: number) => {
    const updatedChips = editedChips.filter((_, i) => i !== index);
    updateChips(updatedChips);
  };

  return (
    <div
      key={index}
      onMouseMove={(e: MouseEvent) => handleMouseMove(e, index)}
      className={`${styles.chipContainer} ${isSelected ? styles.selected : ""}`}
    >
      <input
        className={styles.chip}
        type="text"
        value={chip}
        onChange={(e) => handleChipChange(e, index)}
        onBlur={handleChipBlur}
        onKeyDown={handleKeyChipPress}
        onMouseMove={(e) => {
          e.stopPropagation();
        }}
        size={chip.length + 1}
      />
      <button
        className={styles.deleteButton}
        onClick={() => handleChipDelete(index)}
      >
        <IoCloseSharp fontSize={28} />
      </button>
    </div>
  );
};
