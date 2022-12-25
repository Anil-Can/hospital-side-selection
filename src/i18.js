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
                    area:"Area",
                    Risk_Level:"Risk Level",
                    very_heigh:"Very High",
                    heigh:"High",
                    medium:"Medium",
                    low:"Low",
                    no:"No",
                    Noise_Level:"Noise Level",
                    so_close:"Very Close",
                    close:"Close",
                    not_close_not_far:"Not Close Not Far",
                    far:"Far",
                    very_far:"Very Far",

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
                    area:"Alan",
                    Risk_Level:"Risk Seviyesi",
                    very_heigh:"Çok Yüksek",
                    heigh:"Yüksek",
                    medium:"Orta",
                    low:"Düşük",
                    no:"Yok",
                    Noise_Level:"Gürültü Seviyesi",
                    so_close:"Çok Yakın",
                    close:"Yakın",
                    not_close_not_far:"Ne Yakın Ne Uzak",
                    far:"Uzak",
                    very_far:"Çok Uzak",

                }
            }
        }
    })
export default i18n;