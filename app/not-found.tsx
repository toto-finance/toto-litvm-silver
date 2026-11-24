import Link from "next/link";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Not found",
  description: "That page is not on the Toto Finance shelf.",
  path: "/",
  index: false,
});

export default function NotFound() {
  return (
    <section className="section">
      <div className="wrap narrow">
        <p className="kicker">Missing</p>
        <h1>That page is not on the shelf.</h1>
        <Link className="btn" href="/">
          Back to Toto Finance
        </Link>
      </div>
    </section>
  );
}
