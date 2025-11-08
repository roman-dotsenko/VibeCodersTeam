import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// Specify the path to the i18n request configuration
const withNextIntl = createNextIntlPlugin(
  './app/i18n/request.ts'
);

const config: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
};

export default withNextIntl(config);
