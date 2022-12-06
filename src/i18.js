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
                    land_use:"Land Use",
                    health_institutions:"Health Institutions",
                    railways:"Railways",
                    water_ways: "Water Ways",
                    waters: "Water Bodies",
                    districts: "Districts",
                    stops: "Stops",
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
                    land_use:"Arazi Kullanımı",
                    health_institutions:"Sağlık Birimleri",
                    railways:"Demir Yolları",
                    water_ways: "Su Yolları",
                    waters: "Su Alanları",
                    districts: "İlçeler",
                    stops: "Duraklar",
                    name:"Adı",
                    class: "Sınıf",
                    population:"Nüfus",
                    area:"Alan"
                }
            }
        }
    })
export default i18n;