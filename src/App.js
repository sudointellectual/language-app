import { useEffect, useState } from 'react'

import Language from './Language'

import './App.css'

function App() {
    const [languages, setLanguages] = useState([])
    const [activeLanguage, setActiveLanguage] = useState(null)

    const fetchLanguages = async () => {
        try {
            const response = await fetch(
                'https://restcountries.com/v3.1/all?fields=name,languages',
                {
                    method: 'GET',
                }
            )

            if (!response.ok) {
                console.log('network response failed')
            }

            // raw data
            const data = await response.json()

            // get a raw list of languages from data
            const langArray = []

            for (let i = 0; i < data.length; i++) {
                for (const [key, value] of Object.entries(data[i].languages)) {
                    langArray.push({ key: key, value: value })
                }
            }

            // now make them unique
            const unique = new Set()
            const uniqueLangs = []

            langArray.forEach((obj) => {
                const value = obj['value']
                if (!unique.has(value)) {
                    unique.add(value)
                    uniqueLangs.push(obj)
                }
            })

            // and finally sort alphabetically by key
            uniqueLangs.sort((a, b) =>
                a.value > b.value ? 1 : b.value > a.value ? -1 : 0
            )

            uniqueLangs.forEach((lang) => {
                let filteredCountries = data.filter((item) =>
                    Object.keys(item.languages).includes(lang.key)
                )

                filteredCountries.sort((a, b) =>
                    a.name.common > b.name.common
                        ? 1
                        : b.name.common > a.name.common
                        ? -1
                        : 0
                )

                lang.countries = filteredCountries
            })

            setLanguages(uniqueLangs)
        } catch (e) {
            console.log('error: ', e)
        }
    }

    const handleClick = (e) => {
        setActiveLanguage(e.target.value)
    }

    useEffect(() => {
        fetchLanguages()
    }, [])

    return (
        <div className="App">
            {languages.map((language, key) => {
                return (
                    <Language
                        className="language"
                        key={key}
                        language={language}
                        handleClick={handleClick}
                        activeLanguage={activeLanguage}
                    />
                )
            })}
        </div>
    )
}

export default App
