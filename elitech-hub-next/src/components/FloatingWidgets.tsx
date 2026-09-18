"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, X } from "lucide-react";
import Image from "next/image";
import styles from "./FloatingWidgets.module.css";
import Chatbot from "./Chatbot";

export function FloatingChatbot() {
  return <Chatbot />;
}

export function TrustBadge() {
  const [activeCert, setActiveCert] = useState<"CAC" | "SMEDAN" | null>(null);

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, type: "spring" }}
        className={styles.trustBadgeWrapper}
      >
        <div className={styles.trustBadgeIcon}>
          <ShieldCheck size={20} />
        </div>
        <div className={styles.trustBadgeContent}>
          <div className={styles.trustBadgeTitle}>Verified Secure</div>
          <div className={styles.certButtons}>
            <button onClick={() => setActiveCert("CAC")} className={styles.certBtn}>
              CAC
            </button>
            <button onClick={() => setActiveCert("SMEDAN")} className={styles.certBtn}>
              SMEDAN
            </button>
          </div>
        </div>
      </motion.div>

      {/* Certificate Modal */}
      <AnimatePresence>
        {activeCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.certModalOverlay}
            onClick={() => setActiveCert(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={styles.certModalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <button className={styles.certCloseBtn} onClick={() => setActiveCert(null)}>
                <X size={24} />
              </button>
              <div className={styles.certImageWrapper}>
                <Image 
                  src={`/images/${activeCert}.png`} 
                  alt={`${activeCert} Certificate`}
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div className={styles.certFooter}>
                <h3>Official {activeCert} Certification</h3>
                <p>Elitech Hub is a fully registered and compliant entity.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
