import React, { useEffect, useState, useContext } from 'react'
import './Mentions.scss'
import { client } from '../Sanity'
import { PortableText } from '@portabletext/react'

import { LanguageContext } from '../LanguageContext'

export default function Mention() {
  const [mentions, setMentions] = useState(null)
  const { language } = useContext(LanguageContext)

  useEffect(() => {
        const docType = language === 'ENG' ? 'mentionsLegales-ENG' : 'mentionsLegales'

    client
      .fetch(`*[_type == "${docType}"][0]`)
      .then((data) => setMentions(data))
      .catch(console.error)
  }, [language])

  if (!mentions) return <p>Chargement...</p>

  return (
    <section className="mentions-legales">
      <h1 className='h1-alternate'>{mentions.titre}</h1>
      <div className="mentions-content">
        <PortableText className='bodyS-regular' value={mentions.contenu} />
      </div>
    </section>
  )
}
