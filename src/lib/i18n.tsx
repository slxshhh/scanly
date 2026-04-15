import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'pt';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    brand: "Scanly",
    studio: "Studio",
    heroTitle: "SCANLY",
    heroSubtitle: "The professional standard for QR design. High-performance, cloud-synced, and built for modern brands.",
    designStudio: "Design Studio",
    designStudioDesc: "Craft your professional QR identity",
    assetVault: "Asset Vault",
    assetVaultDesc: "Your synchronized professional designs",
    saveToCloud: "Save to Cloud",
    saving: "Saving...",
    exportOptions: "Export Options",
    downloadPng: "DOWNLOAD PNG",
    studioTip: "Studio Tip: High-contrast designs ensure 100% scan reliability across all professional print media.",
    agentTitle: "Studio Agent",
    agentOnline: "ONLINE",
    agentPlaceholder: "Ask about QR design...",
    agentWelcome: "Hello! I am your Scanly Studio assistant. How can I help you design your perfect QR code today?",
    login: "Login",
    logout: "Logout",
    github: "GitHub",
    contentSize: "Content & Size",
    qrData: "QR Data",
    width: "Width",
    height: "Height",
    margin: "Outer Margin",
    patternStyle: "Pattern Style",
    dotPattern: "Dot Pattern",
    cornerFrames: "Corner Frames",
    frameShape: "Frame Shape",
    cornerEyes: "Corner Eyes",
    eyeShape: "Eye Shape",
    canvas: "Canvas",
    logoBranding: "Logo & Branding",
    brandAssets: "Brand Assets",
    uploadLogo: "Upload PNG or SVG",
    loginToUpload: "Login to upload your brand logo",
    directUrl: "Direct URL",
    clearance: "Clearance",
    hideDots: "Hide Dots",
    logoScale: "Logo Scale",
    logoPadding: "Logo Padding",
    advancedEngine: "Advanced Engine",
    renderEngine: "Render Engine",
    encoding: "Encoding",
    correction: "Correction",
    exportConfig: "EXPORT CONFIGURATION",
    noSaved: "No saved QR codes yet.",
    loadDesign: "Load Design",
    refresh: "Refresh",
    deleteConfirm: "Are you sure you want to delete this QR code?",
    saveSuccess: "QR code saved successfully!",
    saveError: "Failed to save QR code",
    enterName: "Enter a name for this QR code:",
    loginRequired: "Please login to save your QR codes to the cloud."
  },
  pt: {
    brand: "Scanly",
    studio: "Studio",
    heroTitle: "SCANLY",
    heroSubtitle: "O padrão profissional para design de QR. Alta performance, sincronizado na nuvem e feito para marcas modernas.",
    designStudio: "Estúdio de Design",
    designStudioDesc: "Crie sua identidade QR profissional",
    assetVault: "Cofre de Ativos",
    assetVaultDesc: "Seus designs profissionais sincronizados",
    saveToCloud: "Salvar na Nuvem",
    saving: "Salvando...",
    exportOptions: "Opções de Exportação",
    downloadPng: "BAIXAR PNG",
    studioTip: "Dica do Estúdio: Designs de alto contraste garantem 100% de confiabilidade de leitura em todas as mídias impressas profissionais.",
    agentTitle: "Agente do Estúdio",
    agentOnline: "ONLINE",
    agentPlaceholder: "Pergunte sobre design de QR...",
    agentWelcome: "Olá! Eu sou o assistente do Scanly Studio. Como posso ajudar você a criar o seu QR code perfeito hoje?",
    login: "Entrar",
    logout: "Sair",
    github: "GitHub",
    contentSize: "Conteúdo e Tamanho",
    qrData: "Dados do QR",
    width: "Largura",
    height: "Altura",
    margin: "Margem Externa",
    patternStyle: "Estilo do Padrão",
    dotPattern: "Padrão de Pontos",
    cornerFrames: "Molduras dos Cantos",
    frameShape: "Forma da Moldura",
    cornerEyes: "Olhos dos Cantos",
    eyeShape: "Forma do Olho",
    canvas: "Tela",
    logoBranding: "Logo e Branding",
    brandAssets: "Ativos da Marca",
    uploadLogo: "Upload PNG ou SVG",
    loginToUpload: "Faça login para enviar o logo da sua marca",
    directUrl: "URL Direta",
    clearance: "Espaçamento",
    hideDots: "Ocultar Pontos",
    logoScale: "Escala do Logo",
    logoPadding: "Preenchimento do Logo",
    advancedEngine: "Motor Avançado",
    renderEngine: "Motor de Renderização",
    encoding: "Codificação",
    correction: "Correção",
    exportConfig: "EXPORTAR CONFIGURAÇÃO",
    noSaved: "Nenhum QR code salvo ainda.",
    loadDesign: "Carregar Design",
    refresh: "Atualizar",
    deleteConfirm: "Tem certeza que deseja excluir este QR code?",
    saveSuccess: "QR code salvo com sucesso!",
    saveError: "Falha ao salvar QR code",
    enterName: "Digite um nome para este QR code:",
    loginRequired: "Por favor, faça login para salvar seus QR codes na nuvem."
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('pt'); // Default to PT as requested

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
