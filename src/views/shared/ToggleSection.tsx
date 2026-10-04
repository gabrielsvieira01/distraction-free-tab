import React from "react";
import { useToggle } from "../../hooks";

type Props = {
  children: React.ReactNode;
  abrir: string;
  fechar: string;
};

const ToggleSection: React.FC<Props> = ({ abrir, fechar, children }) => {
  const [isOpen, toggleOpen] = useToggle();

  return (
    <>
      <p>
        <a onClick={toggleOpen}>{isOpen ? fechar : abrir}</a>
      </p>

      {isOpen && children}
    </>
  );
};

export default ToggleSection;
