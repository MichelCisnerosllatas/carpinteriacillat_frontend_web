interface SelectedEmailFieldGoogleProps {
  name: string
  value: string
  imageUrl?: string | null
  required?: boolean
  onClick?: () => void
}

export function SelectedEmailFieldGoogle({
  name,
  value,
  imageUrl,
  required = false,
  onClick,
}: SelectedEmailFieldGoogleProps) {
  const hasEmail = Boolean(value)

  return (
    <div className="relative">
      {/* Campo real del formulario */}
      <input
        type="email"
        name={name}
        value={value}
        required={required}
        tabIndex={-1}
        onChange={() => {}}
        className="
          pointer-events-none
          absolute
          left-1/2
          bottom-0
          h-px
          w-px
          opacity-0
        "
      />

      <button
        type="button"
        onClick={onClick}
        title={
          hasEmail
            ? value
            : 'Selecciona una cuenta de Google'
        }
        className="
          group
          flex
          h-11
          w-full
          items-center
          gap-2.5
          overflow-hidden
          rounded-xl
          border
          border-gray-300
          bg-white
          px-3.5
          text-left
          outline-none

          transition-all
          duration-200
          ease-out

          hover:border-gray-400
          hover:bg-white
          hover:shadow-sm

          active:scale-[0.985]
          active:bg-gray-100

          focus-visible:border-amber-500
          focus-visible:ring-2
          focus-visible:ring-amber-500/20
        "
      >
        {/* LEADING */}
        {imageUrl ? (
          <div
            className="
              h-7
              w-7
              shrink-0
              overflow-hidden
              rounded-full
              transition-transform
              duration-200
              group-hover:scale-105
              group-active:scale-95
            "
          >
            <img
              src={imageUrl}
              alt="Foto de perfil"
              onLoad={() => {
                console.log('Foto Google cargada:', imageUrl)
              }}
              onError={() => {
                console.error('No se pudo cargar la foto:', imageUrl)
              }}
              className="
                h-full
                w-full
                object-cover
              "
            />
          </div>
        ) : (
          <div
            className="
              relative
              flex
              h-7
              w-7
              shrink-0
              items-center
              justify-center
            "
          >
            <i
              className="
                fa-brands
                fa-google
                absolute
                text-base
                text-gray-400
                transition-all
                duration-300
                group-hover:scale-110
                group-hover:opacity-0
                group-active:scale-95
                group-active:opacity-0
              "
            />

            <i
              className="
                fa-brands
                fa-google
                absolute
                scale-75
                bg-gradient-to-br
                from-blue-500
                via-red-500
                to-green-500
                bg-clip-text
                text-base
                text-transparent
                opacity-0
                transition-all
                duration-300
                group-hover:scale-110
                group-hover:opacity-100
                group-active:scale-100
                group-active:opacity-100
              "
            />
          </div>
        )}

        {/* CORREO */}
        <span
          className={`
            min-w-0
            flex-1
            truncate
            text-xs
            transition-colors
            duration-200
            sm:text-sm

            ${
              hasEmail
                ? 'font-medium text-gray-900'
                : 'font-normal text-gray-500 group-hover:text-gray-700'
            }
          `}
        >
          {hasEmail
            ? value
            : 'Selecciona una cuenta de Google'}
        </span>

        <i
          className="
            fa-solid
            fa-chevron-right
            shrink-0
            text-xs
            text-gray-400
            transition-all
            duration-200

            group-hover:translate-x-0.5
            group-hover:text-gray-600

            group-active:translate-x-1
          "
        />
      </button>
    </div>
  )
}