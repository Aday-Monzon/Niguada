type PintaderaLogoProps = {
  className?: string;
};

export const PintaderaLogo = ({ className }: PintaderaLogoProps) => {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="3.5" />
      <circle cx="24" cy="24" r="5.5" fill="currentColor" />
      <path
        d="M24 8.5v9M24 30.5v9M8.5 24h9M30.5 24h9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="3.5"
      />
      <path
        d="m14.4 14.4 6.4 6.4M27.2 27.2l6.4 6.4M33.6 14.4l-6.4 6.4M20.8 27.2l-6.4 6.4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="3.5"
      />
    </svg>
  );
};
