export type TonoMarca = "formal" | "cercano" | "premium" | "tecnico" | "otro";
export type ObjetivoPrincipal = "leads" | "ventas" | "soporte" | "reservas" | "otro";
export type Canal = "web" | "whatsapp" | "ambos";
export type MomentoCaptura = "inicio" | "durante" | "final" | "al_detectar_interes";
export type EstiloAsistente = "asesor" | "vendedor" | "soporte" | "experto";
export type DatoCapturar = "nombre" | "email" | "telefono" | "empresa" | "necesidad";

export type FaqItem = {
  pregunta: string;
  respuesta: string;
};

export type ObjecionItem = {
  objecion: string;
  respuesta: string;
};

export type ChatbotBriefing = {
  nombre_empresa: string;
  nombre_contacto: string;
  email: string;
  telefono: string;
  web: string;
  sector: string;
  descripcion_negocio: string;
  servicios: string;
  cliente_ideal: string;
  propuesta_valor: string;
  tono_marca: TonoMarca;
  objetivo_principal: ObjetivoPrincipal;
  canal: Canal;
  accion_final: string;
  derivacion_humano: boolean;
  faqs: FaqItem[];
  objeciones: ObjecionItem[];
  datos_a_capturar: DatoCapturar[];
  momento_captura: MomentoCaptura;
  que_es_lead_caliente: string;
  como_se_presenta: string;
  estilo_asistente: EstiloAsistente;
  que_evitar: string;
  palabras_clave: string;
  informacion_extra: string;
};

export const initialBriefing: ChatbotBriefing = {
  nombre_empresa: "",
  nombre_contacto: "",
  email: "",
  telefono: "",
  web: "",
  sector: "",
  descripcion_negocio: "",
  servicios: "",
  cliente_ideal: "",
  propuesta_valor: "",
  tono_marca: "cercano",
  objetivo_principal: "leads",
  canal: "web",
  accion_final: "",
  derivacion_humano: true,
  faqs: [{ pregunta: "", respuesta: "" }],
  objeciones: [{ objecion: "", respuesta: "" }],
  datos_a_capturar: ["nombre", "email", "telefono"],
  momento_captura: "al_detectar_interes",
  que_es_lead_caliente: "",
  como_se_presenta: "",
  estilo_asistente: "asesor",
  que_evitar: "",
  palabras_clave: "",
  informacion_extra: "",
};

