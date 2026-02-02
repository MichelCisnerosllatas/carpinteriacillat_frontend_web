type ServicieLabelTitleProps = {
    title: string;
    barColor?: string;   // color de la barra
    textColor?: string;  // color del texto
}
export default function Servicelabeltitle({
  title,
  barColor = "bg-yellow-500",
  textColor = "text-gray-900",
}: ServicieLabelTitleProps){
    return (
        <div className="flex items-center w-full gap-2">
            {/* Barra lateral */}
            <span className={`w-2 h-8 rounded-full ${barColor}`}/>

            {/* Título */}
            <h2 className={`text-2xl md:text-3xl font-bold ${textColor}`}>{title}</h2>
        </div>
    );
}