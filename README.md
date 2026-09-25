# 311 NYC: Historia y Tendencias

Dashboard interactivo de análisis y storytelling sobre los reclamos al sistema 311 de la ciudad de Nueva York entre 2010 y 2024, con foco en los patrones de demanda ciudadana, las diferencias territoriales y los cambios observados antes, durante y después de la pandemia.

**[Explorar dashboard interactivo](https://311-covid-dashboard.vercel.app/)**

> La interfaz y la narrativa del proyecto están disponibles en español.

---

## Sobre el proyecto

Este proyecto transforma datos del sistema 311 de Nueva York en una experiencia visual interactiva pensada para explorar la ciudad desde sus fricciones cotidianas.

Más que mostrar gráficos aislados, la página está construida como una narrativa: arranca con un panorama general, profundiza en las diferencias territoriales entre boroughs, analiza qué agencias reciben más presión y cómo responden, y finalmente estudia el quiebre que produjo la pandemia en la dinámica de reclamos.

El resultado es una pieza de **data storytelling** que combina análisis exploratorio, visualización interactiva y diseño de producto para convertir una base masiva de reclamos ciudadanos en una historia legible, navegable y visualmente clara.

---

## Datos y metodología

El análisis cubre el período 2010–2024 y utiliza conjuntos de datos históricos preparados para explorar los reclamos ciudadanos registrados por el sistema 311 de Nueva York.

### Fuentes de referencia

Los datos públicos oficiales del sistema 311 pueden consultarse en NYC Open Data:

- [311 Service Requests - 2010 to 2019](https://data.cityofnewyork.us/Social-Services/311-Service-Requests-from-2010-to-2019/76ig-c548)
- [311 Service Requests - 2020 to Present](https://data.cityofnewyork.us/Social-Services/311-Service-Requests-from-2020-to-Present/erm2-nwe9)

### Datos utilizados por la aplicación

El repositorio incluye archivos CSV procesados y datos geográficos en `public/data/`, que alimentan las visualizaciones interactivas.

Entre las dimensiones e indicadores utilizados se encuentran:

- Evolución mensual de reclamos.
- Volumen y tasas de reclamos por borough.
- Tipos de reclamo.
- Volumen de solicitudes por agencia.
- Tiempo promedio de cierre registrado.
- Distribución territorial de la demanda.

Las visualizaciones se construyen sobre estos conjuntos de datos preparados. El repositorio no incluye el proceso completo de extracción y transformación de los registros originales.

### Alcance del análisis

El dashboard presenta un análisis histórico del período 2010–2024. No representa un sistema de monitoreo en tiempo real.

Los indicadores permiten describir patrones de demanda ciudadana y explorar diferencias territoriales y temporales. Estas asociaciones no deben interpretarse por sí solas como evidencia causal sobre las condiciones urbanas o el desempeño de las agencias.

En particular, el tiempo transcurrido hasta el cierre registrado de una solicitud no necesariamente equivale al tiempo efectivo de resolución del problema reportado.

---

## Qué se puede explorar

### 1) Panorama general de los reclamos
- KPIs principales del sistema 311
- volumen acumulado de reclamos
- promedio mensual
- mes pico
- evolución agregada en el tiempo
- tipos de reclamo más frecuentes

### 2) Evolución por borough
- comparación entre Brooklyn, Manhattan, Bronx, Queens y Staten Island
- vista en valores absolutos
- vista ajustada por población
- lectura territorial de la intensidad de reclamos

### 3) Mapa + ranking dinámico de tipos de queja
- mapa interactivo por borough
- densidad de reclamos por año
- evolución del ranking de los tipos de queja más frecuentes
- cruce entre dimensión temporal y espacial

### 4) Reclamos por agencia
- ranking dinámico de las agencias con mayor volumen de reclamos
- evolución mensual del top 10
- análisis de concentración de demanda institucional

### 5) Tiempo promedio de resolución
- seguimiento de las principales agencias
- comparación de eficiencia relativa
- cambios y picos en los tiempos de respuesta

### 6) Impacto del COVID-19
- comparación entre período pre, durante y post pandemia
- evolución de reclamos en la era COVID
- lectura territorial del cambio en el comportamiento ciudadano
- continuidad de ciertas problemáticas estructurales, como el ruido

---

## Tecnologías y arquitectura

El dashboard fue desarrollado como una aplicación web interactiva utilizando:

- **Next.js, React y TypeScript:** estructura y desarrollo de la aplicación.
- **D3, ECharts y Recharts:** visualizaciones y componentes gráficos interactivos.
- **MapLibre GL:** visualización geográfica.
- **Papa Parse:** lectura de los archivos CSV utilizados por la aplicación.

La aplicación está organizada en secciones temáticas y componentes de visualización independientes.

Los conjuntos de datos procesados se encuentran en `public/data/` y son utilizados por los distintos componentes para construir gráficos, mapas e indicadores.

Esta estructura permite separar la presentación visual de los datos utilizados y facilita el mantenimiento y la evolución de las visualizaciones.

---

## Por qué este proyecto es interesante

Este trabajo nos interesó especialmente porque mezcla tres cosas que disfrutamos mucho:

- **análisis de datos**, para detectar patrones y contrastes relevantes
- **visualización**, para transformar datos complejos en algo intuitivo
- **storytelling**, para construir una narrativa que tenga sentido más allá del gráfico

La idea central fue usar los reclamos al 311 no solo como una base administrativa, sino como una forma de leer el pulso urbano: qué problemas persisten, dónde se concentran, cómo cambia la demanda ciudadana en contextos críticos y qué revela eso sobre la vida en la ciudad.

---

## Cómo correrlo localmente

```bash
npm install
npm run dev
```

Luego abrir en el navegador:

```bash
http://localhost:3000
```

---

## Créditos

Proyecto desarrollado por **Ramón Eppens** y **Gerónimo Fretes**.

---

## Contacto

Si te interesa conversar sobre el proyecto, visualización de datos, storytelling o productos de analytics, podés escribirme:

- **Email:** [gfretes@itba.edu.ar](mailto:gfretes@itba.edu.ar)
- **LinkedIn:** [Gerónimo Fretes](https://www.linkedin.com/in/geronimo-fretes-18017b245)
