import {
  FC,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import styles from "./MessageList.module.css";
import { store } from "./store";

export const MessageList: FC<PropsWithChildren<{ header: ReactNode }>> = ({
  children,
  header,
}) => {
  const scroller = useRef<HTMLDivElement | null>(null);
  const contents = useRef<HTMLDivElement | null>(null);
  const topElement = useRef<Element | null>(null);
  const bottomElement = useRef<Element | null>(null);
  const headerWrapper = useRef<HTMLDivElement | null>(null);

  const scrollTop = useRef<number | null>(null);
  const atBottom = useRef<boolean | null>(null);
  const atTop = useRef<boolean | null>(null);

  function onScroll() {
    if (!contents.current || !scroller.current) {
      console.log("No contents.");
      return;
    }

    scrollTop.current = scroller.current.scrollTop;

    const scrollerRect = scroller.current.getBoundingClientRect();
    const contentsRect = contents.current.getBoundingClientRect();

    // todo:
    const _atTop =
      scroller.current.scrollTop <
      -(
        contentsRect.height -
        scrollerRect.height -
        (50 + headerWrapper.current!.clientHeight)
      );

    const _atBottom = scroller.current.scrollTop > -50;

    atBottom.current = _atBottom;
    atTop.current = _atTop;

    store.debug = {
      _atTop,
      _atBottom,
      contentHeight: contentsRect.height,
      scrollerHeight: scrollerRect.height,
      scrollTop: scroller.current.scrollTop,
      scrollBottomComparison: contentsRect.height - scrollerRect.height,
    };

    console.log(
      `Scrolling happened - `,
      JSON.parse(JSON.stringify(store.debug))
    );
  }

  useEffect(onScroll, []);
  useLayoutEffect(() => {
    if (!contents.current || !scroller.current) {
      console.log("No contents.");
      return;
    }

    const browserFixedScrollPosition =
      scrollTop.current !== scroller.current.scrollTop;
    if (browserFixedScrollPosition) {
      console.log("MAGIC HAPPENED!!!");
    }

    const newTop = headerWrapper.current?.nextElementSibling;
    const newBottom = contents.current.lastElementChild;

    const scrollerRect = scroller.current.getBoundingClientRect();
    const contentsRect = contents.current.getBoundingClientRect();

    // todo:
    /*    const _atTop = scroller.current.scrollTop < 50;

    const _atBottom =
      scroller.current.scrollTop >
      contentsRect.height - scrollerRect.height + 50;
*/

    console.log(
      `useLayoutEffect: [${atTop.current ? "atTop" : "     "}] [${
        atBottom.current ? "atBottom" : "        "
      }]`
    );

    if (newTop && topElement.current && newTop !== topElement.current) {
      const h =
        newTop!.getBoundingClientRect().top -
        topElement.current!.getBoundingClientRect().top;

      if (atTop.current && browserFixedScrollPosition) {
        console.log("We should adjust the top");
        scroller.current.scrollTop -= h;
      }
    }
    if (
      newBottom &&
      bottomElement.current &&
      newBottom !== bottomElement.current
    ) {
      console.log("Element added to bottom", newBottom, bottomElement.current);
      const h =
        newBottom!.getBoundingClientRect().bottom -
        bottomElement.current!.getBoundingClientRect().bottom;
      console.log("Item height: ", h);
      if (!atBottom.current && !browserFixedScrollPosition) {
        console.log(`Moving  stuff: ${h} ${scroller.current.scrollTop}`);
        scroller.current.scrollTop -= h!;
        console.log(`After: ${scroller.current.scrollTop}`);
      }
    }

    topElement.current = newTop;
    bottomElement.current = newBottom;
  });

  return (
    <div className={styles.MessageList} onScroll={onScroll} ref={scroller}>
      <div ref={contents}>
        <div ref={headerWrapper}>{header}</div>
        {children}
      </div>
    </div>
  );
};
