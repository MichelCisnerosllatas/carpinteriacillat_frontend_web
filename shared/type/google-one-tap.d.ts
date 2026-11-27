interface GoogleCredentialResponse {
  credential: string
  select_by: string
}

interface GooglePromptMomentNotification {
  isDisplayMoment(): boolean
  isDisplayed(): boolean
  isNotDisplayed(): boolean

  isSkippedMoment(): boolean
  isDismissedMoment(): boolean

  getMomentType(): 'display' | 'skipped' | 'dismissed'

  getNotDisplayedReason(): string
  getSkippedReason(): string
  getDismissedReason(): string
}

interface GoogleAccountsId {
  initialize(config: {
    client_id: string
    callback: (
      response: GoogleCredentialResponse,
    ) => void

    auto_select?: boolean
    cancel_on_tap_outside?: boolean
  }): void

  prompt(
    momentListener?: (
      notification: GooglePromptMomentNotification,
    ) => void,
  ): void

  cancel(): void

  disableAutoSelect(): void
}

interface Window {
  google?: {
    accounts: {
      id: GoogleAccountsId
    }
  }
}