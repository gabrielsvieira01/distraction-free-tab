import React from "react";
import { useIntl } from "react-intl";
import { ui } from "../../locales/interface";
import Modal from "./modal/Modal";

type Props = {
  onClose: () => void;
};

const StoreError: React.FC<Props> = ({ onClose }) => {
  const intl = useIntl();
  return (
    <Modal onClose={onClose}>
      <div className="Settings">
        <h2 style={{ margin: 0 }}>{intl.formatMessage(ui.erroArmazenamento)}</h2>
        <p style={{ fontSize: "1.25em" }}>
          {intl.formatMessage(ui.erroArmazenamentoTexto)}
        </p>
        <p>{intl.formatMessage(ui.erroArmazenamentoDica)}</p>
      </div>
    </Modal>
  );
};

export default StoreError;
