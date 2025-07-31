import React, { useEffect, useState } from 'react'
import { client } from '../Sanity'
import { NavLink, useLocation } from 'react-router-dom'
import './Navbar.scss'

export default function Navbar() {
    const [navbarData, setNavbarData] = useState(null)
    const [activeDropdownIndex, setActiveDropdownIndex] = useState(null)
    const location = useLocation()

    useEffect(() => {
        client
            .fetch(`*[_type == "navigationBar"][0]`)
            .then((data) => setNavbarData(data))
            .catch(console.error)
    }, [])
    console.log("linksBlock:", navbarData?.linksBlock);
    // Affiche les liens des dropdown dans la console
    if (navbarData?.linksBlock) {
        navbarData.linksBlock.forEach(link => {
            if (link.dropdown && link.dropdown.length > 0) {
                console.log(`Dropdown for "${link.label}":`, link.dropdown.map(item => item.label));
            }
        });
    }

    // Fermer le dropdown si l'URL change
    useEffect(() => {
        setActiveDropdownIndex(null)
    }, [location.pathname])

    // Fonction pour créer un slug propre à partir d’un label
    const slugify = (text) => {
        return text
            .toString()
            .toLowerCase()
            .normalize('NFD')                   // décompose les caractères accentués
            .replace(/[\u0300-\u036f]/g, '')    // retire les accents
            .replace(/\s+/g, '')                // supprime les espaces
            .replace(/[^\w-]+/g, '')            // supprime les caractères spéciaux
    }

    if (!navbarData) return <div>Chargement de la navigation...</div>

    const { logo, titleBlock, linksBlock, dualTitleBlock } = navbarData

    const toggleDropdown = (index) => {
        setActiveDropdownIndex(prev => (prev === index ? null : index))
    }

    return (
        <nav className='Navbar'>
            <div className='LogoNav'>
                {logo && (
                    <img
                        src={logo.asset.url}
                        alt="Logo"
                        className='LogoImage'
                    />
                )}
                {titleBlock && (
                    <div className='TitleBlock'>
                        <h1>{titleBlock.title}</h1>
                        <p>{titleBlock.subtitle}</p>
                    </div>
                )}
            </div>

            {/* Liens principaux */}
            <ul className='LinksBlock'>
                {linksBlock?.map((link, index) => {
                    const hasDropdown = link.dropdown && link.dropdown.length > 0
                    const isDropdownOpen = activeDropdownIndex === index

                    return (
                        <li key={index} className='LinkWithDropdown'>
                            <NavLink
                                className={({ isActive }) =>
                                    `LinkItems ${isActive ? 'active' : 'inactive'}`
                                }
                                to={hasDropdown ? '#' : `/${slugify(link.label)}`}
                                onClick={(e) => {
                                    if (hasDropdown) {
                                        e.preventDefault()
                                        toggleDropdown(index)
                                    }
                                }}
                            >
                                {link.label}

                                {hasDropdown && (
                                    <svg
                                        className={`DropdownIcon ${isDropdownOpen ? 'open' : 'close'}`}
                                        width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12.3965 0.555669C12.6421 0.222182 13.1108 0.150939 13.4443 0.396489C13.7778 0.642102 13.849 1.11083 13.6035 1.44434V1.44532L13.6025 1.44629C13.6019 1.44715 13.6007 1.4487 13.5996 1.4502C13.5973 1.45334 13.5941 1.45815 13.5898 1.46387C13.581 1.47576 13.5684 1.49325 13.5517 1.51563C13.5181 1.56078 13.4682 1.62657 13.4052 1.70997C13.2793 1.87671 13.0981 2.11473 12.876 2.39942C12.4321 2.96816 11.8216 3.72925 11.1592 4.49219C10.4999 5.25146 9.77455 6.03033 9.10154 6.625C8.76584 6.92162 8.42476 7.18814 8.09861 7.38477C7.7931 7.56891 7.40632 7.75 6.99997 7.75C6.59363 7.75 6.20685 7.56891 5.90134 7.38477C5.57519 7.18814 5.23411 6.92162 4.89841 6.625C4.22539 6.03033 3.50004 5.25146 2.84079 4.49219C2.17837 3.72925 1.56786 2.96816 1.124 2.39942C0.901825 2.11473 0.720644 1.87671 0.594701 1.70997C0.531712 1.62657 0.481865 1.56078 0.448216 1.51563C0.43154 1.49325 0.418936 1.47576 0.41013 1.46387C0.405895 1.45815 0.402686 1.45334 0.400365 1.4502C0.399257 1.4487 0.398065 1.44715 0.397435 1.44629L0.396458 1.44532V1.44434C0.150909 1.11083 0.222152 0.642102 0.555638 0.396489C0.889151 0.150939 1.35788 0.222182 1.60349 0.555669H1.60447C1.60489 0.556238 1.60551 0.557364 1.60642 0.558598C1.6083 0.561144 1.61136 0.565116 1.61521 0.570317C1.62319 0.581094 1.63543 0.597796 1.65134 0.619145C1.68316 0.661839 1.73016 0.72513 1.79099 0.805669C1.91285 0.967005 2.08995 1.19797 2.30661 1.47559C2.74066 2.03176 3.33385 2.77098 3.97361 3.50782C4.61666 4.24844 5.29244 4.96976 5.89255 5.5C6.19345 5.76588 6.45764 5.96812 6.67576 6.09961C6.9144 6.24347 7.01123 6.25 6.99997 6.25C6.98872 6.25 7.08555 6.24347 7.32419 6.09961C7.54231 5.96812 7.80649 5.76588 8.1074 5.5C8.7075 4.96976 9.38329 4.24844 10.0263 3.50782C10.6661 2.77098 11.2593 2.03176 11.6933 1.47559C11.91 1.19797 12.0871 0.967005 12.209 0.805669C12.2698 0.72513 12.3168 0.661839 12.3486 0.619145C12.3645 0.597796 12.3768 0.581094 12.3847 0.570317C12.3886 0.565116 12.3916 0.561144 12.3935 0.558598C12.3944 0.557364 12.3951 0.556238 12.3955 0.555669H12.3965Z" fill="#7D7E89" />
                                    </svg>
                                )}
                            </NavLink>

                            {/* Menu déroulant */}
                            <div className='DropdownMenu'>
                                {hasDropdown && isDropdownOpen && (
                                    <ul className='DropdownList'>
                                        {link.dropdown.map((item, i) => (
                                            <NavLink
                                                key={i}
                                                className={({ isActive }) =>
                                                    `DropdownItem ${isActive ? 'active' : 'inactive'}`
                                                }
                                                to={`/${slugify(item.label)}`}
                                            >
                                                {item.label}
                                            </NavLink>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </li>
                    )
                })}
            </ul>

            {/* Bloc langue ou dual */}
            {dualTitleBlock && (
                <div className="langueBlock">
                    <h3>{dualTitleBlock.titleOne}</h3>
                    <h3>{dualTitleBlock.titleTwo}</h3>
                </div>
            )}
        </nav>
    )
}
