import { MouseEvent, useEffect, useState } from "react";
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

  const handleMouseMove = (e: MouseEvent, index: number) => {
    e.preventDefault();
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
    const handleEscapeClearSelectedChips = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedChips(new Set());
      }
    };
    const handleClickClearSelectedChips: EventListener = (e) => {
      if (
        !(e.target instanceof HTMLElement) ||
        !e.target.closest(`.${styles.chipsContainer}`)
      ) {
        setSelectedChips(new Set());
      }
    };
    document.addEventListener("click", handleClickClearSelectedChips);
    document.addEventListener("keydown", handleDeleteKeyPress);
    document.addEventListener("keydown", handleEscapeClearSelectedChips);

    return () => {
      document.removeEventListener("click", handleClickClearSelectedChips);
      document.removeEventListener("keydown", handleDeleteKeyPress);
      document.removeEventListener("keydown", handleEscapeClearSelectedChips);
    };
  }, [selectedChips]);

  return {
    selectedChips,
    handleMouseUp,
    handleMouseDown,
    handleMouseMove,
  };
};
