/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: false, // Wyłącza kompresję

  webpack(config) {
    // Znajdź regułę dla plików .svg
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg")
    );

    // Dodaj nowe reguły dla plików SVG
    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
        use: {
          loader: "@svgr/webpack",
          options: {
            svgoConfig: {
              plugins: [
                {
                  name: "preset-default",
                  params: {
                    overrides: {
                      removeViewBox: false,
                    },
                  },
                },
              ],
            },
          },
        },
      }
    );

    // Wyklucz SVG z domyślnego loadera
    fileLoaderRule.exclude = /\.svg$/i;

    // Wyłącz minifikację
    config.optimization.minimize = false;

    return config;
  },
};

export default nextConfig;
