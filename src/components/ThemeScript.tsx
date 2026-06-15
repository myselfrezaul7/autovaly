export function ThemeScript() {
  const codeToRunOnClient = `
    (function() {
      try {
        var stored = localStorage.getItem('theme');
        if (stored) {
          document.documentElement.classList.add(stored);
        } else {
          var prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
          if (prefersLight) {
            document.documentElement.classList.add('light');
          } else {
            document.documentElement.classList.add('dark');
          }
        }
      } catch (e) {}
    })();
  `;
  // eslint-disable-next-line react/no-danger
  return <script dangerouslySetInnerHTML={{ __html: codeToRunOnClient }} />;
}
