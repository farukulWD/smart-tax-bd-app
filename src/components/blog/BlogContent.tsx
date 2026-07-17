import { useState } from 'react';
import { Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import { useThemeColors } from '@/src/theme/useThemeColors';

// Content arrives already sanitized by the server (sanitizeContent on write),
// so the WebView only needs styling and a height probe.
const buildHtml = (content: string, colors: Record<string, string>) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
<style>
  :root {
    --foreground: ${colors.foreground};
    --muted-foreground: ${colors.mutedForeground};
    --primary: ${colors.primary};
    --border: ${colors.border};
    --muted: ${colors.muted};
  }
  html, body {
    margin: 0;
    padding: 0;
    background: transparent;
    color: var(--foreground);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 15px;
    line-height: 1.7;
    word-wrap: break-word;
  }
  h1, h2, h3 { color: var(--foreground); line-height: 1.3; margin: 1.2em 0 0.5em; }
  h1 { font-size: 22px; }
  h2 { font-size: 19px; }
  h3 { font-size: 17px; }
  p { margin: 0 0 1em; }
  a { color: var(--primary); }
  img { max-width: 100%; height: auto; border-radius: 10px; }
  ul, ol { padding-left: 1.25em; margin: 0 0 1em; }
  li { margin-bottom: 0.4em; }
  blockquote {
    margin: 0 0 1em;
    padding: 0.5em 1em;
    border-left: 3px solid var(--border);
    background: var(--muted);
    border-radius: 8px;
    color: var(--muted-foreground);
  }
  pre, code {
    background: var(--muted);
    border-radius: 6px;
    font-size: 13px;
  }
  pre { padding: 12px; overflow-x: auto; }
  code { padding: 2px 5px; }
  table { width: 100%; border-collapse: collapse; margin: 0 0 1em; }
  th, td { border: 1px solid var(--border); padding: 8px; text-align: left; }
</style>
</head>
<body>
${content}
<script>
  var report = function () {
    window.ReactNativeWebView.postMessage(
      String(document.documentElement.scrollHeight)
    );
  };
  window.addEventListener('load', report);
  // Images settle after load and change total height.
  new ResizeObserver(report).observe(document.body);
  report();
</script>
</body>
</html>
`;

const BlogContent = ({ content }: { content: string }) => {
  const { colors, isDark } = useThemeColors();
  const [height, setHeight] = useState(1);

  return (
    <WebView
      // Remount on theme flip so the injected CSS variables refresh.
      key={isDark ? 'dark' : 'light'}
      originWhitelist={['*']}
      source={{ html: buildHtml(content, colors as unknown as Record<string, string>) }}
      style={{ height, backgroundColor: 'transparent' }}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
      javaScriptEnabled
      onMessage={(event) => {
        const next = Number(event.nativeEvent.data);
        if (!Number.isNaN(next) && next > 0) {
          setHeight(next);
        }
      }}
      onShouldStartLoadWithRequest={(request) => {
        // Only the initial about:blank document load happens in-place;
        // tapped links go to the system browser.
        if (request.url === 'about:blank' || request.url.startsWith('data:')) {
          return true;
        }
        Linking.openURL(request.url);
        return false;
      }}
    />
  );
};

export default BlogContent;
