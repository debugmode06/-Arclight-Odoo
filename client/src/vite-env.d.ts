/// <reference types="vite/client" />

// Allow importing CSS files
declare module '*.css' {
  const content: string;
  export default content;
}

// Allow importing SVG files
declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

// Allow importing image files
declare module '*.png' {
  const content: string;
  export default content;
}
