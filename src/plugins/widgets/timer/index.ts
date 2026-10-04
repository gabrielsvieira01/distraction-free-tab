import { plugins } from "../../../locales/interface";
import { Config } from "../../types";
import Timer from "./Timer";
import TimerSettings from "./TimerSettings";

const config: Config = {
  key: "widget/timer",
  name: plugins["widget/timer"].nome.defaultMessage,
  description: plugins["widget/timer"].descricao.defaultMessage,
  dashboardComponent: Timer,
  settingsComponent: TimerSettings,
};

export default config;
