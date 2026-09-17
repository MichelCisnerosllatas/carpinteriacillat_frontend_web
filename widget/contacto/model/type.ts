// widget/contact/model/type.ts
export type ContactInfo = {
    phone: string;
    email: string;
    address: string;
    schedule?: string;
};

export type ContactFormData = {
    name: string;
    email: string;
    phone: string;
    projectType: string;
    message: string;
};