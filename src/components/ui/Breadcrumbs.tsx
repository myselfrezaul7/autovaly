import Link from "next/link";
import { BreadcrumbItem } from "@/components/BreadcrumbJsonLd";

export default function Breadcrumbs({ crumbs }: { crumbs: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center space-x-2 text-sm text-muted">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={crumb.url} className="flex items-center">
              {isLast ? (
                <span className="font-semibold text-text-light" aria-current="page">
                  {crumb.name}
                </span>
              ) : (
                <>
                  <Link href={crumb.url} className="hover:text-accent transition-colors">
                    {crumb.name}
                  </Link>
                  <span className="mx-2 text-border-custom" aria-hidden="true">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
