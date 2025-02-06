import { useEffect, useState } from "react";
import styles from "./ChipsInput.module.scss";

export const useSelectedChips = (
  initialChips: string[],
  onChange: (value: string) => void,
) => {
  const [selectedChips, setSelectedChips] = useState<Set<number>>(new Set());
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);

  const handleMouseDown = () => {
    setIsMouseDown(true);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseMove = (index: number) => {
    if (isMouseDown) {
      setSelectedChips((prevSelectedChips) =>
        new Set(prevSelectedChips).add(index),
      );
    }
  };

  const handleDeleteSelectedChips = () => {
    const remainingChips = initialChips.filter(
      (_, index) => !selectedChips.has(index),
    );
    setSelectedChips(new Set());
    onChange(remainingChips.join(", "));
  };

  const handleDeleteKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Delete" && selectedChips.size > 0) {
      handleDeleteSelectedChips();
      e.stopPropagation();
    }
  };

  useEffect(() => {
    const handleDocumentClick: EventListener = (e) => {
      if (
        !(e.target instanceof HTMLElement) ||
        !e.target.closest(`.${styles.chipsContainer}`)
      ) {
        setSelectedChips(new Set());
      }
    };
    document.addEventListener("click", handleDocumentClick);
    document.addEventListener("keydown", handleDeleteKeyPress);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
      document.removeEventListener("keydown", handleDeleteKeyPress);
    };
  }, [selectedChips]);

  return {
    selectedChips,
    handleMouseUp,
    handleMouseDown,
    handleMouseMove,
    handleDeleteKeyPress,
    handleDeleteSelectedChips,
  };
};
