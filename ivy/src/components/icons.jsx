const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
  focusable: "false",
};
const P = {
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  left: <path d="M19 12H5M11 6l-6 6 6 6" />,
  right: <path d="M5 12h14M13 6l6 6-6 6" />,
  chat: (
    <>
      <path d="M4 5h11a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9l-4 3v-3H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
      <path d="M19 9h1a1 1 0 0 1 1 1v7l-3-2h-4" />
    </>
  ),
  pencil: (
    <>
      <path d="M4 20l1-4L16.5 4.5a2 2 0 0 1 3 3L8 19l-4 1Z" />
      <path d="M14 7l3 3" />
    </>
  ),
  plan: (
    <>
      <path d="M3 5l6-2 6 2 6-2v16l-6 2-6-2-6 2V5Z" />
      <path d="M9 3v16M15 5v16" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" />
    </>
  ),
  house: (
    <>
      <path d="M3.5 11 12 4l8.5 7" />
      <path d="M5.5 10v10h13V10" />
      <path d="M10 20v-5h4v5" />
    </>
  ),
  home2: (
    <>
      <path d="M4 20V9l8-5 8 5v11" />
      <path d="M9 20v-6h6v6M8 11h2M14 11h2" />
    </>
  ),
  building: (
    <>
      <path d="M5 21V4h10v17M15 9h4v12M3 21h18" />
      <path d="M8.5 8h3M8.5 12h3M8.5 16h3" />
    </>
  ),
  sofa: (
    <>
      <path d="M5 11V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3" />
      <path d="M3 13a2 2 0 0 1 4 0v2h10v-2a2 2 0 0 1 4 0v5H3v-5Z" />
      <path d="M6 18v2M18 18v2" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  phone: (
    <path d="M5 4h3.5l1.7 4.4-2.2 1.4a11 11 0 0 0 5.2 5.2l1.4-2.2L19 14.5V18a2 2 0 0 1-2 2A13 13 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  instagram: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="17" cy="7" r=".6" fill="currentColor" />
    </>
  ),
  facebook: <path d="M14 21v-8h2.6l.4-3H14V8.2c0-.9.3-1.5 1.6-1.5H17V4.1C16.700 4.100 15.800 4 14.800 4 12.600 4 11 5.300 11 7.800V10H8.500v3H11v8h3Z" />,
  youtube: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="3.5" />
      <path d="m10.500 9.500 4 2.500-4 2.500v-5Z" />
    </>
  ),
  linkedin: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 10.500V16M8 7.700v.1M11.500 16v-5.500M11.500 12.500c0-1.300 1-2.100 2.200-2.100 1.300 0 2.300.8 2.300 2.400V16" />
    </>
  ),
  pinterest: (
    <>
      <circle cx="12" cy="12" r="8.500" />
      <path d="M11 16.500 12.500 10M9.800 12.300c0-1.600 1.100-2.600 2.500-2.600 1.300 0 2.200.9 2.200 2 0 1.500-.9 2.700-2 2.700-.7 0-1.100-.4-1.100-1" />
    </>
  ),
};

export function Icon({ name, size = 24, ...rest }) {
  return (
    <svg {...base} width={size} height={size} {...rest}>
      {P[name] || null}
    </svg>
  );
}
