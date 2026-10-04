/**
 * Textos da interface herdada do Tabliss que ele deixava fixos em inglês.
 * Traduções em src/locales/lang/<idioma>.json, com os mesmos ids.
 */
type Mensagem = { id: string; defaultMessage: string };

const m = <T extends Record<string, Mensagem>>(mensagens: T) => mensagens;

export const ui = m({
  // Configurações gerais
  idioma: { id: "ui.settings.language", defaultMessage: "Language" },
  fusoHorario: { id: "ui.settings.timeZone", defaultMessage: "Time zone" },
  fusoAutomatico: { id: "ui.timeZone.automatic", defaultMessage: "Automatic" },
  carregando: { id: "ui.loading", defaultMessage: "Loading…" },
  importarExportar: {
    id: "ui.settings.importExport",
    defaultMessage: "{import}, {export} or {reset} your settings",
  },
  importar: { id: "ui.settings.import", defaultMessage: "Import" },
  exportar: { id: "ui.settings.export", defaultMessage: "export" },
  redefinir: { id: "ui.settings.reset", defaultMessage: "reset" },
  confirmarRedefinir: {
    id: "ui.settings.resetConfirm",
    defaultMessage:
      "Are you sure you want to delete all of your settings? This cannot be undone.",
  },
  importacaoInvalida: {
    id: "ui.settings.importInvalid",
    defaultMessage: "Invalid import file: {error}",
  },
  erroDesconhecido: { id: "ui.unknownError", defaultMessage: "Unknown error" },
  persistirTitulo: { id: "ui.persist.title", defaultMessage: "Keep settings" },
  persistirPergunta: {
    id: "ui.persist.question",
    defaultMessage:
      "Would you like to ask your browser to keep your settings permanently?",
  },
  persistirFalhou: {
    id: "ui.persist.failed",
    defaultMessage: "Your settings could not be kept permanently right now.",
  },

  // Lista de widgets e cartão de cada widget
  adicionarWidget: { id: "ui.widgets.add", defaultMessage: "Add a new widget" },
  removerWidget: { id: "ui.widget.remove", defaultMessage: "Remove widget" },
  editarWidget: { id: "ui.widget.edit", defaultMessage: "Edit widget settings" },
  fecharWidget: { id: "ui.widget.close", defaultMessage: "Close widget settings" },
  descerWidget: { id: "ui.widget.moveDown", defaultMessage: "Move widget down" },
  subirWidget: { id: "ui.widget.moveUp", defaultMessage: "Move widget up" },
  abrirExibicao: { id: "ui.section.displayOpen", defaultMessage: "Open display settings" },
  fecharExibicao: { id: "ui.section.displayClose", defaultMessage: "Close display settings" },
  abrirFonte: { id: "ui.section.fontOpen", defaultMessage: "Open font settings" },
  fecharFonte: { id: "ui.section.fontClose", defaultMessage: "Close font settings" },
  posicao: { id: "ui.display.position", defaultMessage: "Position" },
  tamanho: { id: "ui.display.size", defaultMessage: "Size" },
  fonte: { id: "ui.font.font", defaultMessage: "Font" },
  padrao: { id: "ui.default", defaultMessage: "Default" },
  outra: { id: "ui.font.other", defaultMessage: "Other…" },
  nomeDaFonte: { id: "ui.font.name", defaultMessage: "Font name" },
  exemploFonte: {
    id: "ui.font.placeholder",
    defaultMessage: "Exact name of an installed font",
  },
  peso: { id: "ui.font.weight", defaultMessage: "Weight" },
  pesoFino: { id: "ui.font.weight.thin", defaultMessage: "Thin" },
  pesoLeve: { id: "ui.font.weight.light", defaultMessage: "Light" },
  pesoNormal: { id: "ui.font.weight.regular", defaultMessage: "Regular" },
  pesoMedio: { id: "ui.font.weight.medium", defaultMessage: "Medium" },
  pesoNegrito: { id: "ui.font.weight.bold", defaultMessage: "Bold" },
  pesoPreto: { id: "ui.font.weight.black", defaultMessage: "Black" },
  cor: { id: "ui.colour", defaultMessage: "Colour" },

  // Fundo
  desfoque: { id: "ui.background.blur", defaultMessage: "Blur" },
  luminosidade: { id: "ui.background.luminosity", defaultMessage: "Luminosity" },
  escurecer: { id: "ui.background.darken", defaultMessage: "Darken" },
  clarear: { id: "ui.background.lighten", defaultMessage: "Lighten" },
  corInicial: { id: "ui.gradient.from", defaultMessage: "From colour" },
  corFinal: { id: "ui.gradient.to", defaultMessage: "To colour" },
  angulo: { id: "ui.gradient.angle", defaultMessage: "Angle (0–360)" },
  removerImagem: { id: "ui.image.remove", defaultMessage: "Remove image" },
  imagensGrandes: {
    id: "ui.image.large",
    defaultMessage: "Large images may affect performance.",
  },
  imagensNaoSincronizam: {
    id: "ui.image.noSync",
    defaultMessage: "Images do not sync between devices.",
  },
  pausado: { id: "ui.unsplash.paused", defaultMessage: "(Paused)" },
  novaFoto: { id: "ui.unsplash.showNew", defaultMessage: "Show a new photo" },
  cadaAba: { id: "ui.unsplash.everyTab", defaultMessage: "Every new tab" },
  cada5Min: { id: "ui.unsplash.every5Minutes", defaultMessage: "Every 5 minutes" },
  cada15Min: { id: "ui.unsplash.every15Minutes", defaultMessage: "Every 15 minutes" },
  cadaHora: { id: "ui.unsplash.everyHour", defaultMessage: "Every hour" },
  cadaDia: { id: "ui.unsplash.everyDay", defaultMessage: "Every day" },
  cadaSemana: { id: "ui.unsplash.everyWeek", defaultMessage: "Every week" },
  colecaoOficial: { id: "ui.unsplash.official", defaultMessage: "Official collection" },
  tema: { id: "ui.unsplash.topic", defaultMessage: "Topic" },
  pesquisa: { id: "ui.unsplash.search", defaultMessage: "Search" },
  colecao: { id: "ui.unsplash.collection", defaultMessage: "Collection" },
  etiquetas: { id: "ui.unsplash.tags", defaultMessage: "Tags" },
  exemploEtiquetas: {
    id: "ui.unsplash.tagsPlaceholder",
    defaultMessage: "Try landscapes or animals…",
  },
  soDestaques: { id: "ui.unsplash.featured", defaultMessage: "Only featured images" },
  idDaColecao: { id: "ui.unsplash.collectionId", defaultMessage: "Collection ID number" },

  // Widgets do Tabliss
  nome: { id: "ui.name", defaultMessage: "Name" },
  colunas: { id: "ui.links.columns", defaultMessage: "Number of columns" },
  linksSempreVisiveis: {
    id: "ui.links.alwaysVisible",
    defaultMessage: "Links are always visible",
  },
  linksNovaAba: { id: "ui.links.newTab", defaultMessage: "Links open in a new tab" },
  adicionarLink: { id: "ui.links.add", defaultMessage: "Add link" },
  removerLink: { id: "ui.links.remove", defaultMessage: "Remove link" },
  descerLink: { id: "ui.links.moveDown", defaultMessage: "Move link down" },
  subirLink: { id: "ui.links.moveUp", defaultMessage: "Move link up" },
  atalho: { id: "ui.links.shortcutNumber", defaultMessage: "Keyboard shortcut {number}" },
  atalhoSemNumero: { id: "ui.links.shortcut", defaultMessage: "Shortcut" },
  endereco: { id: "ui.links.url", defaultMessage: "URL" },
  opcional: { id: "ui.optional", defaultMessage: "(optional)" },
  icone: { id: "ui.links.icon", defaultMessage: "Icon" },
  nenhum: { id: "ui.none", defaultMessage: "None" },
  iconeDoSite: { id: "ui.links.favicon", defaultMessage: "Website icon" },
  mostrarLinks: { id: "ui.links.show", defaultMessage: "Show quick links" },
  buscador: { id: "ui.search.provider", defaultMessage: "Search provider" },
  sugestoes: { id: "ui.search.suggestions", defaultMessage: "Suggestions provider" },
  desligado: { id: "ui.off", defaultMessage: "Off" },
  quantidadeSugestoes: {
    id: "ui.search.suggestionsQuantity",
    defaultMessage: "Number of suggestions",
  },
  nomeOpcional: { id: "ui.time.namePlaceholder", defaultMessage: "Optional name" },
  analogico: { id: "ui.time.analogue", defaultMessage: "Analogue" },
  digital12: { id: "ui.time.digital12", defaultMessage: "12-hour digital" },
  digital24: { id: "ui.time.digital24", defaultMessage: "24-hour digital" },
  mostrarSegundos: { id: "ui.time.seconds", defaultMessage: "Display seconds" },
  mostrarMinutos: { id: "ui.time.minutes", defaultMessage: "Display minutes" },
  mostrarPeriodo: { id: "ui.time.dayPeriod", defaultMessage: "Display day period" },
  mostrarData: { id: "ui.time.date", defaultMessage: "Display date" },

  // Erros
  erros: { id: "ui.errors.title", defaultMessage: "Errors" },
  erroArmazenamento: { id: "ui.storeError.title", defaultMessage: "Storage error" },
  erroArmazenamentoTexto: {
    id: "ui.storeError.body",
    defaultMessage:
      "Your settings can't be loaded or saved. This usually happens in private browsing, but low disk space or a damaged browser profile can also cause it.",
  },
  erroArmazenamentoDica: {
    id: "ui.storeError.hint",
    defaultMessage:
      "If you had settings saved, it may be temporary. Try restarting the browser and check whether they come back.",
  },
  pluginQuebrou: {
    id: "ui.crashed",
    defaultMessage: "Sorry, this widget has crashed.",
  },
});

/** Nome e descrição de cada widget e fundo, pela chave do plugin */
export const plugins: Record<string, { nome: Mensagem; descricao: Mensagem }> = {
  "background/colour": {
    nome: { id: "plugin.colour.name", defaultMessage: "Solid colour" },
    descricao: { id: "plugin.colour.description", defaultMessage: "Add a splash of colour." },
  },
  "background/gradient": {
    nome: { id: "plugin.gradient.name", defaultMessage: "Colour gradient" },
    descricao: { id: "plugin.gradient.description", defaultMessage: "Add more splashes of colour." },
  },
  "background/image": {
    nome: { id: "plugin.image.name", defaultMessage: "Upload images" },
    descricao: { id: "plugin.image.description", defaultMessage: "See your own images." },
  },
  "background/unsplash": {
    nome: { id: "plugin.unsplash.name", defaultMessage: "Unsplash" },
    descricao: {
      id: "plugin.unsplash.description",
      defaultMessage: "Who has time to find their own images?",
    },
  },
  "widget/greeting": {
    nome: { id: "plugin.greeting.name", defaultMessage: "Greeting" },
    descricao: { id: "plugin.greeting.description", defaultMessage: "Be personally greeted all day." },
  },
  "widget/links": {
    nome: { id: "plugin.links.name", defaultMessage: "Quick links" },
    descricao: { id: "plugin.links.description", defaultMessage: "I heard you like bookmarks." },
  },
  "widget/search": {
    nome: { id: "plugin.search.name", defaultMessage: "Search box" },
    descricao: { id: "plugin.search.description", defaultMessage: "Move your URL bar." },
  },
  "widget/time": {
    nome: { id: "plugin.time.name", defaultMessage: "Time" },
    descricao: { id: "plugin.time.description", defaultMessage: "Be on time." },
  },
  "widget/bloqueio": {
    nome: { id: "plugin.blocker.name", defaultMessage: "Site blocker" },
    descricao: {
      id: "plugin.blocker.description",
      defaultMessage: "Block sites on a schedule, with daily limits or right now.",
    },
  },
  "widget/timer": {
    nome: { id: "plugin.timer.name", defaultMessage: "Timer" },
    descricao: {
      id: "plugin.timer.description",
      defaultMessage: "A simple countdown that keeps running when the tab is closed.",
    },
  },
};

/** Temas do Unsplash, pelo id do tema (src/plugins/backgrounds/unsplash/topics.json) */
export const temasUnsplash: Record<string, Mensagem> = {
  "bo8jQKTaE0Y": { id: "topic.wallpapers", defaultMessage: "Wallpapers" },
  "BJJMtteDJA4": { id: "topic.currentEvents", defaultMessage: "Current events" },
  "wnzpLxs0nQY": { id: "topic.actForNature", defaultMessage: "Act for nature" },
  "9QVREH9A3DU": { id: "topic.entrepreneur", defaultMessage: "Entrepreneur" },
  "CDwuwXJAbEw": { id: "topic.3dRenders", defaultMessage: "3D renders" },
  "iUIsnVtjB0Y": { id: "topic.textures", defaultMessage: "Textures & patterns" },
  "qPYsDzvJOYc": { id: "topic.experimental", defaultMessage: "Experimental" },
  "rnSKDHwwYUk": { id: "topic.architecture", defaultMessage: "Architecture" },
  "6sMVjTLSkeQ": { id: "topic.nature", defaultMessage: "Nature" },
  "aeu6rL-j6ew": { id: "topic.business", defaultMessage: "Business & work" },
  "S4MKLAsBB74": { id: "topic.fashion", defaultMessage: "Fashion" },
  "hmenvQhUmxM": { id: "topic.film", defaultMessage: "Film" },
  "xjPR4hlkBGA": { id: "topic.food", defaultMessage: "Food & drink" },
  "_hb-dl4Q-4U": { id: "topic.health", defaultMessage: "Health & wellness" },
  "towJZFskpGg": { id: "topic.people", defaultMessage: "People" },
  "R_Fyn-Gwtlw": { id: "topic.interiors", defaultMessage: "Interiors" },
  "xHxYTMHLgOc": { id: "topic.street", defaultMessage: "Street photography" },
  "Fzo3zuOHN6w": { id: "topic.travel", defaultMessage: "Travel" },
  "Jpg6Kidl-Hk": { id: "topic.animals", defaultMessage: "Animals" },
  "_8zFHuhRhyo": { id: "topic.spirituality", defaultMessage: "Spirituality" },
  "bDo48cUhwnY": { id: "topic.arts", defaultMessage: "Arts & culture" },
  "dijpbw99kQQ": { id: "topic.history", defaultMessage: "History" },
  "Bn-DjrcBrwo": { id: "topic.athletics", defaultMessage: "Athletics" },
  "c7USHrQ0Ljw": { id: "topic.covid", defaultMessage: "COVID-19" },
  "M8jVbLbTRws": { id: "topic.architectureInterior", defaultMessage: "Architecture & interior" },
};
