import { createServiceClient } from "@/lib/supabase-server";
import styles from "./Testimonials.module.css";

export default async function TestimonialsSection() {
  const supabase = createServiceClient();
  
  if (!supabase) {
    return null;
  }

  const { data: testimonials, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error || !testimonials || testimonials.length === 0) {
    return null; // Don't render section if no published testimonials
  }

  return (
    <section className={styles.testimonialSection}>
      <div className={styles.header}>
        <h2 className={styles.title}>What Our Graduates Say</h2>
        <p className={styles.subtitle}>Real stories from our Nigerian and diaspora students.</p>
      </div>

      <div className={styles.marqueeContainer}>
        <div className={styles.marquee}>
          {testimonials.map((t) => (
            <div key={t.id} className={styles.card}>
              <div className={styles.cardContent}>
                <p className={styles.quote}>"{t.content}"</p>
                <div className={styles.authorInfo}>
                  <strong>{t.author_name}</strong>
                  {t.author_role && <span> • {t.author_role}</span>}
                </div>
              </div>
              
              <div className={styles.verificationStamp}>
                <span className={styles.dot}></span>
                [VERIFIED] via {t.source_platform}
              </div>
            </div>
          ))}
          {/* Duplicate for infinite scroll effect if needed */}
          {testimonials.map((t) => (
            <div key={`${t.id}-dup`} className={styles.card} aria-hidden="true">
              <div className={styles.cardContent}>
                <p className={styles.quote}>"{t.content}"</p>
                <div className={styles.authorInfo}>
                  <strong>{t.author_name}</strong>
                  {t.author_role && <span> • {t.author_role}</span>}
                </div>
              </div>
              
              <div className={styles.verificationStamp}>
                <span className={styles.dot}></span>
                [VERIFIED] via {t.source_platform}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
