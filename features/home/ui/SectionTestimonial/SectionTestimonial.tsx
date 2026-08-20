"use client";

import { useRef } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/pagination";

import Container from "@/shared/ui/container/Container";

/* =========================================================
   TYPES
========================================================= */

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

/* =========================================================
   DATA DE EJEMPLO
========================================================= */

const defaultTestimonials: Testimonial[] = [
    {
        id: "1",
        name: "María López",
        role: "Ama de casa",
        city: "Iquitos",
        message:
            "Muy cumplidos con los tiempos y el diseño quedó tal como lo imaginamos. Nuestra cocina ahora es el corazón de la casa.",
        rating: 5,
    },
    {
        id: "2",
        name: "Carlos Ramírez",
        role: "Gerente de tienda",
        city: "Iquitos",
        message:
            "Instalaron el mobiliario de nuestra tienda en tiempo récord. Se nota la calidad en los acabados.",
        rating: 5,
    },
    {
        id: "3",
        name: "Ana Fernández",
        role: "Profesional independiente",
        city: "Punchana",
        message:
            "Mandé a hacer mi closet y escritorio de trabajo. Aprovecharon al máximo cada espacio, quedó espectacular.",
        rating: 4,
    },
    {
        id: "4",
        name: "Luis Gutiérrez",
        role: "Administrador de restaurante",
        city: "San Juan Bautista",
        message:
            "Renovamos todo el mobiliario del local. Los clientes nos felicitan por el nuevo ambiente.",
        rating: 5,
    },
    {
        id: "5",
        name: "Rocío Herrera",
        role: "Arquitecta",
        city: "Iquitos",
        message:
            "Excelente aliado para proyectos integrales. Respetan los planos, los detalles y proponen buenas soluciones.",
        rating: 5,
    },
    {
        id: "6",
        name: "Jorge Saldaña",
        role: "Empresario",
        city: "Bellavista",
        message:
            "Hicieron los muebles de oficina de nuestra empresa. Muy buen balance entre diseño y funcionalidad.",
        rating: 4,
    },
];

/* =========================================================
   HELPERS
========================================================= */

function getInitials(name: string) {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0]?.toUpperCase())
        .join("");
}

/* =========================================================
   ESTRELLAS
========================================================= */

function Stars({ rating = 5 }: { rating?: number }) {
    const safeRating = Math.min(Math.max(rating, 0), 5);

    return (
        <div
            className="mt-1 flex items-center gap-1"
            aria-label={`${safeRating} de 5 estrellas`}
        >
            {Array.from({ length: 5 }).map((_, index) => (
                <i
                    key={index}
                    className={`fas fa-star text-xs ${
                        index < safeRating
                            ? "text-amber-400"
                            : "text-slate-600"
                    }`}
                />
            ))}
        </div>
    );
}

/* =========================================================
   ICONOS
========================================================= */

function ArrowLeftIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M15 18l-6-6 6-6" />
        </svg>
    );
}

function ArrowRightIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M9 18l6-6-6-6" />
        </svg>
    );
}

/* =========================================================
   COMPONENTE
========================================================= */

export default function SectionTestimonial({
    title,
    subtitle,
    items,
}: SectionTestimonialProps) {
    const swiperRef = useRef<SwiperType | null>(null);

    const data =
        items && items.length > 0
            ? items
            : defaultTestimonials;

    return (
        <section
            id="testimonios"
            className="relative overflow-hidden bg-gray-200 py-16 md:py-20 lg:py-24"
        >
            <Container>

                {/* =====================================================
                    ENCABEZADO
                ===================================================== */}

                <div className="mx-auto mb-10 max-w-5xl text-center md:mb-12 lg:mb-14">

                    <p className="text-xs font-bold uppercase tracking-[0.28em] text-red-600 md:text-sm">
                        {subtitle ?? "Lo que dicen nuestros clientes"}
                    </p>

                    <h2
                        className="mx-auto mt-3 max-w-5xl text-3xl font-extrabold leading-[1.12] tracking-tight text-slate-950 md:text-4xl lg:text-[44px]"
                    >
                        {title ??
                            "Historias de confianza y buenos resultados"}
                    </h2>

                    <p
                        className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-500 md:text-base md:leading-7"
                    >
                        Cada proyecto termina con un cliente satisfecho.
                        Estas son algunas opiniones de personas y empresas
                        que confiaron en CILLAT.
                    </p>

                </div>


                {/* =====================================================
                    CARRUSEL
                ===================================================== */}

                <div className="relative lg:px-[72px]">

                    {/* =================================================
                        BOTÓN IZQUIERDA - DESKTOP
                    ================================================= */}

                    <button
                        type="button"
                        aria-label="Ver testimonio anterior"
                        onClick={() =>
                            swiperRef.current?.slidePrev()
                        }
                        className="absolute left-1 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-[0_6px_20px_rgba(15,23,42,0.10)] transition-all duration-300 hover:-translate-y-1/2 hover:scale-105 hover:border-red-600 hover:bg-red-600 hover:text-white hover:shadow-[0_8px_24px_rgba(220,38,38,0.20)] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 lg:flex"
                    >
                        <ArrowLeftIcon />
                    </button>


                    {/* =================================================
                        SWIPER
                    ================================================= */}

                    <Swiper
                        modules={[Autoplay, Pagination]}
                        onSwiper={(swiper) => {
                            swiperRef.current = swiper;
                        }}
                        slidesPerView={1}
                        spaceBetween={20}
                        speed={650}
                        loop={data.length > 3}
                        grabCursor={true}
                        autoplay={{
                            delay: 6000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        pagination={{
                            clickable: true,
                        }}
                        breakpoints={{
                            640: {
                                slidesPerView: 1,
                                spaceBetween: 20,
                            },

                            768: {
                                slidesPerView: 2,
                                spaceBetween: 22,
                            },

                            1200: {
                                slidesPerView: 3,
                                spaceBetween: 24,
                            },
                        }}
                        className="testimonial-swiper !pb-14 [&_.swiper-wrapper]:items-stretch"
                    >

                        {data.map((item) => (

                            <SwiperSlide
                                key={item.id}
                                className="!h-auto"
                            >

                                {/* =====================================
                                    TARJETA
                                ===================================== */}

                                <article
                                    className="group flex h-full min-h-[290px] flex-col rounded-2xl border border-slate-700/40 bg-slate-800 p-6 shadow-[0_8px_25px_rgba(15,23,42,0.10)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(15,23,42,0.16)]"
                                >

                                    {/* ===============================
                                        CLIENTE
                                    =============================== */}

                                    <div className="flex items-center gap-4">

                                        {/* AVATAR */}

                                        <div
                                            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-amber-400/70 bg-amber-400/10 text-base font-bold text-amber-400"
                                        >
                                            {getInitials(item.name)}
                                        </div>


                                        {/* INFORMACIÓN */}

                                        <div className="min-w-0">

                                            <h3
                                                className="truncate text-base font-bold leading-tight text-white"
                                            >
                                                {item.name}
                                            </h3>

                                            <p
                                                className="mt-1 text-[13px] leading-5 text-slate-400"
                                            >
                                                {item.role}

                                                {item.city && (
                                                    <>
                                                        <span className="mx-1 text-slate-600">
                                                            ·
                                                        </span>

                                                        {item.city}
                                                    </>
                                                )}
                                            </p>

                                            <Stars
                                                rating={item.rating}
                                            />

                                        </div>

                                    </div>


                                    {/* ===============================
                                        TESTIMONIO
                                    =============================== */}

                                    <div className="flex flex-1 items-center py-6">

                                        <p
                                            className="text-[15px] font-medium leading-7 text-slate-200"
                                        >
                                            “{item.message}”
                                        </p>

                                    </div>


                                    {/* ===============================
                                        FOOTER
                                    =============================== */}

                                    <div
                                        className="flex items-center justify-between gap-4 border-t border-slate-700 pt-4 text-xs"
                                    >

                                        {/* PROYECTO ENTREGADO */}

                                        <div
                                            className="flex min-w-0 items-center gap-2 text-slate-400"
                                        >

                                            <span
                                                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white"
                                            >
                                                ✓
                                            </span>

                                            <span className="truncate">
                                                Proyecto entregado
                                            </span>

                                        </div>


                                        {/* VERIFICADO */}

                                        <span
                                            className="shrink-0 whitespace-nowrap text-[11px] italic text-slate-500"
                                        >
                                            Cliente verificado
                                        </span>

                                    </div>

                                </article>

                            </SwiperSlide>

                        ))}

                    </Swiper>


                    {/* =================================================
                        BOTÓN DERECHA - DESKTOP
                    ================================================= */}

                    <button
                        type="button"
                        aria-label="Ver siguiente testimonio"
                        onClick={() =>
                            swiperRef.current?.slideNext()
                        }
                        className="absolute right-1 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-[0_6px_20px_rgba(15,23,42,0.10)] transition-all duration-300 hover:-translate-y-1/2 hover:scale-105 hover:border-red-600 hover:bg-red-600 hover:text-white hover:shadow-[0_8px_24px_rgba(220,38,38,0.20)] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 lg:flex"
                    >
                        <ArrowRightIcon />
                    </button>

                </div>


                {/* =====================================================
                    NAVEGACIÓN MOBILE / TABLET
                ===================================================== */}

                <div className="mt-2 flex items-center justify-center gap-3 lg:hidden">

                    <button
                        type="button"
                        aria-label="Ver testimonio anterior"
                        onClick={() =>
                            swiperRef.current?.slidePrev()
                        }
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm transition-all duration-300 hover:border-red-600 hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                        <ArrowLeftIcon />
                    </button>


                    <button
                        type="button"
                        aria-label="Ver siguiente testimonio"
                        onClick={() =>
                            swiperRef.current?.slideNext()
                        }
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm transition-all duration-300 hover:border-red-600 hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                        <ArrowRightIcon />
                    </button>

                </div>

            </Container>


            {/* =========================================================
                ESTILOS GLOBALES DEL SWIPER
            ========================================================= */}

            <style jsx global>{`

                /*
                ============================================
                PAGINACIÓN
                ============================================
                */

                .testimonial-swiper .swiper-pagination {
                    bottom: 2px !important;
                }


                .testimonial-swiper
                .swiper-pagination-bullet {

                    width: 7px;
                    height: 7px;

                    margin: 0 4px !important;

                    background: #94a3b8;

                    opacity: 0.4;

                    transition:
                        width 0.3s ease,
                        opacity 0.3s ease,
                        background-color 0.3s ease;
                }


                .testimonial-swiper
                .swiper-pagination-bullet-active {

                    width: 24px;

                    border-radius: 999px;

                    background: #dc2626;

                    opacity: 1;
                }


                /*
                ============================================
                EVITAR PROBLEMAS VISUALES DEL CARRUSEL
                ============================================
                */

                .testimonial-swiper {
                    overflow: hidden;
                }


                .testimonial-swiper
                .swiper-slide {

                    box-sizing: border-box;
                }


                /*
                ============================================
                MOBILE
                ============================================
                */

                @media (max-width: 767px) {

                    .testimonial-swiper {
                        padding-bottom: 48px !important;
                    }

                }

            `}</style>

        </section>
    );
}
// "use client";

// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";

// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";

// import Container from "@/shared/ui/container/Container";

// export type Testimonial = {
//     id: string;
//     name: string;
//     role: string;
//     message: string;
//     city?: string;
//     rating?: number;
// };

// export type SectionTestimonialProps = {
//     title?: string;
//     subtitle?: string;
//     items?: Testimonial[];
// };

// const defaultTestimonials: Testimonial[] = [
//     {
//         id: "1",
//         name: "María López",
//         role: "Ama de casa",
//         city: "Iquitos",
//         message:
//             "Muy cumplidos con los tiempos y el diseño quedó tal como lo imaginamos. Nuestra cocina ahora es el corazón de la casa.",
//         rating: 5,
//     },
//     {
//         id: "2",
//         name: "Carlos Ramírez",
//         role: "Gerente de tienda",
//         city: "Iquitos",
//         message:
//             "Instalaron el mobiliario de nuestra tienda en tiempo récord. Se nota la calidad en los acabados.",
//         rating: 5,
//     },
//     {
//         id: "3",
//         name: "Ana Fernández",
//         role: "Profesional independiente",
//         city: "Punchana",
//         message:
//             "Mandé a hacer mi closet y escritorio de trabajo. Aprovecharon al máximo cada espacio, quedó espectacular.",
//         rating: 4,
//     },
//     {
//         id: "4",
//         name: "Luis Gutiérrez",
//         role: "Administrador de restaurante",
//         city: "San Juan Bautista",
//         message:
//             "Renovamos todo el mobiliario del local. Los clientes nos felicitan por el nuevo ambiente.",
//         rating: 5,
//     },
//     {
//         id: "5",
//         name: "Rocío Herrera",
//         role: "Arquitecta",
//         city: "Iquitos",
//         message:
//             "Excelente aliado para proyectos integrales. Respetan los planos, los detalles y proponen buenas soluciones.",
//         rating: 5,
//     },
//     {
//         id: "6",
//         name: "Jorge Saldaña",
//         role: "Empresario",
//         city: "Bellavista",
//         message:
//             "Hicieron los muebles de oficina de nuestra empresa. Muy buen balance entre diseño y funcionalidad.",
//         rating: 4,
//     },
// ];

// function getInitials(name: string) {
//     return name
//         .split(" ")
//         .filter(Boolean)
//         .slice(0, 2)
//         .map((n) => n[0]?.toUpperCase())
//         .join("");
// }

// function Stars({ rating = 5 }: { rating?: number }) {
//     return (
//         <div className="flex items-center gap-1 mt-1 text-xs">
//             {Array.from({ length: 5 }).map((_, i) => (
//                 <i
//                     key={i}
//                     className={`fas fa-star ${
//                         i < rating
//                             ? "text-amber-400"
//                             : "text-gray-500/50"
//                     }`}
//                 />
//             ))}
//         </div>
//     );
// }

// export default function SectionTestimonial({
//     title,
//     subtitle,
//     items,
// }: SectionTestimonialProps) {
//     const data =
//         items && items.length > 0
//             ? items
//             : defaultTestimonials;

//     return (
//         <section
//             id="testimonios"
//             className="relative overflow-hidden bg-gray-200 py-16 md:py-20"
//         >
//             <Container>

//                 {/* ENCABEZADO */}
//                 <div className="mx-auto mb-12 max-w-3xl text-center">

//                     <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-600">
//                         {subtitle ?? "Lo que dicen nuestros clientes"}
//                     </p>

//                     <h2 className="mt-3 text-3xl font-extrabold leading-tight text-gray-950 md:text-5xl">
//                         {title ??
//                             "Historias de confianza y buenos resultados"}
//                     </h2>

//                     <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-500 md:text-base">
//                         Cada proyecto termina con un cliente satisfecho.
//                         Estas son algunas opiniones de personas y empresas
//                         que confiaron en CILLAT.
//                     </p>

//                 </div>


//                 {/* CARRUSEL */}
//                 <div className="relative">

//                     <Swiper
//                         modules={[
//                             Autoplay,
//                             Pagination,
//                             Navigation,
//                         ]}
//                         spaceBetween={24}
//                         slidesPerView={1}

//                         loop={true}

//                         speed={700}

//                         autoplay={{
//                             delay: 6000,
//                             disableOnInteraction: false,
//                             pauseOnMouseEnter: true,
//                         }}

//                         navigation={true}

//                         pagination={{
//                             clickable: true,
//                         }}

//                         breakpoints={{
//                             640: {
//                                 slidesPerView: 1,
//                             },

//                             768: {
//                                 slidesPerView: 2,
//                             },

//                             1200: {
//                                 slidesPerView: 3,
//                             },
//                         }}

//                         className="testimonial-swiper !px-1 !pb-16 md:!px-16 [&_.swiper-wrapper]:items-stretch"
//                     >

//                         {data.map((item) => (

//                             <SwiperSlide
//                                 key={item.id}
//                                 className="!h-auto"
//                             >

//                                 <article
//                                     className="group flex h-full min-h-[270px] flex-col rounded-2xl border border-gray-700/30 bg-gray-800 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
//                                 >

//                                     {/* CLIENTE */}
//                                     <div className="flex items-center gap-4">

//                                         <div
//                                             className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-amber-400/60 bg-amber-400/10 font-bold text-amber-400"
//                                         >
//                                             {getInitials(item.name)}
//                                         </div>


//                                         <div className="min-w-0">

//                                             <h3 className="font-bold text-white">
//                                                 {item.name}
//                                             </h3>

//                                             <p className="text-sm text-gray-400">

//                                                 {item.role}

//                                                 {item.city && (
//                                                     <>
//                                                         {" "}
//                                                         <span className="text-gray-600">
//                                                             ·
//                                                         </span>{" "}
//                                                         {item.city}
//                                                     </>
//                                                 )}

//                                             </p>

//                                             <Stars
//                                                 rating={
//                                                     item.rating
//                                                 }
//                                             />

//                                         </div>

//                                     </div>


//                                     {/* TESTIMONIO */}
//                                     <div className="flex flex-1 items-center py-6">

//                                         <p className="text-[15px] font-medium leading-7 text-gray-200">
//                                             “{item.message}”
//                                         </p>

//                                     </div>


//                                     {/* FOOTER */}
//                                     <div className="flex items-center justify-between border-t border-gray-700/60 pt-4 text-xs">

//                                         <div className="flex items-center gap-2 text-gray-400">

//                                             <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white">
//                                                 ✓
//                                             </span>

//                                             <span>
//                                                 Proyecto entregado
//                                             </span>

//                                         </div>

//                                         <span className="italic text-gray-500">
//                                             Cliente verificado
//                                         </span>

//                                     </div>

//                                 </article>

//                             </SwiperSlide>

//                         ))}

//                     </Swiper>

//                 </div>

//             </Container>


//             {/* ESTILOS SWIPER */}
//             <style jsx global>{`

//                 /* ==============================
//                    BOTONES ANTERIOR / SIGUIENTE
//                 ============================== */

//                 .testimonial-swiper .swiper-button-prev,
//                 .testimonial-swiper .swiper-button-next {
//                     width: 46px;
//                     height: 46px;

//                     border-radius: 999px;

//                     background: #ffffff;

//                     border: 1px solid #e5e7eb;

//                     color: #111827;

//                     box-shadow:
//                         0 6px 20px
//                         rgba(0, 0, 0, 0.12);

//                     transition:
//                         transform 0.25s ease,
//                         background 0.25s ease,
//                         color 0.25s ease,
//                         border-color 0.25s ease;
//                 }


//                 .testimonial-swiper .swiper-button-prev:hover,
//                 .testimonial-swiper .swiper-button-next:hover {

//                     background: #dc2626;

//                     border-color: #dc2626;

//                     color: white;

//                     transform: scale(1.08);
//                 }


//                 .testimonial-swiper
//                 .swiper-button-prev::after,
//                 .testimonial-swiper
//                 .swiper-button-next::after {

//                     font-size: 15px;

//                     font-weight: 900;
//                 }



//                 /* POSICIÓN */

//                 .testimonial-swiper
//                 .swiper-button-prev {

//                     left: 5px;
//                 }


//                 .testimonial-swiper
//                 .swiper-button-next {

//                     right: 5px;
//                 }



//                 /* ==============================
//                    PAGINACIÓN
//                 ============================== */

//                 .testimonial-swiper
//                 .swiper-pagination {

//                     bottom: 5px !important;
//                 }


//                 .testimonial-swiper
//                 .swiper-pagination-bullet {

//                     width: 9px;

//                     height: 9px;

//                     background: #9ca3af;

//                     opacity: 0.45;

//                     transition:
//                         width 0.3s ease,
//                         opacity 0.3s ease,
//                         background 0.3s ease;
//                 }


//                 .testimonial-swiper
//                 .swiper-pagination-bullet-active {

//                     width: 28px;

//                     border-radius: 10px;

//                     background: #dc2626;

//                     opacity: 1;
//                 }



//                 /* ==============================
//                    MOBILE
//                 ============================== */

//                 @media (max-width: 767px) {

//                     .testimonial-swiper
//                     .swiper-button-prev,
//                     .testimonial-swiper
//                     .swiper-button-next {

//                         width: 40px;

//                         height: 40px;

//                         top: auto;

//                         bottom: 0;
//                     }


//                     .testimonial-swiper
//                     .swiper-button-prev {

//                         left: calc(50% - 80px);
//                     }


//                     .testimonial-swiper
//                     .swiper-button-next {

//                         right: calc(50% - 80px);
//                     }


//                     .testimonial-swiper
//                     .swiper-pagination {

//                         bottom: 13px !important;
//                     }
//                 }

//             `}</style>

//         </section>
//     );
// }

























// "use client";

// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination } from "swiper/modules";
// import Container from "@/shared/ui/container/Container";

// export type Testimonial = {
//     id: string;
//     name: string;
//     role: string;
//     message: string;
//     city?: string;
//     rating?: number; // 1-5
// };

// export type SectionTestimonialProps = {
//     title?: string;
//     subtitle?: string;
//     items?: Testimonial[];
// };

// const defaultTestimonials: Testimonial[] = [
//     {
//         id: "1",
//         name: "María López",
//         role: "Ama de casa",
//         city: "Iquitos",
//         message:
//             "Muy cumplidos con los tiempos y el diseño quedó tal como lo imaginamos. Nuestra cocina ahora es el corazón de la casa.",
//         rating: 5,
//     },
//     {
//         id: "2",
//         name: "Carlos Ramírez",
//         role: "Gerente de tienda",
//         city: "Iquitos",
//         message:
//             "Instalaron el mobiliario de nuestra tienda en tiempo récord. Se nota la calidad en los acabados.",
//         rating: 5,
//     },
//     {
//         id: "3",
//         name: "Ana Fernández",
//         role: "Profesional independiente",
//         city: "Punchana",
//         message:
//             "Mandé a hacer mi closet y escritorio de trabajo. Aprovecharon al máximo cada espacio, quedó espectacular.",
//         rating: 4,
//     },
//     {
//         id: "4",
//         name: "Luis Gutiérrez",
//         role: "Administrador de restaurante",
//         city: "San Juan Bautista",
//         message:
//             "Renovamos todo el mobiliario del local. Los clientes nos felicitan por el nuevo ambiente.",
//         rating: 5,
//     },
//     {
//         id: "5",
//         name: "Rocío Herrera",
//         role: "Arquitecta",
//         city: "Iquitos",
//         message:
//             "Excelente aliado para proyectos integrales. Respetan los planos, los detalles y proponen buenas soluciones.",
//         rating: 5,
//     },
//     {
//         id: "6",
//         name: "Jorge Saldaña",
//         role: "Empresario",
//         city: "Bellavista",
//         message:
//             "Hicieron los muebles de oficina de nuestra empresa. Muy buen balance entre diseño y funcionalidad.",
//         rating: 4,
//     },
// ];

// function getInitials(name: string) {
//     return name
//         .split(" ")
//         .filter(Boolean)
//         .slice(0, 2)
//         .map((n) => n[0]?.toUpperCase())
//         .join("");
// }

// function Stars({ rating = 5 }: { rating?: number }) {
//     return (
//         <div className="flex items-center gap-1 text-amber-400 text-xs">
//             {Array.from({ length: 5 }).map((_, i) => (
//                 <i
//                     key={i}
//                     className={`fas fa-star ${i < rating ? "" : "text-gray-500/60"}`}
//                 />
//             ))}
//         </div>
//     );
// }

// export default function SectionTestimonial({title, subtitle, items}: SectionTestimonialProps) {

//     const data = items && items.length > 0 ? items : defaultTestimonials;
//     return (
//         <section id="testimonios" className="relative py-16 bg-gray-200">
//             <Container>
//                 {/* Título */}
//                 <div className="text-center mb-10">
//                     <p className="text-sm uppercase tracking-[0.2em] text-red-600 font-semibold">
//                         {subtitle ?? "Lo que dicen nuestros clientes"}
//                     </p>
//                     <h2 className="text-3xl md:text-4xl font-extrabold text-black mt-2">
//                         {title ?? "Historias de confianza y buenos resultados"}
//                     </h2>
//                     <p className="text-gray-400 mt-3 max-w-2xl mx-auto text-sm md:text-base">
//                         Cada proyecto termina con un cliente satisfecho. Estas son algunas
//                         opiniones de personas y empresas que confiaron en CILLAT.
//                     </p>
//                 </div>

//                 {/* Carrusel de testimonios */}
//                 <Swiper
//                     modules={[Autoplay, Pagination]}
//                     spaceBetween={24}
//                     slidesPerView={1}
//                     autoplay={{
//                         delay: 6500, // se desliza despacito
//                         disableOnInteraction: false,
//                     }}
//                     loop
//                     pagination={{ clickable: true }}
//                     breakpoints={{
//                         768: { slidesPerView: 2 },
//                         1024: { slidesPerView: 3 },
//                     }}
//                     className="pb-10"
//                 >
//                     {data.map((item) => (
//                         <SwiperSlide key={item.id}>
//                             <div className="h-full bg-gray-800/80 border border-gray-700/60 rounded-2xl p-6 flex flex-col justify-between shadow-lg">
//                                 <div className="flex items-center gap-4 mb-4">
//                                     <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-400/50 flex items-center justify-center text-amber-300 font-bold">
//                                         {getInitials(item.name)}
//                                     </div>
//                                     <div>
//                                         <h3 className="text-sm font-semibold text-white">
//                                             {item.name}
//                                         </h3>
//                                         <p className="text-xs text-gray-400">
//                                             {item.role}
//                                             {item.city ? ` · ${item.city}` : ""}
//                                         </p>
//                                         <Stars rating={item.rating} />
//                                     </div>
//                                 </div>

//                                 <p className="text-gray-200 text-sm leading-relaxed mb-4">
//                                     “{item.message}”
//                                 </p>

//                                 <div className="flex items-center justify-between text-xs text-gray-400">
//                                     <div className="flex items-center gap-1">
//                                         <i className="fas fa-check-circle text-emerald-400" />
//                                         <span>Proyecto entregado</span>
//                                     </div>
//                                     <span className="italic text-[11px]">
//                                         Cliente verificado
//                                     </span>
//                                 </div>
//                             </div>
//                         </SwiperSlide>
//                     ))}
//                 </Swiper>
//             </Container>
//         </section>
//     );
// }
