import React, { useEffect, useState, useContext } from 'react';
import './Footer.scss';
import { NavLink } from 'react-router-dom';
import { client } from '../Sanity';
import { LanguageContext } from '../LanguageContext';

export default function Footer() {
  const { language } = useContext(LanguageContext);
  const [navbarData, setNavbarData] = useState(null);

  // Fonction pour transformer un label en slug
  const slugify = (text) =>
    text
      ?.toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '')
      .replace(/[^\w-]+/g, '') || '';

  useEffect(() => {
    const docType = language === 'ENG' ? 'navigationBar-ENG' : 'navigationBar';
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
        },
        socialLinks[]{
          label,
          url
        }
      }`)
      .then((data) => setNavbarData(data))
      .catch(console.error);
  }, [language]);

  if (!navbarData) return null;

  const { logo, linksBlock, socialLinks } = navbarData;

  return (
    <div className='Footer'>
      <div className='Top'>
        <NavLink to='/' className='LogoNav'>
          {logo?.asset?.url && (
            <img
              src={logo.asset.url}
              alt="Logo"
              className='LogoImage'
              draggable="false"
              onContextMenu={(e) => e.preventDefault()}
            />
          )}
        </NavLink>

        {/* Explore */}
<section>
  <h2>Explore</h2>
  {linksBlock
    ?.filter((link) => link.label?.toLowerCase() !== 'travaux') // <-- exclusion TRAVAUX
    .map((link) => link.label && (
      <NavLink
        key={slugify(link.label)}
        className={({ isActive }) =>
          `LinkItems ${isActive ? 'active' : 'inactive'}`
        }
        to={slugify(link.label) === 'home' ? '/' : `/${slugify(link.label)}`}
      >
        {link.label}
      </NavLink>
    ))}
</section>


        {/* Services */}
        <section>
          <h2>Services</h2>
          {linksBlock?.map((link) =>
            link.dropdown?.length > 0 && (
              <ul key={slugify(link.label)}>
                {link.dropdown
                  .filter((item) => item.label?.toLowerCase() !== 'design project')
                  .map((item) => (
                    <li key={slugify(item.label)} className="DropdownItemElement">
                      <NavLink
                        className={({ isActive }) =>
                          `DropdownItem ${isActive ? 'active' : 'inactive'}`
                        }
                        to={`/${slugify(item.label)}`}
                      >
                        <p>{item.label}</p>
                      </NavLink>
                    </li>
                  ))}
              </ul>
            )
          )}
        </section>

        {/* Follow */}
       <section>
  <h2>Follow</h2>
  <div className='Linked'>
    {socialLinks?.length > 0 && (
    <ul className="SocialLinksList">
      {socialLinks.map((item) => (
        <li key={slugify(item.label)} className="SocialLinkItem">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="SocialLink"
          >
            {item.label.toLowerCase() === 'linkedin' && (
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M0 5C0 2.23858 2.23858 0 5 0H27C29.7614 0 32 2.23858 32 5V27C32 29.7614 29.7614 32 27 32H5C2.23858 32 0 29.7614 0 27V5ZM8.2 13.3V24H11.6V13.3H8.2ZM8 9.9C8 11 8.8 11.8 9.9 11.8C11 11.8 11.8 11 11.8 9.9C11.8 8.8 11 8 9.9 8C8.9 8 8 8.8 8 9.9ZM20.6 24H23.8V17.4C23.8 14.1 21.8 13 19.9 13C18.2 13 17 14.1 16.7 14.8V13.3H13.5V24H16.9V18.3C16.9 16.8 17.9 16 18.9 16C19.9 16 20.6 16.5 20.6 18.2V24Z" fill="#171933"/>
              </svg>
            )}
            {item.label.toLowerCase() === 'instagram' && (
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 18.8C14.5 18.8 13.2 17.6 13.2 16C13.2 14.5 14.4 13.2 16 13.2C17.5 13.2 18.8 14.4 18.8 16C18.8 17.5 17.5 18.8 16 18.8Z" fill="#171933"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M19.4 9.2H12.6C11.8 9.3 11.4 9.4 11.1 9.5C10.7 9.6 10.4 9.8 10.1 10.1C9.86261 10.3374 9.75045 10.5748 9.61489 10.8617C9.57916 10.9373 9.5417 11.0166 9.5 11.1C9.48453 11.1464 9.46667 11.1952 9.44752 11.2475C9.34291 11.5333 9.2 11.9238 9.2 12.6V19.4C9.3 20.2 9.4 20.6 9.5 20.9C9.6 21.3 9.8 21.6 10.1 21.9C10.3374 22.1374 10.5748 22.2495 10.8617 22.3851C10.9374 22.4209 11.0165 22.4583 11.1 22.5C11.1464 22.5155 11.1952 22.5333 11.2475 22.5525C11.5333 22.6571 11.9238 22.8 12.6 22.8H19.4C20.2 22.7 20.6 22.6 20.9 22.5C21.3 22.4 21.6 22.2 21.9 21.9C22.1374 21.6626 22.2495 21.4252 22.3851 21.1383C22.4209 21.0626 22.4583 20.9835 22.5 20.9C22.5155 20.8536 22.5333 20.8048 22.5525 20.7525C22.6571 20.4667 22.8 20.0762 22.8 19.4V12.6C22.7 11.8 22.6 11.4 22.5 11.1C22.4 10.7 22.2 10.4 21.9 10.1C21.6626 9.86261 21.4252 9.75045 21.1383 9.61488C21.0627 9.57918 20.9833 9.54167 20.9 9.5C20.8536 9.48453 20.8048 9.46666 20.7525 9.44752C20.4667 9.3429 20.0762 9.2 19.4 9.2ZM16 11.7C13.6 11.7 11.7 13.6 11.7 16C11.7 18.4 13.6 20.3 16 20.3C18.4 20.3 20.3 18.4 20.3 16C20.3 13.6 18.4 11.7 16 11.7ZM21.4 11.6C21.4 12.1523 20.9523 12.6 20.4 12.6C19.8477 12.6 19.4 12.1523 19.4 11.6C19.4 11.0477 19.8477 10.6 20.4 10.6C20.9523 10.6 21.4 11.0477 21.4 11.6Z" fill="#171933"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M0 5C0 2.23858 2.23858 0 5 0H27C29.7614 0 32 2.23858 32 5V27C32 29.7614 29.7614 32 27 32H5C2.23858 32 0 29.7614 0 27V5ZM12.6 7.7H19.4C20.3 7.8 20.9 7.9 21.4 8.1C22 8.4 22.4 8.6 22.9 9.1C23.4 9.6 23.7 10.1 23.9 10.6C24.1 11.1 24.3 11.7 24.3 12.6V19.4C24.2 20.3 24.1 20.9 23.9 21.4C23.6 22 23.4 22.4 22.9 22.9C22.4 23.4 21.9 23.7 21.4 23.9C20.9 24.1 20.3 24.3 19.4 24.3H12.6C11.7 24.2 11.1 24.1 10.6 23.9C10 23.6 9.6 23.4 9.1 22.9C8.6 22.4 8.3 21.9 8.1 21.4C7.9 20.9 7.7 20.3 7.7 19.4V12.6C7.8 11.7 7.9 11.1 8.1 10.6C8.4 10 8.6 9.6 9.1 9.1C9.6 8.6 10.1 8.3 10.6 8.1C11.1 7.9 11.7 7.7 12.6 7.7Z" fill="#171933"/>
              </svg>
            )}
            {item.label.toLowerCase() === 'contact' && (
              <span>{item.label}</span> // juste le texte ou un autre SVG si tu veux
            )}
          </a>
        </li>
      ))}
    </ul>
  )}
  <NavLink to="/contact" className="ContactLink"><svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="32" height="32" rx="8" fill="#171933"/>
<path d="M11.8334 13.0833L14.2851 14.5333C15.7143 15.3783 16.2851 15.3783 17.7151 14.5333L20.1668 13.0833M7.68009 17.23C7.73425 19.7842 7.76175 21.0617 8.70425 22.0075C9.64675 22.9542 10.9584 22.9867 13.5826 23.0525C15.1993 23.0942 16.8009 23.0942 18.4176 23.0525C21.0418 22.9867 22.3534 22.9542 23.2959 22.0075C24.2384 21.0617 24.2659 19.7842 24.3209 17.23C24.3376 16.4083 24.3376 15.5917 24.3209 14.77C24.2659 12.2158 24.2384 10.9383 23.2959 9.99249C22.3534 9.04582 21.0418 9.01332 18.4176 8.94749C16.8062 8.90683 15.194 8.90683 13.5826 8.94749C10.9584 9.01332 9.64675 9.04582 8.70425 9.99249C7.76175 10.9383 7.73425 12.2158 7.67925 14.77C7.66171 15.5899 7.66254 16.4101 7.68009 17.23Z" stroke="white" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
</NavLink>
  </div>
  
</section>

      </div>

      <div className='bottom'>
        <NavLink to="/mentions" className="bodyS-regular linkMention">Mentions légales</NavLink>
      </div>
    </div>
  );
}
