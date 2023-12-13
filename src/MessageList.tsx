import { useEffect, useLayoutEffect, useRef } from "react";
import { Message } from "./Message";
import { MessageCell } from "./MessageCell";
import styles from "./MessageList.module.css";
import { store } from "./store";

export function MessageList({ messages }: { messages: readonly Message[] }) {
  const scroller = useRef<HTMLDivElement | null>(null);
  const contents = useRef<HTMLDivElement | null>(null);
  const topElement = useRef<Element | null>(null);
  const bottomElement = useRef<Element | null>(null);

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
      -(contentsRect.height - scrollerRect.height - 50);
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

    const newTop = contents.current.firstElementChild;
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

    if (newTop && newTop !== topElement.current) {
      console.log("Element added to top ", newTop, topElement.current);
      const topHeight = newTop.getBoundingClientRect().height;
      console.log("Add ", topHeight, "to ", scroller.current.scrollTop);
      // scroller.current.scrollTop += topHeight;
      console.log("After: ", scroller.current.scrollTop);
    }
    if (newBottom !== bottomElement.current) {
      console.log("Element added to bottom", newBottom, bottomElement.current);
      const h = newBottom?.getBoundingClientRect().height;
      console.log("Item height: ", h);
      if (!atBottom.current && !browserFixedScrollPosition) {
        console.log(`Moving  stuff: ${h} ${scroller.current.scrollTop}`);
        scroller.current.scrollTop -= h!;
        console.log(`After: ${scroller.current.scrollTop}`);
      }
    }

    topElement.current = newTop;
    bottomElement.current = newBottom;
  }, [messages]);

  return (
    <div className={styles.MessageList} onScroll={onScroll} ref={scroller}>
      <div ref={contents}>
        {messages.map((m) => (
          <MessageCell message={m} key={m.id} />
        ))}
      </div>
    </div>
  );
}
