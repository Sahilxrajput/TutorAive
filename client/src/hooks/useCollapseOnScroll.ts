import { useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";

const useCollapseOnScroll = () => {
  const { scrollY } = useScroll();
  const [collapsed, setCollapsed] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;

    if (latest > prev && latest > 80) {
      // scrolling down
      setCollapsed(true);
    } else if (latest < prev) {
      // scrolling up
      setCollapsed(false);
    }
  });

  return collapsed;
};

export default useCollapseOnScroll;
