import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Preloader({ onFinish }) {
  const preloaderRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: onFinish,
      });

      tl.to(".logo-group span", {
        opacity: 1,
        y: 0,
        stagger: 0.06,
        duration: 0.9,
      });

      tl.to(".line", {
        width: "100%",
        duration: 2.2,
        ease: "power2.inOut",
      }, "-=0.2");

      /* 🔥 HOLD — THIS CONTROLS TOTAL FEEL */
      tl.to({}, { duration: 1.2 });

      tl.to(".brand", {
        opacity: 0,
        y: -14,
        duration: 0.5,
      });

      tl.to(preloaderRef.current, {
        opacity: 0,
        duration: 0.5,
        pointerEvents: "none",
      });
    }, preloaderRef);

    return () => ctx.revert();
  }, [onFinish]);

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-[9999] bg-white dark:bg-[#0A0A0A] flex items-center justify-center"
    >
      <div className="brand text-center select-none">

        {/* LOGO — EXACT HEADER STRUCTURE */}
        <div className="leading-none text-black dark:text-white text-[22px] font-semibold tracking-wide">

          {/* DRIVE */}
          <div className="logo-group -ml-3">
            {"Drive".split("").map((l, i) => (
              <span
                key={i}
                className="inline-block opacity-0 translate-y-3"
              >
                {l}
              </span>
            ))}
          </div>

          {/* VERSE */}
          <div className="logo-group -mt-1">
            {"VERSE".split("").map((l, i) => (
              <span
                key={i}
                className="inline-block opacity-0 translate-y-3"
              >
                {l}
              </span>
            ))}
          </div>
        </div>

        {/* AXLE / ROAD LINE */}
        <div className="mt-6 w-[160px] h-[2px] mx-auto bg-gray-200 dark:bg-neutral-800 overflow-hidden relative">
          <div className="line h-full w-0 bg-black dark:bg-white" />
        </div>

        {/* MICRO CONTEXT (optional but classy) */}
        <p className="mt-4 text-[11px] tracking-wide text-gray-400 dark:text-gray-500 uppercase">
          Built for clarity
        </p>
      </div>
    </div>
  );
}
