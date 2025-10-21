import { useEffect, useMemo, useState } from "react";

/**
 * Typewriter
 * - direction: "ltr" | "rtl"  (typing direction)
 * - speed: ms per character
 * - delay: ms before typing starts
 * - cursor: show a blinking cursor (default true)
 * - centerAfter: when typing completes, auto-center the line
 * - containerClassName: extra classes on the outer flex container
 * - hideCursorOnComplete: hide the cursor after finish (default true)
 */
export default function Typewriter({
  text,
  className = "",
  direction = "ltr",
  speed = 28,
  delay = 0,
  cursor = true,
  centerAfter = true,
  containerClassName = "",
  hideCursorOnComplete = true,
}) {
  const len = text?.length ?? 0;
  const isRTL = direction === "rtl";
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const [showCursor, setShowCursor] = useState(cursor);

  useEffect(() => {
    let startTimer = setTimeout(() => {
      const tick = () =>
        setCount((c) => {
          if (c + 1 >= len) {
            setDone(true);
            if (hideCursorOnComplete) {
              // small grace so the cursor blinks once at the end
              setTimeout(() => setShowCursor(false), 200);
            }
          }
          return Math.min(len, c + 1);
        });

      // kick once immediately for responsiveness
      tick();
      const id = setInterval(tick, speed);
      const cleanup = () => clearInterval(id);
      // store on window to ensure cleanup even if hot-reload
      window.__tw_cleanup__ = cleanup;
    }, Math.max(0, delay));

    return () => {
      clearTimeout(startTimer);
      if (window.__tw_cleanup__) window.__tw_cleanup__();
    };
  }, [delay, speed, len, hideCursorOnComplete]);

  const output = useMemo(() => {
    if (!text) return "";
    if (isRTL) {
      const start = Math.max(0, len - count);
      return text.slice(start);
    }
    return text.slice(0, count);
  }, [text, len, count, isRTL]);

  const Cursor = () =>
    showCursor ? (
      <span
        aria-hidden="true"
        style={{
          display: "inline-block",
          width: "0.6ch",
          borderRight: "2px solid currentColor",
          marginInlineStart: isRTL ? 0 : "0.1ch",
          marginInlineEnd: isRTL ? "0.1ch" : 0,
          animation: "twblink 1s steps(1,end) infinite",
        }}
      />
    ) : null;

  return (
    <>
      {/* Tiny keyframes for the cursor */}
      <style>{`
        @keyframes twblink { 0%, 50% { opacity: 1 } 50.01%, 100% { opacity: 0 } }
      `}</style>

      {/* 
        We use a full-width flex container whose justification changes when done.
        - While typing: justify-start (appears to type from the left edge)
        - After typing: justify-center (line is centered)
      */}
      <div
        className={[
          "w-full flex",
          centerAfter
            ? done
              ? "justify-center"
              : "justify-start"
            : "justify-start",
          containerClassName,
        ].join(" ")}
      >
        <span
          className={className}
          style={{
            display: "inline-block",
            whiteSpace: "pre-wrap",
            // Keep text logically LTR so punctuation renders correctly;
            // typing direction handled by substring logic above.
            direction: "ltr",
            textAlign: "left",
          }}
        >
          {isRTL ? <Cursor /> : null}
          {output}
          {!isRTL ? <Cursor /> : null}
        </span>
      </div>
    </>
  );
}
