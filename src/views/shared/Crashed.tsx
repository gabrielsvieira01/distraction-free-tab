import React, { FC } from "react";
import { FormattedMessage } from "react-intl";
import { FallbackProps } from "react-error-boundary";

import { ui } from "../../locales/interface";
import { Icon } from "./icons";

const Crashed: FC<FallbackProps> = () => (
  <div className="Crashed">
    <Icon name="alert-triangle" /> <FormattedMessage {...ui.pluginQuebrou} />
  </div>
);

export default Crashed;
