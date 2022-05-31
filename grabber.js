import axios from 'axios'
import {writeFileSync} from 'fs'

const apiKey = 'f0d552bd-c2b1-4b55-bb80-446891086e2b'
const geocode = async query => {
    const { data } = await axios.get(
        'https://geocode-maps.yandex.ru/1.x',
        {
            params: {
                apikey: apiKey,
                geocode: query,
                format: 'json',
                results: 1
            }
        })

    return data.response
}
const getComponent = (geoObject, component = 'street') => {
    const components = geoObject.metaDataProperty.GeocoderMetaData.Address.Components

    return components.find(({ kind }) => kind === component).name
}
const delay = (ms, prev = 0) => new Promise(resolve => {
    if (prev) {
        const passed = +new Date - prev
        ms -= passed
        if (ms < 0) ms = 0
    }
    setTimeout(resolve, ms)
})
const streets = [
        {
            name: 'Береговая',
            houses: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 47, 49, 2, 4]
        },
        {
            name: 'Коллективная',
            houses: [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 44]
        },
        {
            name: 'Мирный',
            houses: [1, 3, 5, 7, 9]
        },
        {
            name: 'Полевая',
            houses: [1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 33, 35, 37, 39, 41, 43]
        },
        {
            name: 'Рабочая',
            houses: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
        },
        {
            name: 'Светлая',
            houses: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, '12А', '13к2', 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 46, 48, 50]
        },
        {
            name: 'Светлый',
            houses: [2, 4, 6, 8, 10, 12]
        },
        {
            name: 'Советская',
            houses: [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 77, 79, 81, 83, 84, 86, 87, 88, 89, 90, 91, 92, 93, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 108, 109, 111, 113, 114, 115, 116, 117, 118, 120, 121, 122, 123, 124, 125, 126, 127, 128, 130, 131, 133, 134, 135, 136, 137, 138, 141, 142, 143, 145, 147, 149, 151, 153, 155, 157, 159, '159А', 161, 163, 165, 167, 169, 171, 173, 175, 177, 179, 181, 185, 187, 191, 193, 195, 197, 199]
        },
        {
            name: 'Шиферная',
            houses: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20]
        },
        {
            name: 'Школьная',
            houses: [1, 2, 4, 6, 8, 9, '9А', 10, 11, 12, 14, 16, 18, 20, 22, 28]
        },
    ]

let data = ''

;(async () => {
    for (const { name: street, houses } of streets) {
        for (const house of houses) {
            const current = +new Date
            const result = await geocode(`Ульяновская область, Новоспасский район, село Садовое, ${ street }, ${ house }`)
            const geoObject = result.GeoObjectCollection.featureMember[0].GeoObject
            const pos = geoObject.Point.pos
            const streetName = getComponent(geoObject)
            const houseName = getComponent(geoObject, 'house')
            data += `${streetName}, ${houseName}, ${pos}\n`
            console.log(`${streetName}, ${houseName}, ${pos}`)
            await delay(50, current)
        }
    }

    writeFileSync('data.csv', data)
})()
