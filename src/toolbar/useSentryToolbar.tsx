import { useEffect } from "react";
import { loadToolbar } from '@/toolbar/loadToolbar';

type SentryToolbar = Awaited<ReturnType<typeof loadToolbar>>
type InitProps = Parameters<SentryToolbar['init']>[0]
export default function useSentryToolbar({
  enabled, cdn = 'https://browser.sentry-cdn.com/sentry-toolbar/latest/toolbar.min.js', initProps,
}: {
  enabled: boolean;
  cdn: string;
  initProps: InitProps | ((toolbar: SentryToolbar) => InitProps);
}, p0: never[]) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const controller = new AbortController();

    let cleanup: Function | undefined = undefined;
    loadToolbar(controller.signal, cdn).then(importedToolbar => {
      cleanup = importedToolbar.init(
        typeof initProps === 'function'
          ? initProps(importedToolbar)
          : initProps
        );
    });

    return () => {
      controller.abort();
      cleanup?.();
    }
  }, [enabled, cdn]);
}
