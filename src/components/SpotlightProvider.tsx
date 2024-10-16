"use client"

import { useEffect, ReactNode } from "react";

interface Props {
  children?: ReactNode
}

export default function SpotlightProvider({children}: Props) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      import('@spotlightjs/spotlight').then((Spotlight) =>
        Spotlight.init({ injectImmediately: true })
      );
    }
  }, []);
  return children;
}
