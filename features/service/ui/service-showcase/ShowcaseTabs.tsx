// features/service/ui/service-showcase/ShowcaseTabs.tsx
//
// Pestañas del hero de Servicios: una por servicio, con una barrita que se llena en 6 s (el
// tiempo que falta para que el hero pase solo al siguiente panel).
//
// La barra usa la animación CSS "animate-il-progress" (globals.css). El `key={activeIndex}`
// hace que React cree una barra nueva cada vez que cambia el panel, así la animación vuelve
// a empezar desde 0. En pausa (mouse encima del hero) o con "reducir movimiento" se muestra
// la barra llena y quieta, como en el diseño.

type Props = {
    titles: string[];
    activeIndex: number;
    // true = la rotación automática está frenada.
    stopped: boolean;
    onPick: (index: number) => void;
};

export default function ShowcaseTabs({ titles, activeIndex, stopped, onPick }: Props) {
    return (
        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${titles.length}, minmax(0, 1fr))` }}>
            {titles.map((title, i) => {
                const isActive = i === activeIndex;
                return (
                    <button
                        key={`${title}-${i}`}
                        type="button"
                        onClick={() => onPick(i)}
                        aria-pressed={isActive}
                        className="flex min-h-11 cursor-pointer flex-col gap-2.5 border-0 bg-transparent py-2 text-left"
                    >
                        <span className="block h-1 overflow-hidden rounded-full bg-il-neutro-200">
                            {isActive &&
                                (stopped ? (
                                    <span className="block h-full w-full rounded-full bg-il-neutro-900" />
                                ) : (
                                    <span key={activeIndex} className="block h-full w-0 animate-il-progress rounded-full bg-il-neutro-900" />
                                ))}
                        </span>
                        <span
                            className={`il-display text-sm font-bold transition-colors duration-300 ${
                                isActive ? "text-il-neutro-900" : "text-il-neutro-600"
                            }`}
                        >
                            {title}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
