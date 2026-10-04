import React from "react";
import { useIntl } from "react-intl";
import { ui } from "../../locales/interface";

const Persist: React.FC = () => {
  const intl = useIntl();
  const [error, setError] = React.useState(false);
  const [persisted, setPersisted] = React.useState(true); // Hide until we know otherwise

  React.useEffect(() => {
    if (navigator.storage) navigator.storage.persisted().then(setPersisted);
  }, []);

  if (persisted) return null;

  const handleClick = () => {
    navigator.storage
      .persist()
      .then((persisted) =>
        persisted ? setPersisted(persisted) : setError(true),
      );
  };

  return (
    <div className="Widget" style={{ textAlign: "center" }}>
      <h4>{intl.formatMessage(ui.persistirTitulo)}</h4>
      <p>{intl.formatMessage(ui.persistirPergunta)}</p>
      {error ? (
        <p>{intl.formatMessage(ui.persistirFalhou)}</p>
      ) : (
        <button className="button button--primary" onClick={handleClick}>
          {intl.formatMessage(ui.persistirTitulo)}
        </button>
      )}
    </div>
  );
};

export default Persist;
