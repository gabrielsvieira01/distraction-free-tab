import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { ui } from "../../../locales/interface";
import { useObjectUrls } from "../../../hooks";
import { IconButton, RemoveIcon } from "../../../views/shared";
import "./ImageSettings.sass";
import { defaultCache, Props } from "./types";

const ImageSettings: React.FC<Props> = ({ cache = defaultCache, setCache }) => {
  const intl = useIntl();
  const urls = useObjectUrls(cache);

  const addImages = (files: FileList) =>
    setCache(cache.concat(Array.from(files)));

  const removeImage = (index: number) =>
    setCache(cache.filter((_, i) => index !== i));

  const largeImages = cache.some((image) => image.size > 2097152);

  return (
    <div className="ImageSettings">
      <label>
        <input
          accept="image/*"
          multiple={true}
          onChange={(event) =>
            event.target.files && addImages(event.target.files)
          }
          type="file"
        />
      </label>

      <div className="grid">
        {urls &&
          urls.map((url, index) => (
            <div className="preview" key={index}>
              <img src={url} />
              <IconButton
                onClick={() => removeImage(index)}
                title={intl.formatMessage(ui.removerImagem)}
              >
                <RemoveIcon />
              </IconButton>
            </div>
          ))}
      </div>

      {largeImages && (
        <p className="info">
          <FormattedMessage {...ui.imagensGrandes} />
        </p>
      )}

      <p className="info">
        <FormattedMessage {...ui.imagensNaoSincronizam} />
      </p>
    </div>
  );
};

export default ImageSettings;
