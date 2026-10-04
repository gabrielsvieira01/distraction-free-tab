import { nanoid } from "nanoid";
import { DB } from "../lib";
import { backgroundConfigs, widgetConfigs } from "../plugins";
import { selectWidgets } from "./select";
import { cache, db, WidgetDisplay } from "./state";

export const createId = (): string => nanoid(12);

// Background actions

/** Change the background */
export const setBackground = (key: string): void => {
  const current = DB.get(db, "background");
  const id = createId();
  DB.put(db, "background", {
    id,
    key,
    display: { blur: 0, luminosity: -0.2 },
  });
  DB.del(db, `data/${current.id}`);
  DB.del(cache, current.id);
};

// Widget actions

/** Add a new widget */
export const addWidget = (key: string): void => {
  const id = createId();
  const widgets = selectWidgets();
  const order = widgets.length > 0 ? widgets[widgets.length - 1].order + 1 : 0;
  DB.put(db, `widget/${id}`, {
    id,
    key,
    order,
    display: { position: "middleCentre" },
  });
};

/** Remove a widget */
export const removeWidget = (id: string): void => {
  DB.put(db, `widget/${id}`, null);
  DB.del(db, `data/${id}`);
  DB.del(cache, id);
};

/** Reorder a widget */
export const reorderWidget = (from: number, to: number): void => {
  const widgets = selectWidgets();
  widgets.splice(to, 0, widgets.splice(from, 1)[0]);
  widgets.forEach((widget, order) =>
    DB.put(db, `widget/${widget.id}`, { ...widget, order }),
  );
};

/** Set display properties of a widget */
export const setWidgetDisplay = (
  id: string,
  display: Partial<WidgetDisplay>,
) => {
  const widget = DB.get(db, `widget/${id}`);
  if (!widget) throw new Error("Widget not found while");
  DB.put(db, `widget/${id}`, {
    ...widget,
    display: { ...widget.display, ...display },
  });
};

// UI actions

/** Toggle dashboard focus mode */
export const toggleFocus = () => {
  DB.put(db, "focus", !DB.get(db, "focus"));
};

// Store actions

/** Import database from a dump */
export const importStore = (dump: any): void => {
  // TODO: Add proper schema validation
  if (typeof dump !== "object" || dump === null)
    throw new TypeError("Unexpected format");

  if (dump.version !== 3)
    throw new TypeError(
      "Only settings exported from Tabliss 2.x or Productivity Tab can be imported",
    );
  delete dump.version;

  // Descarta widgets e fundos que este fork removeu (ex.: clima, Giphy)
  const known = new Set(
    [...backgroundConfigs, ...widgetConfigs].map((config) => config.key),
  );
  const dropped = new Set<string>();
  for (const [key, val] of Object.entries<any>(dump)) {
    if (key.startsWith("widget/") && val && !known.has(val.key)) {
      dropped.add(val.id);
      delete dump[key];
    }
  }
  if (dump.background && !known.has(dump.background.key)) {
    dropped.add(dump.background.id);
    delete dump.background;
  }
  for (const id of dropped) delete dump[`data/${id}`];

  resetStore();
  // @ts-ignore
  Object.entries(dump).forEach(([key, val]) => DB.put(db, key, val));
};

/** Export a database dump */
export const exportStore = (): string => {
  return JSON.stringify({
    ...Object.fromEntries(DB.prefix(db, "")),
    version: 3,
  });
};

/** Reset the database */
export const resetStore = (): void => {
  clear(db);
  clear(cache);
};

const clear = (db: DB.Database): void => {
  // @ts-ignore
  for (const [key] of DB.prefix(db, "")) DB.del(db, key);
};
