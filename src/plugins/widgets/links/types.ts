import { API } from "../../types";

export type Link = {
  name?: string;
  icon?: string;
  url: string;
};

export type Data = {
  columns: number;
  links: Link[];
  visible: boolean;
  linkOpenStyle: boolean;
};

export type Props = API<Data>;

export const defaultData = {
  columns: 1,
  links: [{ name: "Google", url: "https://www.google.com" }],
  visible: true,
  linkOpenStyle: false,
};
