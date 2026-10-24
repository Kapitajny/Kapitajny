import type { Department } from "@/content/company";
import { mailHref, telHref } from "@/lib/format";
import { MailIcon, PhoneIcon } from "./Icons";

/** Dział z klikalnymi numerami i adresem e-mail. */
export function DepartmentContact({ department, compact }: { department: Department; compact?: boolean }) {
  return (
    <div className="ui">
      <h3 className={compact ? "text-[1rem] font-semibold" : "display-sm"}>{department.name}</h3>
      {!compact && <p className="mt-1.5 font-serif text-[1rem] text-muted">{department.scope}</p>}
      <ul className="mt-3 space-y-1.5 text-[0.9375rem]">
        {department.phones.map((p) => (
          <li key={p.display}>
            {p.note === "faks" ? (
              <span className="text-muted">faks {p.display}</span>
            ) : (
              <a href={telHref(p.display)} className="inline-flex min-h-8 items-center gap-2 font-semibold hover:text-red">
                <PhoneIcon size={16} className="text-red" />
                {p.display}
              </a>
            )}
          </li>
        ))}
        {department.email && (
          <li>
            <a href={mailHref(department.email)} className="inline-flex min-h-8 items-center gap-2 hover:text-red">
              <MailIcon size={16} className="text-red" />
              {department.email}
            </a>
          </li>
        )}
      </ul>
    </div>
  );
}
