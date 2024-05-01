const Language = ({ language, handleClick, activeLanguage }) => {
    return (
        <div className={activeLanguage === language.key ? 'active' : null}>
            <button value={language.key} onClick={handleClick}>
                {language.value} ({language.key})
            </button>

            <ul className="dropdown">
                {language.countries.map((country, key) => (
                    <li key={key}>{country.name.common}</li>
                ))}
            </ul>
        </div>
    )
}

export default Language
