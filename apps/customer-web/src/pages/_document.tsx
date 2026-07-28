import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="vi">
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="Smart Mall - Trung tâm thương mại thông minh hàng đầu Việt Nam" />
        <meta name="keywords" content="smart mall, trung tâm thương mại, mua sắm, giải trí" />
        <meta name="author" content="Smart Mall" />
        <meta property="og:title" content="Smart Mall - Trung tâm thương mại thông minh" />
        <meta property="og:description" content="Mua sắm, giải trí và trải nghiệm tại Smart Mall" />
        <meta property="og:type" content="website" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏪</text></svg>" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>
      <body suppressHydrationWarning={true}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
