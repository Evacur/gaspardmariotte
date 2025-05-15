export default function IconButton({ onClick, children, ariaLabel = '', variant = 'default' }) {
  const base = 'w-10 h-10 flex items-center justify-center rounded-sm transition-colors duration-200 focus:outline-none focus-visible:ring-2';

  const variants = {
    default: `${base} bg-transparent text-black hover:bg-black/10 active:bg-black/20 focus-visible:ring-black/30`,
    outline: `${base} border border-black text-black bg-transparent hover:bg-black/5 active:bg-black/10 focus-visible:ring-black/30`,
    filled: `${base} bg-black text-white hover:bg-neutral-800 active:bg-neutral-900 focus-visible:ring-white/30`
  };

  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={variants[variant]}
    >
      <div className="w-6 h-6">{children}</div>
    </button>
  );
}

