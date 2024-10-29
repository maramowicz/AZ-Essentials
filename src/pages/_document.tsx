import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="antialiased bg-white dark:bg-gray-900 transition-colors duration-1000 overflow-hidden">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
