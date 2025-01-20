import useSentryToolbar from "@/toolbar/useSentryToolbar";
import { ReactNode } from "react";
import useLogin from "./useLogin";

import {OpenFeature, ProviderEvents} from '@openfeature/web-sdk';
import {FlagdWebProvider} from '@openfeature/flagd-web-provider';

interface Props {
  children?: ReactNode
}

OpenFeature.setProvider(
  new FlagdWebProvider({
    host: 'localhost',
    port: 8013,
    tls: false,
    maxRetries: 10,
    maxDelay: 30000,
  })
);

const client = OpenFeature.getClient();
client.addHandler(ProviderEvents.ConfigurationChanged, (...args) => {
  // console.log('ProviderEvents.ConfigurationChanged', args);
});
client.addHandler(ProviderEvents.ContextChanged, (...args) => {
  // console.log('ProviderEvents.ContextChanged', args);
});
client.addHandler(ProviderEvents.Ready, (...args) => {
  console.log('ProviderEvents.Ready', args);
  // do something when the configuration has changed.
});

// Hooks are run per call to `getBooleanValue()`, we want the data before that happens
// client.addHooks({
//   before: (...args) => {
//     console.log('hook before', args);
//   },
//   after: (...args) => {
//     console.log('hook after', args);
//   },
// });

export default function ToolbarProvider({children}: Props) {
  const {isLoggedIn} = useLogin();

  const v2Enabled = client.getBooleanValue('v2_enabled', false);
  const showWelcomeBanner = client.getBooleanValue('show-welcome-banner', false);
  const backgroundColor = client.getStringValue('background-color', '#000000');
  console.log('flags!', {v2Enabled, showWelcomeBanner, backgroundColor});

  useSentryToolbar({
    // Bootstrap config
    cdn: process.env.NEXT_PUBLIC_TOOLBAR_SRC ?? 'https://browser.sentry-cdn.com/sentry-toolbar/latest/toolbar.min.js',
    enabled: isLoggedIn,
    initProps: (SentryToolbar) => ({
      // InitProps
      mountPoint: () => document.body,

      // ConnectionConfig
      sentryOrigin: process.env.NEXT_PUBLIC_SENTRY_ORIGIN,

      // FeatureFlagsConfig
      featureFlags: SentryToolbar.OpenFeatureAdapter,

      // OrgConfig
      organizationSlug: process.env.NEXT_PUBLIC_SENTRY_ORGANIZATION ?? 'sentry-test',
      projectIdOrSlug:process.env.NEXT_PUBLIC_SENTRY_PROJECT ?? 'pokemart',
      environment: process.env.NEXT_PUBLIC_VERCEL_ENV ? `vercel-${process.env.NEXT_PUBLIC_VERCEL_ENV}` : undefined,

      // RenderConfig
      domId: 'sentry-toolbar',
      placement: 'right-edge', //  'bottom-right-corner',
      theme: 'light',

      // Debug
      debug: process.env.NEXT_PUBLIC_DEBUG,
    })
  }, []);

  return children
}
