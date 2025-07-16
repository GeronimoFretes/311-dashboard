"use client";

import { useContext } from "react";
import Link from "next/link";
import { MenuContext } from "@/contexts/MenuContext";

/** Sidebar — overlay en móvil, empuja en ≥ md  */
export default function SideMenu() {
  const { open, toggle } = useContext(MenuContext);

  /* Reusable link item */
  const Item = ({ href, children }: { href: string; children: string }) => (
    <li>
      <Link
        href={href}
        // onClick={toggle}
        className="block px-2 py-1 rounded hover:bg-gray-200 transition-colors"
      >
        {children}
      </Link>
    </li>
  );

  return (
    <>
      {/* Hamburger / close button */}
      <button
        aria-label="Toggle navigation menu"
        aria-expanded={open}
        onClick={toggle}
        className="fixed top-4 left-4 z-[60] flex flex-col items-center justify-center
                   w-10 h-10 space-y-1.5 focus:outline-none"
      >
        <span
          className={`h-0.5 w-6 bg-gray-800 transition-transform duration-300 ${
            open ? "translate-y-2 rotate-45" : ""
          }`}
        />
        <span
          className={`h-0.5 w-6 bg-gray-800 transition-all duration-300 ${
            open ? "opacity-0" : ""
          }`}
        />
        <span
          className={`h-0.5 w-6 bg-gray-800 transition-transform duration-300 ${
            open ? "-translate-y-2 -rotate-45" : ""
          }`}
        />
      </button>

      {/* Sidebar column */}
      <aside
        role="navigation"
        className={`fixed md:static top-0 left-0 z-50 h-screen bg-white shadow-lg
                    text-gray-900 overflow-y-auto transition-all duration-300
                    ${open ? "w-full sm:w-full md:w-48 lg:w-64" : "w-0 md:w-0"}`}
      >
        <nav className="pt-20 px-6 space-y-6">
          <Link
            href="#intro"
            // onClick={toggle}
            className="text-xl text-[#49A67A] font-semibold block py-1 px-2 rounded
                       hover:bg-gray-100 transition-colors"
          >
            Introducción
          </Link>

          <h3 className="text-xl text-[#49A67A] font-semibold mt-6 mb-2 px-2">Secciones</h3>
          <ul className="space-y-1 px-2">
            <Item href="#cover">Panorama General</Item>
            <Item href="#time-series">Evolución por Distrito</Item>
            <Item href="#map">Tipos de Reclamo</Item>
            <Item href="#agency-race">Reclamos por Agencia</Item>
            <Item href="#covid-impact">Impacto COVID-19</Item>
          </ul>
          <h3 className="text-xl text-[#49A67A] font-semibold mt-6 mb-2 px-2">Conclusión</h3>
          <ul className="space-y-1 px-2">
            <Item href="#final-thoughts">Reflexiones Finales</Item>
            <Item href="#about-us">Sobre Nosotros</Item>
          </ul>
{/* 
          <Link
            href="#conclusion"
            // onClick={toggle}
            className="text-xl text-[#49A67A] font-semibold block py-1 px-2 mt-6 rounded
                       hover:bg-gray-100 transition-colors"
          >
            Conclusión
          </Link> */}
        </nav>
      </aside>
    </>
  );
}
