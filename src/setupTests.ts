import "@testing-library/jest-dom";

// Polyfill matchMedia required by antd responsive hooks in jsdom
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = (query: string) => {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {}, // deprecated
      removeListener: () => {}, // deprecated
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    } as MediaQueryList;
  };
}
