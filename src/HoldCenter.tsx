import { FC, PropsWithChildren, useLayoutEffect, useRef } from "react";
import styles from "./HoldCenter.module.css";

export const HoldCenter: FC<PropsWithChildren> = ({ children }) => {
  const scroller = useRef<HTMLDivElement | null>(null);
  const content = useRef<HTMLDivElement | null>(null);

  const scrollTop = useRef<number | null>(null);

  const pieceToHold = useRef<Element | null>(null);
  const topToHold = useRef<number | null>(null);

  function onScroll() {
    if (!content.current) throw new Error("oopsie");
    if (!scroller.current) throw new Error("doopsei");
    const bounds = scroller.current?.getBoundingClientRect();
    if (!bounds) throw new Error("no bounds");

    const center = document.elementFromPoint(
      bounds.left + bounds.width / 2,
      bounds.top + bounds.height / 2
    );

    pieceToHold.current = center;
    const top = center?.getBoundingClientRect().top;
    topToHold.current = top || null;

    scrollTop.current = scroller.current.scrollTop;
  }

  useLayoutEffect(() => {
    if (!scroller.current || !scrollTop.current) return;

    if (scrollTop.current > -50) {
      scroller.current.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const newTop = pieceToHold.current?.getBoundingClientRect().top;
      const oldTop = topToHold.current;
      if (!newTop || !oldTop) return;

      scroller.current.scrollTop += newTop - oldTop;
    }
  });

  return (
    <div className={styles.ScrollContainer} ref={scroller} onScroll={onScroll}>
      <div className={styles.ContentContainer} ref={content}>
        {children}
      </div>
    </div>
  );
};
