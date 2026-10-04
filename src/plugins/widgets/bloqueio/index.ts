import { plugins } from "../../../locales/interface";
import { Config } from "../../types";
import Bloqueio from "./Bloqueio";
import BloqueioSettings from "./BloqueioSettings";

const config: Config = {
  key: "widget/bloqueio",
  name: plugins["widget/bloqueio"].nome.defaultMessage,
  description: plugins["widget/bloqueio"].descricao.defaultMessage,
  dashboardComponent: Bloqueio,
  settingsComponent: BloqueioSettings,
};

export default config;
