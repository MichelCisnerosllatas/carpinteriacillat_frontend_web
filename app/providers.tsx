"use client";

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider>
      <Notifications position="top-right" />
      {children}
    </MantineProvider>
  );
}
