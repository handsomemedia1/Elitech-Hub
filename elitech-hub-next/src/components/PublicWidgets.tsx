"use client";

import { usePathname } from "next/navigation";
import { FloatingChatbot, TrustBadge } from "./FloatingWidgets";
import LeadPopup from "./LeadPopup";
import ResearchBanner from "./ResearchBanner";

/**
 * Renders public-facing floating widgets (chatbot, trust badge, lead popup)
 * only on non-dashboard pages. They are hidden on /admin and /writer routes
 * so they don't clutter the CMS interface.
 */
export default function PublicWidgets() {
  const pathname = usePathname();

  // Hide all floating widgets inside the admin / writer dashboards
  const isDashboard =
    pathname.startsWith("/admin") || pathname.startsWith("/writer") || pathname.startsWith("/researcher");

  if (isDashboard) return null;

  return (
    <>
      <FloatingChatbot />
      <TrustBadge />
      <LeadPopup />
      <ResearchBanner />
    </>
  );
}
