import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
    .use(initReactI18next)
    .init({
        fallbackLng: 'tr',
        resources:{
            en:{
                translation:
                {
                    query:"Query",
                    analysis:"Anaylsis",
                    map:"Map",
                    name:"Name",
                    class: "Class",
                    population:"Population",
                    area:"Area"
                }
            },
            tr:{
                translation:
                {
                    query:"Sorgu",
                    analysis:"Analiz",
                    map:"Harita",
                    name:"Adı",
                    class: "Sınıf",
                    population:"Nüfus",
                    area:"Alan"
                }
            }
        }
    })
export default i18n;