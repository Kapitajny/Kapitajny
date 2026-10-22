import { currentPage, PAGE_PATHS } from "./page-context";

export function usePathname(): string {
  return PAGE_PATHS[currentPage()].route;
}
