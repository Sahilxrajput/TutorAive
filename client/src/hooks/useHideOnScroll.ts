import { useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";

const useHideOnScroll = () => {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest < 20) setHidden(false);

    if (latest > previous && latest > 80) {
      // scrolling down
      setHidden(true);
    } else {
      // scrolling up
      setHidden(false);
    }
  });

  return hidden;
};

export default useHideOnScroll;
