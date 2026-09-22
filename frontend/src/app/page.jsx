import { redirect } from "next/navigation";

/**
 * MPLADS Sentinel - Primary Entrypoint
 * The landing page has been removed; the Command Center is the main dashboard and primary application interface.
 */
export default function RootPage() {
  redirect("/login");
}
