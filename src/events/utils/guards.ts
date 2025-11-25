import { ratingType } from "./../../components/layout/Modal";

export const isElement = (target: EventTarget | null): target is Element => {
  return target instanceof Element;
};

export const isHTMLElement = (
  target: EventTarget | null
): target is HTMLElement => {
  return target instanceof HTMLElement;
};

export const isForm = (
  target: EventTarget | null
): target is HTMLFormElement => {
  return target instanceof HTMLFormElement;
};

export const isInput = (
  target: EventTarget | null
): target is HTMLInputElement => {
  return target instanceof HTMLInputElement;
};

export const isImage = (
  target: EventTarget | null
): target is HTMLImageElement => {
  return target instanceof HTMLImageElement;
};

export const isRatingType = (value: unknown): value is ratingType => {
  return typeof value === "number" && [0, 2, 4, 6, 8, 10].includes(value);
};
