export type Testimonial = {
    id: string;
    name: string;
    role: string;
    message: string;
    city?: string;
    rating?: number;
};

export type SectionTestimonialProps = {
    title?: string;
    subtitle?: string;
    items?: Testimonial[];
};