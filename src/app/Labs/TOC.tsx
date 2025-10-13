"use client";
import { Nav, NavItem, NavLink } from "react-bootstrap";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function TOC() {
  const pathname = usePathname();
 return (
   <Nav variant="pills">
     <NavItem>
       <NavLink href="/Labs" id="wd-labs-link" as={Link} className={`nav-link ${pathname.endsWith("Labs") ? "active" : ""}`}>
         Home </NavLink>
     </NavItem>
     <NavItem>
       <NavLink href="/Labs/Lab1" id="wd-lab1-link" as={Link} className={`nav-link ${pathname.endsWith("Lab1") ? "active" : ""}`}>
         Lab 1 </NavLink>
     </NavItem>
     <NavItem>
       <NavLink href="/Labs/Lab2" id="wd-lab2-link" as={Link} className={`nav-link ${pathname.endsWith("Lab2") ? "active" : ""}`}>
         Lab 2 </NavLink>
     </NavItem>
     <NavItem>
       <NavLink href="/Labs/Lab3" id="wd-lab3-link" as={Link} className={`nav-link ${pathname.endsWith("Lab3") ? "active" : ""}`}>
         Lab 3 </NavLink>
     </NavItem>
     <NavItem>
       <NavLink href="/" id="wd-kambaz-link" as={Link}>
         Kambaz </NavLink>
     </NavItem>
     <NavItem>
       <NavLink href="https://github.com/Dimcirui/kambaz-next-js/tree/a3" id="wd-github">Github</NavLink>
     </NavItem>
   </Nav>
);}
