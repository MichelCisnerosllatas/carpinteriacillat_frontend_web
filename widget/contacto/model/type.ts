// widget/contact/model/type.ts
export type ContactInfo = {
    phone: string;
    email: string;
    address: string;
    whatsapp?: string;
    schedule?: string;
};

export type SectionContactProps = {
    info?: ContactInfo;
    mapEmbedUrl?: string;
};

export type ContactFormData = {
    name: string;
    email: string;
    phone: string;
    projectType: string;
    message: string;
};