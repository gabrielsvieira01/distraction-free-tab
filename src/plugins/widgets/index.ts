import bloqueio from "./bloqueio";
import greeting from "./greeting";
import links from "./links";
import search from "./search";
import time from "./time";
import timer from "./timer";

export const widgetConfigs = [bloqueio, greeting, links, search, time, timer];

widgetConfigs.sort((a, b) => a.name.localeCompare(b.name));
