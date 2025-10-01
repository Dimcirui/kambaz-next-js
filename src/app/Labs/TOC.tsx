import { Nav, NavItem, NavLink } from "react-bootstrap";
import Link from "next/link";
export default function TOC() {
 return (
   <Nav variant="pills">
     <NavItem>
       <NavLink href="/Labs" id="wd-lab1-link">
         Home </NavLink>
     </NavItem>
     <NavItem>
       <NavLink href="/Labs/Lab1" id="wd-lab1-link">
         Lab 1 </NavLink>
     </NavItem>
     <NavItem>
       <NavLink href="/Labs/Lab2" id="wd-lab2-link">
         Lab 2 </NavLink>
     </NavItem>
     <NavItem>
       <NavLink href="/Labs/Lab3" id="wd-lab3-link">
         Lab 3 </NavLink>
     </NavItem>
     <NavItem>
       <NavLink href="/" id="wd-kambaz-link">
         Kambaz </NavLink>
     </NavItem>
     <NavItem>
       <NavLink href="https://github.com/Dimcirui/kambaz-next-js/tree/a2" id="wd-github">
         Github</NavLink>
     </NavItem>
   </Nav>
);}
