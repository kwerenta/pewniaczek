import { MainNavContainer } from "./main-nav-container";
import NavLink from "./nav-link";

export function AdminNav() {
  return (
    <MainNavContainer isAdminPage>
      <NavLink href="/admin/categories">Kategorie</NavLink>
      <NavLink href="/admin/types">Rodzaje zakładów</NavLink>
    </MainNavContainer>
  );
}
