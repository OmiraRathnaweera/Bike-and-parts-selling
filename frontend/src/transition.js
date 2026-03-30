import { motion } from "framer-motion";

const transition = (OgComponent) => {
  return () => (
    <motion.div
      initial={{ scale: 0.94, opacity: 0, y: 12 }}
      animate={{ scale: 1,    opacity: 1, y: 0  }}
      exit={{    scale: 0.94, opacity: 0, y: 12  }}
      transition={{
        duration: 0.35,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      style={{
        width: "100%",
        transformOrigin: "center top",
      }}
    >
      <OgComponent />
    </motion.div>
  );
};

export default transition;