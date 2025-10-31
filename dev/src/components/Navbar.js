import React, { useEffect, useState, useContext } from 'react'
import { client } from '../Sanity'
import { NavLink, useLocation } from 'react-router-dom'
import './Navbar.scss'

import { LanguageContext } from '../LanguageContext';

import imageUrlBuilder from '@sanity/image-url'

const builder = imageUrlBuilder(client)

export function urlFor(source) {
  return builder.image(source)
}


export default function Navbar() {
  const [navbarData, setNavbarData] = useState(null)
  const [activeDropdownIndex, setActiveDropdownIndex] = useState(null)
  const location = useLocation()

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileDropdownIndex, setOpenMobileDropdownIndex] = useState(null);


  const { language, changeLanguage } = useContext(LanguageContext);

  // Charger les données de Sanity avec asset->url pour avoir les liens directs des images
  useEffect(() => {
    const docType = language === 'ENG' ? 'navigationBar-ENG' : 'navigationBar'
    client
      .fetch(`*[_type == "${docType}"][0]{
        logo{
          asset->{
            url
          }
        },
        titleBlock,
        dualTitleBlock,
        linksBlock[]{
          label,
          dropdown[]{
            label,
            image{
              asset->{
                url
              }
            }
          }
        }
      }`)
      .then((data) => setNavbarData(data))
      .catch(console.error)
  }, [language])

  // Fermer le dropdown si on change d'URL
  useEffect(() => {
    setActiveDropdownIndex(null)
  }, [location.pathname])

  const slugify = (text) =>
    text
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '')
      .replace(/[^\w-]+/g, '')

  if (!navbarData) return <div></div>

  const { logo, titleBlock, linksBlock, dualTitleBlock } = navbarData

  const toggleDropdown = (index) => {
    setActiveDropdownIndex((prev) => (prev === index ? null : index))
  }

  const normalizePath = (p) => {
    if (!p) return ''
    return p.replace(/\/+$/, '') || '/'
  }

  // Vérifie si un des enfants d'un link correspond à la route courante
  const isAnyChildActive = (link) => {
    if (!link?.dropdown || !link.dropdown.length) return false
    const current = normalizePath(location.pathname)
    return link.dropdown.some(item => normalizePath(`/${slugify(item.label)}`) === current)
  }

  const slugMapENGtoFR = {
  "3dfloorplan": "plan3damenage",
  "3dperspective": "perspective3d",
  "360panorama": "panorama360",
  "3danimation": "animation3d",
  "plandemasse": "plandemasse",

}

const getSlug = (label) => {
  if (language === "ENG") {
    // Si on est en ENG, vérifier si on a une correspondance spéciale
    const mapped = slugMapENGtoFR[slugify(label)];
    return mapped ? mapped : slugify(label);
  }
  // Par défaut FR
  return slugify(label);
};


  return (
    <nav className='Navbar'>
      <NavLink to='/' className='LogoNav'>
        {logo?.asset?.url && (
          <img
            onContextMenu={(e) => e.preventDefault()} // Empêche clic droit
            draggable="false"
            src={logo.asset.url}
            alt="Logo"
            className='LogoImage'
          />
        )}

      </NavLink>

      {/* Liens principaux */}
      <ul className='LinksBlock'>
        {linksBlock?.map((link, index) => {
          const hasDropdown = link.dropdown && link.dropdown.length > 0
          const isDropdownOpen = activeDropdownIndex === index
          const childActive = isAnyChildActive(link)

          return (
            <li key={index} className='LinkWithDropdown'>
              {hasDropdown ? (
                // Parent avec dropdown : ne pas utiliser NavLink pour éviter l'active par défaut
                <div
                  role="button"
                  tabIndex={0}
                  className={`LinkItems ${childActive ? 'activeDrop' : 'inactive'} dropdownToggle ${isDropdownOpen ? 'open' : ''}`}
                  onClick={() => toggleDropdown(index)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      toggleDropdown(index)
                    }
                  }}
                >
                  {link.label}

                  <svg
                    className={`DropdownIcon ${isDropdownOpen ? 'open' : 'close'}`}
                    width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.3965 0.555669C12.6421 0.222182 13.1108 0.150939 13.4443 0.396489C13.7778 0.642102 13.849 1.11083 13.6035 1.44434V1.44532L13.6025 1.44629C13.6019 1.44715 13.6007 1.4487 13.5996 1.4502C13.5973 1.45334 13.5941 1.45815 13.5898 1.46387C13.581 1.47576 13.5684 1.49325 13.5517 1.51563C13.5181 1.56078 13.4682 1.62657 13.4052 1.70997C13.2793 1.87671 13.0981 2.11473 12.876 2.39942C12.4321 2.96816 11.8216 3.72925 11.1592 4.49219C10.4999 5.25146 9.77455 6.03033 9.10154 6.625C8.76584 6.92162 8.42476 7.18814 8.09861 7.38477C7.7931 7.56891 7.40632 7.75 6.99997 7.75C6.59363 7.75 6.20685 7.56891 5.90134 7.38477C5.57519 7.18814 5.23411 6.92162 4.89841 6.625C4.22539 6.03033 3.50004 5.25146 2.84079 4.49219C2.17837 3.72925 1.56786 2.96816 1.124 2.39942C0.901825 2.11473 0.720644 1.87671 0.594701 1.70997C0.531712 1.62657 0.481865 1.56078 0.448216 1.51563C0.43154 1.49325 0.418936 1.47576 0.41013 1.46387C0.405895 1.45815 0.402686 1.45334 0.400365 1.4502C0.399257 1.4487 0.398065 1.44715 0.397435 1.44629L0.396458 1.44532V1.44434C0.150909 1.11083 0.222152 0.642102 0.555638 0.396489C0.889151 0.150939 1.35788 0.222182 1.60349 0.555669H1.60447C1.60489 0.556238 1.60551 0.557364 1.60642 0.558598C1.6083 0.561144 1.61136 0.565116 1.61521 0.570317C1.62319 0.581094 1.63543 0.597796 1.65134 0.619145C1.68316 0.661839 1.73016 0.72513 1.79099 0.805669C1.91285 0.967005 2.08995 1.19797 2.30661 1.47559C2.74066 2.03176 3.33385 2.77098 3.97361 3.50782C4.61666 4.24844 5.29244 4.96976 5.89255 5.5C6.19345 5.76588 6.45764 5.96812 6.67576 6.09961C6.9144 6.24347 7.01123 6.25 6.99997 6.25C6.98872 6.25 7.08555 6.24347 7.32419 6.09961C7.54231 5.96812 7.80649 5.76588 8.1074 5.5C8.7075 4.96976 9.38329 4.24844 10.0263 3.50782C10.6661 2.77098 11.2593 2.03176 11.6933 1.47559C11.91 1.19797 12.0871 0.967005 12.209 0.805669C12.2698 0.72513 12.3168 0.661839 12.3486 0.619145C12.3645 0.597796 12.3768 0.581094 12.3847 0.570317C12.3886 0.565116 12.3916 0.561144 12.3935 0.558598C12.3944 0.557364 12.3951 0.556238 12.3955 0.555669H12.3965Z" fill="#7D7E89" />
                  </svg>
                </div>
              ) : (
                // Lien simple (sans dropdown) : NavLink normal
                <NavLink
                  className={({ isActive }) =>
                    `LinkItems ${isActive ? 'active' : 'inactive'}`
                  }
                  to={slugify(link.label) === 'accueil' ? '/' : `/${slugify(link.label)}`}
                >
                  {link.label}
                </NavLink>

              )}

              {/* Menu déroulant */}
              <div className='DropdownMenu'>
                {hasDropdown && isDropdownOpen && (
                  <div className='overlay'>
                    <div className='DropdownContent'>
                      <ul className='DropdownList'>
                        <h2 className='nameItems'>Catégories
                          <svg width="99" height="9" viewBox="0 0 99 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.108583 1.8099C0.119337 1.29648 0.518279 0.884375 1.03179 0.878738C5.85129 0.82584 29.0566 0.606069 49.1357 1.02667C69.2149 1.44726 92.3906 2.63858 97.2037 2.89325C97.7165 2.92039 98.0978 3.34884 98.0871 3.86226L97.999 8.06779C97.9877 8.60575 97.5506 9.02861 97.0133 9.00075C91.9729 8.73934 68.1738 7.53791 49.0078 7.13644C29.8417 6.73497 6.01317 6.93874 0.966296 6.98885C0.428252 6.99419 0.00922067 6.55339 0.0204892 6.01544L0.108583 1.8099Z" fill="#EAE5C8" />
                          </svg>
                        </h2>
                        <div className='DropdownItemsWrapper'>

                          {link.dropdown.slice(0, -1).map((item, i) => (
                            <li key={i} className="DropdownItemElement">
                              <NavLink
                                className={({ isActive }) =>
                                  `DropdownItem ${isActive ? 'active' : 'inactive'}`
                                }
                                 to={`/${getSlug(item.label)}`}
                              >
                                {item.image?.asset?.url && (
                                  <img
                                    onContextMenu={(e) => e.preventDefault()} // Empêche clic droit
                                    draggable="false"
                                    src={`${item.image?.asset?.url}?q=40&fm=webp`}
                                    alt={item.label}
                                    className="DropdownImage"
                                    
                                  />
                                )}
                                <p>{item.label}</p>
                              </NavLink>
                            </li>
                          ))}
                        </div>
                      </ul>


                    </div>
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ul>

      {dualTitleBlock && (
        <div className="langueBlock">
          <button
            className={language === 'FR' ? 'selected' : ''}
            onClick={() => changeLanguage('FR')}
          >
            {dualTitleBlock.titleOne || 'FR'}
          </button>
          <button
            className={language === 'ENG' ? 'selected' : ''}
            onClick={() => changeLanguage('ENG')}
          >
            {dualTitleBlock.titleTwo || 'ENG'}
          </button>
        </div>
      )}
      <div className='buttonMobile '>
        <button onClick={() => window.location.href = '/contact'} className='CtaButton mailBtn'   >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.44951 8.6751L10.2444 10.3281C11.8737 11.2914 12.5244 11.2914 14.1546 10.3281L16.9495 8.6751M2.7147 13.4024C2.77645 16.3141 2.8078 17.7705 3.88225 18.8487C4.9567 19.9279 6.452 19.965 9.44355 20.04C11.2866 20.0875 13.1125 20.0875 14.9555 20.04C17.947 19.965 19.4423 19.9279 20.5168 18.8487C21.5912 17.7705 21.6226 16.3141 21.6853 13.4024C21.7043 12.4657 21.7043 11.5347 21.6853 10.598C21.6226 7.6862 21.5912 6.22985 20.5168 5.1516C19.4423 4.0724 17.947 4.03535 14.9555 3.9603C13.1184 3.91395 11.2806 3.91395 9.44355 3.9603C6.452 4.03535 4.9567 4.0724 3.88225 5.1516C2.8078 6.22985 2.77645 7.6862 2.71375 10.598C2.69375 11.5326 2.6947 12.4677 2.7147 13.4024Z" stroke="white" stroke-width="1.425" stroke-linecap="round" stroke-linejoin="round" />
          </svg>

        </button>

        <button className='CtaButton Menu'
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}  >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.3335 6.66675H22.6668M5.3335 16.0001H26.6668M9.3335 25.3334H22.6668" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>

        </button>
      </div>

      {isMobileMenuOpen && (
        <div className='mobileDropdown'>
          <div className='contentClose'>
            <button className='closeBtn' onClick={() => setIsMobileMenuOpen(false)}>
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.9595 8.62615C22.35 8.23562 22.983 8.23562 23.3735 8.62615C23.7641 9.01667 23.7641 9.64968 23.3735 10.0402L17.4139 15.9998L23.3735 21.9595L23.4426 22.035C23.763 22.4278 23.7397 23.0074 23.3735 23.3735C23.0074 23.7397 22.4278 23.763 22.035 23.4426L21.9595 23.3735L15.9998 17.4139L10.0402 23.3735C9.64968 23.7641 9.01667 23.7641 8.62615 23.3735C8.23562 22.983 8.23562 22.35 8.62615 21.9595L14.5858 15.9998L8.62615 10.0402C8.23562 9.64968 8.23562 9.01667 8.62615 8.62615C9.01667 8.23562 9.64968 8.23562 10.0402 8.62615L15.9998 14.5858L21.9595 8.62615Z"
                  fill="#171933"
                />
              </svg>
            </button>
          </div>

          <div className='content'>


            <ul>
              {linksBlock?.map((link, index) => {
                const hasDropdown = link.dropdown && link.dropdown.length > 0;
                const childActive = isAnyChildActive(link);
                const parentPath = `/${slugify(link.label)}`;

                const parentActive =
                  normalizePath(location.pathname) === normalizePath(parentPath);

                return (
                  <li key={index} className="mobileMenuItem">
                    <div
                      className="mobileMenuLink"
                      onClick={() => {
                        if (!hasDropdown) {
                          setIsMobileMenuOpen(false);
                        }
                      }}
                    >
                      {hasDropdown ? (
                        <span
                          className={`mobileLink ${childActive || parentActive ? 'activeDrop' : ''
                            }`}
                        >
                          {link.label}
                        </span>
                      ) : (
                        <NavLink
                          to={slugify(link.label) === 'accueil' ? '/' : `/${slugify(link.label)}`}
                          className={({ isActive }) =>
                            `mobileLink ${isActive ? 'active' : ''}`
                          }
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {link.label}
                        </NavLink>
                      )}
                    </div>

                    {hasDropdown && (
                      <ul className="mobileSubmenu">

                        {link.dropdown.map((item, i) => (
                          <li key={i}>
                            <NavLink
                              to={`/${getSlug(item.label)}`}
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {item.label}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}

              {dualTitleBlock && (
                <div className="langueBlock2">
                  <button
                    className={language === 'FR' ? 'selected' : ''}
                    onClick={() => changeLanguage('FR')}
                  >
                    {dualTitleBlock.titleOne || 'FR'}
                  </button>
                  <button
                    className={language === 'ENG' ? 'selected' : ''}
                    onClick={() => changeLanguage('ENG')}
                  >
                    {dualTitleBlock.titleTwo || 'ENG'}
                  </button>
                </div>
              )}
            </ul>
            <svg className='svgBack' width="375" height="427" viewBox="0 0 375 427" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M-72.9094 368.835C-78.1944 359.351 -75.2464 347.411 -66.1147 341.538C-20.7901 312.389 111.981 227.963 232.182 160.98C352.384 93.9972 494.032 25.5019 542.666 2.29217C552.465 -2.38401 564.17 1.39078 569.455 10.8748L595.418 57.4657C601.237 67.9088 597.097 81.0673 586.319 86.2398C534.597 111.061 391.834 180.434 278.284 243.711C164.734 306.987 30.6299 391.898 -17.6892 422.826C-27.7584 429.271 -41.1269 425.869 -46.9464 415.426L-72.9094 368.835Z" fill="#F9F8F2" />
            </svg>

          </div>
        </div>
      )}


    </nav>
  )
}
