import { ContactMessageProjectType } from "./contactmessagespost.dto"

export type ContactMessageFormDataType = {
    name: string
    email: string
    phone: string
    projectType: ContactMessageProjectType
    message: string
}