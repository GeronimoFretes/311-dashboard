// EmailCard.tsx
import { Mail } from 'lucide-react';

export default function EmailCard() {
  return (
    <div className="w-full flex">
      {/* Card: solo tan ancha como su contenido */}
      <div className="w-max rounded-2xl bg-white/90 backdrop-blur shadow-xl ring-1 ring-gray-200 px-6 py-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
          <Mail className="h-5 w-5 stroke-[2.5]" />
          Contacto
        </h3>

        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-center gap-2">
            {/* <Mail className="h-4 w-4 stroke-[2]" /> */}
            <a href="mailto:reppens@itba.edu.ar" className="hover:underline">
              reppens@itba.edu.ar
            </a>
          </li>
          <li className="flex items-center gap-2">
            {/* <Mail className="h-4 w-4 stroke-[2]" /> */}
            <a href="mailto:gfretes@itba.edu.ar" className="hover:underline">
              gfretes@itba.edu.ar
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
