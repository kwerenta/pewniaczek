import { MainNavContainer } from "./main-nav-container";
import NavLink from "./nav-link";

export function MainNav() {
  return (
    <MainNavContainer>
      <NavLink href="/" exact>
        Zakłady
      </NavLink>
      <NavLink href="/coupons">Kupony</NavLink>
    </MainNavContainer>
  );
}
