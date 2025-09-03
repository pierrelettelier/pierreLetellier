import React, { useEffect, useState, useContext } from 'react'
import { client } from '../Sanity'
import { NavLink, useLocation } from 'react-router-dom'
import './Navbar.scss'

import { LanguageContext } from '../LanguageContext';



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
                  to={slugify(link.label) === 'home' ? '/' : `/${slugify(link.label)}`}
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
                        <h2 className='nameItems'>Catégories</h2>
                        <div className='DropdownItemsWrapper'>

                          {link.dropdown.slice(0, -1).map((item, i) => (
                            <li key={i} className="DropdownItemElement">
                              <NavLink
                                className={({ isActive }) =>
                                  `DropdownItem ${isActive ? 'active' : 'inactive'}`
                                }
                                to={`/${slugify(item.label)}`}
                              >
                                {item.image?.asset?.url && (
                                  <img
                                  onContextMenu={(e) => e.preventDefault()} // Empêche clic droit
                                    draggable="false"  
                                    src={item.image.asset.url}
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

                      {/* Bloc séparé pour le dernier élément */}
                      {link.dropdown.length > 0 && (
                        <ul className="DropdownList2 last-section">

                          {(() => {
                            const lastItem = link.dropdown[link.dropdown.length - 1];
                            return (
                              <li className="DropdownItemElement">
                                <NavLink
                                  className={({ isActive }) =>
                                    `DropdownItem ${isActive ? 'active' : 'inactive'}`
                                  }
                                  to={`/${slugify(lastItem.label)}`}
                                >
                                  <span>Plus</span>
                                  <p>{lastItem.label}
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M14.3965 6.55577C14.6421 6.22226 15.1108 6.15103 15.4443 6.39659H15.4453L15.4463 6.39757C15.447 6.39809 15.4481 6.39868 15.4492 6.39952L15.5039 6.44054C15.5417 6.46873 15.5973 6.50995 15.667 6.56261C15.8064 6.66786 16.0045 6.81948 16.2422 7.00499C16.7172 7.37563 17.3532 7.88565 17.9912 8.43956C18.6256 8.99033 19.2802 9.59908 19.7812 10.1661C20.0309 10.4487 20.2585 10.7389 20.4277 11.0196C20.5846 11.2799 20.75 11.6266 20.75 12.0001C20.75 12.3737 20.5846 12.7203 20.4277 12.9806C20.2585 13.2614 20.0309 13.5515 19.7812 13.8341C19.2802 14.4011 18.6256 15.0099 17.9912 15.5607C17.3532 16.1146 16.7172 16.6246 16.2422 16.9952C16.0045 17.1807 15.8064 17.3324 15.667 17.4376C15.5973 17.4903 15.5417 17.5315 15.5039 17.5597L15.4492 17.6007C15.4481 17.6015 15.447 17.6021 15.4463 17.6026L15.4453 17.6036H15.4443C15.1108 17.8492 14.6421 17.778 14.3965 17.4444C14.1509 17.1109 14.2221 16.6422 14.5557 16.3966V16.3956C14.5561 16.3953 14.5566 16.3944 14.5576 16.3937C14.5597 16.3921 14.5639 16.3901 14.5684 16.3868C14.5773 16.3802 14.5909 16.3706 14.6084 16.3575C14.6438 16.3311 14.6957 16.2909 14.7627 16.2403C14.8967 16.1391 15.0896 15.9927 15.3203 15.8126C15.7827 15.4518 16.3971 14.9589 17.0088 14.4278C17.6242 13.8936 18.2199 13.3348 18.6562 12.8409C18.6832 12.8104 18.7091 12.7796 18.7344 12.7501H4C3.58579 12.7501 3.25 12.4143 3.25 12.0001C3.25 11.5859 3.58579 11.2501 4 11.2501H18.7344C18.7091 11.2206 18.6832 11.1898 18.6562 11.1593C18.2199 10.6654 17.6242 10.1067 17.0088 9.57238C16.3971 9.0413 15.7827 8.54846 15.3203 8.18761C15.0896 8.00754 14.8967 7.8611 14.7627 7.75988C14.6957 7.70929 14.6438 7.66908 14.6084 7.64269C14.5909 7.62962 14.5773 7.61998 14.5684 7.61339C14.5639 7.6101 14.5597 7.60813 14.5576 7.60656C14.5566 7.60581 14.5561 7.60494 14.5557 7.6046V7.60363C14.2221 7.35802 14.1509 6.88931 14.3965 6.55577Z" fill="#7D7E89" />
                                    </svg>


                                  </p>
                                </NavLink>
                              </li>
                            );
                          })()}
                          <svg width="339" height="305" viewBox="0 0 339 305" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M393.083 -12.9078C397.972 -7.28093 397.676 1.15811 392.369 6.39265C366.027 32.3738 288.727 107.835 217.411 169.802C146.095 231.77 60.5828 297.78 31.1789 320.237C25.2548 324.762 16.857 323.877 11.9678 318.25L-12.0512 290.607C-17.435 284.412 -16.5095 274.986 -9.99708 269.99C21.2542 246.014 107.392 179.257 174.761 120.718C242.131 62.18 320.258 -13.7957 348.361 -41.3943C354.218 -47.1455 363.68 -46.7461 369.064 -40.5502L393.083 -12.9078Z" fill="#F2EEE2" />
                          </svg>

                        </ul>
                      )}
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
                    className={`mobileLink ${
                      childActive || parentActive ? 'activeDrop' : ''
                    }`}
                  >
                    {link.label}
                  </span>
                ) : (
                  <NavLink
                                      to={slugify(link.label) === 'home' ? '/' : `/${slugify(link.label)}`}
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
                        to={`/${slugify(item.label)}`}
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
    </div>
  </div>
)}


    </nav>
  )
}
