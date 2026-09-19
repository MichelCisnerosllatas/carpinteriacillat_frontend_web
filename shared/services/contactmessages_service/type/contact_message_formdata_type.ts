import { ContactMessageProjectType } from "../model/contactmessagespost.dto"

export type ContactMessageFormDataType = {
    name: string
    email: string
    phone: string
    projectType: ContactMessageProjectType
    message: string
}