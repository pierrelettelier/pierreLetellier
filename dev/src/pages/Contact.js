import React, { useEffect, useState, useContext } from 'react'
import { client } from '../Sanity'
import emailjs from 'emailjs-com'
import './Contact.scss'
import { LanguageContext } from '../LanguageContext'

const formTexts = {
  FR: {
    nameLabel: 'Présentez-vous en quelques mots',
    namePlaceholder: 'Ex : Marie, Responsable communication chez XYZ',
    emailLabel: 'Email',
    emailPlaceholder: 'Ex : michel.dupont@gmail.com',
    objectiveLabel: 'Quel est l’objectif que vous souhaitez atteindre ?',
    objectivePlaceholder: 'Ex : Améliorer mes rendus 3D, créer un visuel, autres...',
    sendButton: 'Envoyer votre demande',
    sending: 'Envoi en cours...',
    sent: 'Envoyé !',
    errors: {
      name: 'Veuillez entrer votre nom',
      email: 'Veuillez entrer une adresse email valide',
      objective: 'Veuillez préciser votre objectif'
    }
  },
  ENG: {
    nameLabel: 'Introduce yourself briefly',
    namePlaceholder: 'Ex: Marie, Communication Manager at XYZ',
    emailLabel: 'Email',
    emailPlaceholder: 'Ex: john.doe@gmail.com',
    objectiveLabel: 'What goal would you like to achieve?',
    objectivePlaceholder: 'Ex: Improve 3D renders, create a visual, others...',
    sendButton: 'Send your request',
    sending: 'Sending...',
    sent: 'Sent!',
    errors: {
      name: 'Please enter your name',
      email: 'Please enter a valid email address',
      objective: 'Please specify your goal'
    }
  }
}

const Contact = () => {
  const { language } = useContext(LanguageContext)
  const [contactData, setContactData] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', objective: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [isSent, setIsSent] = useState(false)
  const [congratData, setCongratData] = useState(null)

  useEffect(() => {
    const docType = language === 'ENG' ? 'Contact-ENG' : 'Contact'
    client
      .fetch(`*[_type == "${docType}"][0]`)
      .then(data => setContactData(data))
      .catch(console.error)
  }, [language])

  useEffect(() => {
    const docType = language === 'ENG' ? 'congrat-ENG' : 'congrat'
    client
      .fetch(`*[_type == "${docType}"][0]`)
      .then(data => setCongratData(data))
      .catch(console.error)
  }, [language])

  if (!contactData) return <div></div>

  const { blockIntro, blockContact } = contactData
  const texts = formTexts[language]
  const { title: congratTitle, description: congratDescription } = congratData || {}

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setStatusMessage('')
    setLoading(true)

    const newErrors = {}
    if (!form.name.trim()) newErrors.name = texts.errors.name
    if (!isValidEmail(form.email)) newErrors.email = texts.errors.email
    if (!form.objective.trim()) newErrors.objective = texts.errors.objective

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setLoading(false)
      return
    }

    emailjs.send(
      'service_8cobayo',
      'template_zdhyqrk',
      {
        title: 'Contact Us',
        name: form.name,
        email: form.email,
        message: form.objective,
      },
      'ZFczy3zMenSiOwwUQ'
    )
      .then(() => {
        setStatusMessage('✅ Email envoyé avec succès !')
        setForm({ name: '', email: '', objective: '' })
        setLoading(false)
        setIsSent(true)
      })
      .catch((err) => {
        console.error(err)
        setStatusMessage('❌ Une erreur est survenue, réessayez.')
        setLoading(false)
      })
  }

  return (
    <div className='contact'>
      {/* Bloc Introductif */}
      <section className={`intro ${isSent ? 'inactive' : ''}`}>
        <div className='content'>
          <div className='left'>
            <h1 className='h1-default '>
              {blockIntro?.title}
              <span className="h1-alternate">{blockIntro?.subtitle}
                <svg width="323" height="25" viewBox="0 0 323 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.955055 10.3472C0.917336 8.18631 2.60208 6.3869 4.76099 6.28655C22.3624 5.46844 96.7347 2.1289 161.316 1.00162C225.898 -0.125655 300.342 0.616294 317.961 0.819626C320.122 0.844566 321.868 2.58409 321.906 4.745L322.087 15.0775C322.126 17.3328 320.305 19.1753 318.05 19.1514C299.682 18.9566 223.298 18.2558 161.636 19.3322C99.9742 20.4085 23.6616 23.7745 5.31202 24.6103C3.05874 24.7129 1.17478 22.935 1.13541 20.6797L0.955055 10.3472Z" fill="white" />
                </svg>
              </span>
            </h1>
            <span>
              <p className='bodyM-regular'>{blockIntro?.description}</p>
              <p className='bodyM-regular'>{blockIntro?.description2}</p>
            </span>
          </div>

          <div className='right'>
            <form onSubmit={handleSubmit}>
              <div className='form-group'>
                <label className='bodyM-medium' htmlFor='name'>{texts.nameLabel}</label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  value={form.name}
                  onChange={handleChange}
                  placeholder={texts.namePlaceholder}
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <p className='error-message'>{errors.name}</p>}
              </div>

              <div className='form-group'>
                <label className='bodyM-medium' htmlFor='email'>{texts.emailLabel}</label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  value={form.email}
                  onChange={handleChange}
                  placeholder={texts.emailPlaceholder}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <p className='error-message'>{errors.email}</p>}
              </div>

              <div className='form-group'>
                <label className='bodyM-medium' htmlFor='objective'>{texts.objectiveLabel}</label>
                <input
                  type='text'
                  id='objective'
                  name='objective'
                  value={form.objective}
                  onChange={handleChange}
                  placeholder={texts.objectivePlaceholder}
                  className={errors.objective ? 'error' : ''}
                />
                {errors.objective && <p className='error-message'>{errors.objective}</p>}
              </div>

              <button
                className={`btnAction ${isSent ? 'sent' : ''}`}
                disabled={loading || isSent}
              >
                {loading ? texts.sending : isSent ? texts.sent : texts.sendButton}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.3965 6.55577C14.6421 6.22226 15.1108 6.15103 15.4443 6.39659H15.4453L15.4463 6.39757C15.447 6.39809 15.4481 6.39868 15.4492 6.39952L15.5039 6.44054C15.5417 6.46873 15.5973 6.50995 15.667 6.56261C15.8064 6.66786 16.0045 6.81948 16.2422 7.00499C16.7172 7.37563 17.3532 7.88565 17.9912 8.43956C18.6256 8.99033 19.2802 9.59908 19.7812 10.1661C20.0309 10.4487 20.2585 10.7389 20.4277 11.0196C20.5846 11.2799 20.75 11.6266 20.75 12.0001C20.75 12.3737 20.5846 12.7203 20.4277 12.9806C20.2585 13.2614 20.0309 13.5515 19.7812 13.8341C19.2802 14.4011 18.6256 15.0099 17.9912 15.5607C17.3532 16.1146 16.7172 16.6246 16.2422 16.9952C16.0045 17.1807 15.8064 17.3324 15.667 17.4376C15.5973 17.4903 15.5417 17.5315 15.5039 17.5597L15.4492 17.6007C15.4481 17.6015 15.447 17.6021 15.4463 17.6026L15.4453 17.6036H15.4443C15.1108 17.8492 14.6421 17.778 14.3965 17.4444C14.1509 17.1109 14.2221 16.6422 14.5557 16.3966V16.3956C14.5561 16.3953 14.5566 16.3944 14.5576 16.3937C14.5597 16.3921 14.5639 16.3901 14.5684 16.3868C14.5773 16.3802 14.5909 16.3706 14.6084 16.3575C14.6438 16.3311 14.6957 16.2909 14.7627 16.2403C14.8967 16.1391 15.0896 15.9927 15.3203 15.8126C15.7827 15.4518 16.3971 14.9589 17.0088 14.4278C17.6242 13.8936 18.2199 13.3348 18.6562 12.8409C18.6832 12.8104 18.7091 12.7796 18.7344 12.7501H4C3.58579 12.7501 3.25 12.4143 3.25 12.0001C3.25 11.5859 3.58579 11.2501 4 11.2501H18.7344C18.7091 11.2206 18.6832 11.1898 18.6562 11.1593C18.2199 10.6654 17.6242 10.1067 17.0088 9.57238C16.3971 9.0413 15.7827 8.54846 15.3203 8.18761C15.0896 8.00754 14.8967 7.8611 14.7627 7.75988C14.6957 7.70929 14.6438 7.66908 14.6084 7.64269C14.5909 7.62962 14.5773 7.61998 14.5684 7.61339C14.5639 7.6101 14.5597 7.60813 14.5576 7.60656C14.5566 7.60581 14.5561 7.60494 14.5557 7.6046V7.60363C14.2221 7.35802 14.1509 6.88931 14.3965 6.55577Z" fill="#7D7E89" />
                </svg>
              </button>

              {statusMessage && <p className="status">{statusMessage}</p>}
            </form>
          </div>

          <svg className='svgBack' width="731" height="477" viewBox="0 0 731 477" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.95011 434.58C-2.27411 423.411 1.19779 409.348 11.9523 402.432C65.3316 368.103 221.697 268.674 363.26 189.787C504.823 110.901 671.643 30.2329 728.92 2.89844C740.46 -2.60875 754.246 1.83687 760.47 13.0063L791.047 67.8769C797.901 80.1759 793.024 95.6728 780.331 101.764C719.417 130.996 551.284 212.698 417.555 287.22C283.825 361.741 125.89 461.742 68.9835 498.166C57.1249 505.756 41.3806 501.75 34.527 489.451L3.95011 434.58Z" fill="#F9F8F2" />
          </svg>
        </div>
      </section>

      {/* Section de félicitations */}
      {isSent && congratData && (
        <section className='congrat-section'>
          <main>
            <h2 className='h1-default'>
              <span>{congratTitle}</span>
              <svg width="158" height="23" viewBox="0 0 158 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.434353 8.7225C0.397503 6.6114 1.98646 4.83845 4.09193 4.67999C15.1729 3.846 49.0135 1.45112 78.6468 0.933865C108.28 0.416614 142.184 1.62902 153.287 2.07578C155.397 2.16067 157.047 3.87707 157.083 5.98818L157.264 16.3136C157.304 18.6179 155.396 20.4815 153.093 20.3934C141.271 19.941 106.995 18.7752 78.9668 19.2644C50.9384 19.7536 16.724 22.115 4.92488 22.9797C2.62645 23.1481 0.654805 21.3522 0.614584 19.0479L0.434353 8.7225Z" fill="white" />
              </svg>
            </h2>
            <p className='bodyM-regular'>{congratDescription}</p>
          </main>
        </section>
      )}

      {/* Bloc Coordonnées */}
      <section className='contact-info'>
        <h2 className='h2-alternate '>{blockContact?.title}</h2>
        <main>
          <p>
            <h3 className='h3-alternate'>{blockContact?.emailText}</h3>
            <a className='bodyM-medium' style={{fontSize: '17px'}} href={`mailto:${blockContact?.emailLink}`}>
              {blockContact?.emailLink}
            </a>
          </p>
          <p>
            <h3 className='h3-alternate'>{blockContact?.mobileText}</h3>
            <a className='bodyM-medium' href={`tel:${blockContact?.mobileLink}`}>
              {blockContact?.mobileLink}
            </a>
          </p>
        </main>
      </section>
    </div>
  )
}

export default Contact
