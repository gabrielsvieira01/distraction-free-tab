import { useIntl } from "react-intl";
import { Config } from "../plugins/types";
import { plugins } from "./interface";

/** Nome e descrição de um widget ou fundo, no idioma atual */
export function usePluginText() {
  const intl = useIntl();
  return {
    nome: (config: Config) =>
      plugins[config.key] ? intl.formatMessage(plugins[config.key].nome) : config.name,
    descricao: (config: Config) =>
      plugins[config.key]
        ? intl.formatMessage(plugins[config.key].descricao)
        : config.description,
  };
}
