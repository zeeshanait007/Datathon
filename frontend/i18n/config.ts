import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "Dashboard": "Dashboard",
      "AI Copilot": "AI Copilot",
      "FIR Search": "FIR Search",
      "Criminal Network": "Criminal Network",
      "Crime Trends": "Crime Trends",
      "Hotspot Analysis": "Hotspot Analysis",
      "Offender Profiles": "Offender Profiles",
      "Reports": "Reports",
      "Audit Logs": "Audit Logs",
      "Settings": "Settings",
      "Total FIRs": "Total FIRs",
      "Active Investigations": "Active Investigations",
      "Repeat Offenders": "Repeat Offenders",
      "Crime Hotspots": "Crime Hotspots",
      "Cases Closed": "Cases Closed",
      "Search": "Search...",
      "Login": "Login",
      "Username": "Username",
      "Password": "Password"
    }
  },
  kn: {
    translation: {
      "Dashboard": "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
      "AI Copilot": "ಎಐ ಕೋಪೈಲಟ್",
      "FIR Search": "ಎಫ್ಐಆರ್ ಹುಡುಕಾಟ",
      "Criminal Network": "ಕ್ರಿಮಿನಲ್ ನೆಟ್‌ವರ್ಕ್",
      "Crime Trends": "ಅಪರಾಧ ಪ್ರವೃತ್ತಿಗಳು",
      "Hotspot Analysis": "ಹಾಟ್‌ಸ್ಪಾಟ್ ವಿಶ್ಲೇಷಣೆ",
      "Offender Profiles": "ಅಪರಾಧಿಗಳ ವಿವರಗಳು",
      "Reports": "ವರದಿಗಳು",
      "Audit Logs": "ಆಡಿಟ್ ಲಾಗ್‌ಗಳು",
      "Settings": "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
      "Total FIRs": "ಒಟ್ಟು ಎಫ್ಐಆರ್‌ಗಳು",
      "Active Investigations": "ಸಕ್ರಿಯ ತನಿಖೆಗಳು",
      "Repeat Offenders": "ಮರುಕಳಿಸುವ ಅಪರಾಧಿಗಳು",
      "Crime Hotspots": "ಅಪರಾಧ ಹಾಟ್‌ಸ್ಪಾಟ್‌ಗಳು",
      "Cases Closed": "ಮುಚ್ಚಿದ ಪ್ರಕರಣಗಳು",
      "Search": "ಹುಡುಕಿ...",
      "Login": "ಲಾಗಿನ್",
      "Username": "ಬಳಕೆದಾರ ಹೆಸರು",
      "Password": "ಪಾಸ್ವರ್ಡ್"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
