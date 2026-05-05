// import OpenAI from "openai";

// const client = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

// export const generateFeedback = async (consigna: string, respuesta: string) => {

//   const prompt = `
// Actúa como un docente de un curso introductorio sobre Inteligencia Artificial en la Administración Pública.

// El objetivo de esta actividad NO es evaluar en profundidad, sino validar que el alumno haya realizado el ejercicio utilizando IA.

// Genera una devolución breve, clara y en tono cercano (estilo docente real, no robótico).

// Estructura:

// 1) Validación general del trabajo (positiva)
// 2) Mención del uso de IA como herramienta
// 3) Una sugerencia simple y no obligatoria para mejorar

// Condiciones:
// - No ser crítico ni técnico
// - No usar frases genéricas tipo "excelente trabajo"
// - No más de 5 líneas
// - Lenguaje simple y natural

// Consigna:
// ${consigna}

// Respuesta del alumno:
// ${respuesta}
// `;

//   const completion = await client.chat.completions.create({
//     model: "gpt-4o-mini",
//     messages: [{ role: "user", content: prompt }],
//     temperature: 0.4
//   });

//   return completion.choices[0].message.content;
// };

import Groq from "groq-sdk";

// Inicializamos Groq (necesitas tu API KEY de groq.com)
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export const generateFeedback = async (consigna: string, respuesta: string) => {
  const prompt = `
    Actúa como un docente de un curso introductorio sobre Inteligencia Artificial en la Administración Pública.
    El objetivo de esta actividad NO es evaluar en profundidad, sino validar que el alumno haya realizado el ejercicio utilizando IA.
    Genera una devolución breve, clara y en tono cercano (estilo docente real, no robótico).

    Estructura:
    1) Validación general del trabajo (positiva)
    2) Mención del uso de IA como herramienta
    3) Una sugerencia simple y no obligatoria para mejorar

    Condiciones:
    - No ser crítico ni técnico
    - No usar frases genéricas tipo "excelente trabajo"
    - No más de 5 líneas
    - Lenguaje simple y natural

    Consigna: ${consigna}
    Respuesta del alumno: ${respuesta}
  `;

  try {
    const completion = await groq.chat.completions.create({
      // Modelo gratuito y potente
      model: "llama-3.3-70b-versatile", 
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      max_tokens: 150, // Limitamos para asegurar brevedad
    });

    return completion.choices[0]?.message?.content || "No se pudo generar el feedback.";
  } catch (error) {
    console.error("Error en Groq:", error);
    throw error; // Para que tu fallback en express capture el error
  }
};