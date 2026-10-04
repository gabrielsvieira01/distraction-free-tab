/**
 * Textos do Distraction-Free Tab (bloqueio, timer, atrito). Inglês é o padrão;
 * as traduções ficam em src/locales/lang/<idioma>.json, com os mesmos ids,
 * junto das do Tabliss. Datas, horas, dias da semana e "25 min" vêm do Intl.
 */
export type Mensagem = { id: string; defaultMessage: string };

const m = <T extends Record<string, Mensagem>>(mensagens: T) => mensagens;

export const mensagens = m({
  // Widget de bloqueio
  soNaExtensao: {
    id: "foco.extensionOnly",
    defaultMessage: "Only available in the browser extension.",
  },
  semRegras: {
    id: "foco.blocker.noRules",
    defaultMessage: "No blocking rules yet. Add some in this widget's settings.",
  },
  ate: { id: "foco.until", defaultMessage: "until {time}" },
  ateEncerrar: { id: "foco.untilEnded", defaultMessage: "until you end it" },
  usoDoLimite: { id: "foco.blocker.usage", defaultMessage: "{used} of {limit}" },
  furosHoje: {
    id: "foco.blocker.overridesToday",
    defaultMessage:
      "{count, plural, one {# override today} other {# overrides today}}",
  },
  bloquearAgora: { id: "foco.blockNow", defaultMessage: "Block now:" },
  ateDesligar: { id: "foco.blockNow.untilOff", defaultMessage: "until I turn it off" },
  bloqueioImediato: { id: "foco.blockNow.running", defaultMessage: "Blocking now" },
  encerrar: { id: "foco.blockNow.end", defaultMessage: "end" },

  // Opções do widget de bloqueio
  porHorario: { id: "foco.rules.schedule", defaultMessage: "Block on a schedule" },
  sitesUmPorLinha: { id: "foco.rules.sites", defaultMessage: "Sites (one per line)" },
  exemploSites: { id: "foco.rules.sitesExample", defaultMessage: "e.g. youtube.com" },
  das: { id: "foco.rules.from", defaultMessage: "from" },
  as: { id: "foco.rules.to", defaultMessage: "to" },
  atravessaMeiaNoite: {
    id: "foco.rules.overnight",
    defaultMessage: "Runs past midnight and ends the next day.",
  },
  ativa: { id: "foco.rules.active", defaultMessage: "Active" },
  remover: { id: "foco.rules.remove", defaultMessage: "Remove" },
  adicionarHorario: { id: "foco.rules.addSchedule", defaultMessage: "Add schedule" },
  limiteDiario: { id: "foco.rules.dailyLimit", defaultMessage: "Daily limit" },
  site: { id: "foco.rules.site", defaultMessage: "Site" },
  minutosPorDia: { id: "foco.rules.minutesPerDay", defaultMessage: "Minutes per day" },
  adicionarLimite: { id: "foco.rules.addLimit", defaultMessage: "Add limit" },
  regrasTrancadas: {
    id: "foco.rules.locked",
    defaultMessage: "Rules are locked so they can't be loosened on impulse.",
  },
  destrancar: { id: "foco.rules.unlock", defaultMessage: "Unlock editing" },
  destrancadaAte: {
    id: "foco.rules.unlockedUntil",
    defaultMessage: "Editing unlocked until {time}.",
  },
  trancarAgora: { id: "foco.rules.lockNow", defaultMessage: "Lock now" },

  // Atrito (furar, encerrar, destrancar)
  instrucaoFuro: {
    id: "foco.friction.unlockSite",
    defaultMessage: "To unlock this site for {duration}, type the phrase below:",
  },
  instrucaoEncerrar: {
    id: "foco.friction.endEarly",
    defaultMessage: "To end it early, type the phrase below:",
  },
  instrucaoEditar: {
    id: "foco.friction.editRules",
    defaultMessage: "To edit the rules, type the phrase below:",
  },
  rotuloFrase: { id: "foco.friction.inputLabel", defaultMessage: "Type the phrase" },
  ou: { id: "foco.friction.or", defaultMessage: "or" },
  prefiroEsperar: {
    id: "foco.friction.wait",
    defaultMessage: "I'd rather wait {seconds} seconds",
  },
  aguarde: {
    id: "foco.friction.waiting",
    defaultMessage: "Wait {seconds} s (paused while you're on another tab)",
  },
  esperaConcluida: { id: "foco.friction.waitDone", defaultMessage: "Wait complete" },
  frase1: {
    id: "foco.phrase.1",
    defaultMessage: "I chose to open this site even though I blocked it",
  },
  frase2: {
    id: "foco.phrase.2",
    defaultMessage: "this can wait until I finish what I was doing",
  },
  frase3: {
    id: "foco.phrase.3",
    defaultMessage: "I am breaking my own block on purpose",
  },
  frase4: {
    id: "foco.phrase.4",
    defaultMessage: "in five minutes I will get back to what matters",
  },
  frase5: {
    id: "foco.phrase.5",
    defaultMessage: "I know exactly what I came here for",
  },
  fraseEncerrar: {
    id: "foco.phrase.end",
    defaultMessage: "I am ending my focus session on purpose",
  },
  fraseEditar: {
    id: "foco.phrase.edit",
    defaultMessage: "I am loosening my own rules on purpose",
  },

  // Página de bloqueio
  tituloBloqueado: { id: "foco.blocked.title", defaultMessage: "Blocked" },
  motivoHorario: {
    id: "foco.blocked.schedule",
    defaultMessage: "Blocked on a schedule until {time}.",
  },
  motivoAgoraAte: {
    id: "foco.blocked.blockNow",
    defaultMessage: "Blocked by a block-now session until {time}.",
  },
  motivoAgoraAberto: {
    id: "foco.blocked.blockNowOpen",
    defaultMessage: "Blocked by a block-now session until you end it.",
  },
  motivoLimite: {
    id: "foco.blocked.limit",
    defaultMessage: "Daily limit of {limit} reached ({used} today).",
  },
  liberar: { id: "foco.blocked.unlock", defaultMessage: "Unlock for {duration}" },
  vezesFurou: {
    id: "foco.blocked.overridesToday",
    defaultMessage:
      "{count, plural, one {You overrode a block # time today.} other {You overrode a block # times today.}}",
  },
  naoBloqueado: {
    id: "foco.blocked.free",
    defaultMessage: "This site isn't blocked anymore.",
  },
  abrirSite: { id: "foco.blocked.openSite", defaultMessage: "Open the site" },
  tituloEncerrar: { id: "foco.end.title", defaultMessage: "End block-now session" },
  ligadaAte: { id: "foco.end.runningUntil", defaultMessage: "Running until {time}." },
  ligadaAberta: { id: "foco.end.runningOpen", defaultMessage: "Running until you end it." },
  botaoEncerrar: { id: "foco.end.button", defaultMessage: "End session" },
  nenhumaLigada: { id: "foco.end.none", defaultMessage: "No block-now session is running." },
  voltarNovaAba: { id: "foco.end.back", defaultMessage: "Back to the new tab" },

  // Timer
  iniciar: { id: "foco.timer.start", defaultMessage: "Start" },
  pausar: { id: "foco.timer.pause", defaultMessage: "Pause" },
  continuar: { id: "foco.timer.resume", defaultMessage: "Resume" },
  zerar: { id: "foco.timer.reset", defaultMessage: "Reset" },
  duracaoTimer: { id: "foco.timer.minutes", defaultMessage: "Minutes" },
  tempoEsgotado: { id: "foco.timer.doneTitle", defaultMessage: "Time's up" },
  timerTerminou: {
    id: "foco.timer.doneBody",
    defaultMessage: "Your {duration} timer has finished.",
  },

  // Rodapé das configurações
  creditos: {
    id: "foco.credits",
    defaultMessage: "Based on {tabliss} by Joel Shepherd (GPL-3.0)",
  },
});

export const FRASES_FURO = [
  mensagens.frase1,
  mensagens.frase2,
  mensagens.frase3,
  mensagens.frase4,
  mensagens.frase5,
];
