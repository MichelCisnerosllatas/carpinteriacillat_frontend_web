import { notifications } from "@mantine/notifications";

export const notify = {
  success: (message: string, title = "Listo") => notifications.show({ title, message, color: "green" }),
  error: (message: string, title = "Error") => notifications.show({ title, message, color: "red" }),
};
