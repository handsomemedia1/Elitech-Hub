import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";
import styles from "./PageLayout.module.css";

interface PageLayoutProps {
  children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className={styles.pageWrapper}>
      <main className={styles.pageMain}>{children}</main>
      <Footer />
    </div>
  );
}
