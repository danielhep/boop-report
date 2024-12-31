import { Github } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto py-8 px-8 text-text-muted">
      <div className="max-w-4xl mx-auto text-center">
        <p className="mb-4">
          Created by{" "}
          <Link
            href="https://github.com/danielhep"
            className="text-text-main hover:underline"
            target="_blank"
          >
            Daniel Heppner
          </Link>
          ,{" "}
          <Link
            href="https://github.com/christatebbs"
            className="text-text-main hover:underline"
            target="_blank"
          >
            Christa Tebbs
          </Link>
          , and{" "}
          <Link
            href="https://www.konafarry.com/"
            className="text-text-main hover:underline"
            target="_blank"
          >
            Kona Farry
          </Link>
        </p>
        <p className="mb-4 text-sm">
          This is an unofficial tool and is not affiliated with ORCA, Sound Transit, King County Metro,
          or any other transit agency.
        </p>
        <Link
          href="https://github.com/danielhep/boop-report"
          className="inline-flex items-center gap-2 text-text-main hover:underline"
          target="_blank"
        >
          <Github size={20} />
          View on GitHub
        </Link>
      </div>
    </footer>
  );
} 