import React from "react";
import { useIntl } from "react-intl";
import { ErrorContext } from "../../contexts/error";
import { ui } from "../../locales/interface";
import Modal from "./modal/Modal";

type Props = {
  onClose: () => void;
};

const Errors: React.FC<Props> = ({ onClose }) => {
  const { errors } = React.useContext(ErrorContext);
  const intl = useIntl();
  return (
    <Modal onClose={onClose}>
      <div className="Settings">
        <h2 style={{ margin: 0 }}>{intl.formatMessage(ui.erros)}</h2>
        {errors.map((error, index) => (
          <div key={index} className="Widget">
            {error.message}
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default Errors;
