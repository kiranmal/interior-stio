import { useEffect, useState } from 'react';

export default function Counter({ to, ms = 1200 }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame;
    let start;

    const tick = (time) => {
      start ??= time;
      const progress = Math.min((time - start) / ms, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(to * eased));

      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [to, ms]);

  return <>{value}</>;
}
