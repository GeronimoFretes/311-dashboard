export default function HeroHeader() {
  return (
    <section className="w-full bg-white py-10 px-6 md:px-12">
      <div className="max-w-5xl mx-auto flex items-center gap-4">
        <img
          src="/favicon.ico"
          alt="Logo"
          className="w-10 h-10 md:w-20 md:h-20"
        />
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#84BF69]">
            311 NYC: Una Década de Reclamos Ciudadanos
          </h1>
          <p className="text-gray-700 mt-2 text-base md:text-lg">
            Explorá cómo evolucionaron los reclamos entre 2010 y 2025, con foco en los efectos del COVID-19.
          </p>
        </div>
      </div>
    </section>
  );
}
