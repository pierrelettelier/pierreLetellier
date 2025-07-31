import React, { useEffect, useState } from 'react'
import { client } from '../Sanity'
import './Contact.scss'

const Contact = () => {
    const [contactData, setContactData] = useState(null)

    const [form, setForm] = useState({
        name: '',
        email: '',
        objective: ''
    })

    const [errors, setErrors] = useState({})

    useEffect(() => {
        client
            .fetch(`*[_type == "Contact"][0]`)
            .then(data => setContactData(data))
            .catch(console.error)
    }, [])

    if (!contactData) return <div>Chargement...</div>

    const { blockIntro, blockContact } = contactData

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
        setErrors(prev => ({ ...prev, [name]: '' })) // efface l'erreur en temps réel
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const newErrors = {}
        if (!form.name.trim()) newErrors.name = 'Présentation manquante'
        if (!form.email.trim()) newErrors.email = 'Adresse email manquante'
        if (!form.objective.trim()) newErrors.objective = 'Objectif manquant'

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
        } else {
            // Envoi du formulaire ici
            console.log('Formulaire envoyé :', form)
        }
    }

    return (
        <div className='contact'>
            {/* Bloc Introductif */}
            <section className='intro'>
                <div className='content'>
                    <div className='left'>
                        <h1>
                            {blockIntro?.title}
                            <span className="subtitle-inline">{blockIntro?.subtitle}</span>
                        </h1>


                        <span>
                            <p>{blockIntro?.description}</p>
                        <p>{blockIntro?.description2}</p>
                        </span>
                    </div>
                    <div className='right'>
                        <form onSubmit={handleSubmit}>
                            {/* Présentation */}
                            <div className='form-group'>
                                <label htmlFor='name'>Présentez-vous en quelques mots</label>
                                <input
                                    type='text'
                                    id='name'
                                    name='name'
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder='Ex : Marie, Responsable communication chez XYZ'
                                    className={errors.name ? 'error' : ''}
                                />
                                {errors.name && <p>{errors.name}</p>}
                            </div>

                            {/* Email */}
                            <div className='form-group'>
                                <label htmlFor='email'>Email</label>
                                <input
                                    type='email'
                                    id='email'
                                    name='email'
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder='Ex : michel.dupont@gmail.com'
                                    className={errors.email ? 'error' : ''}
                                />
                                {errors.email && <p>{errors.email}</p>}
                            </div>

                            {/* Objectif */}
                            <div className='form-group'>
                                <label htmlFor='objective'>Quel est l’objectif que vous souhaitez atteindre ?</label>
                                <input
                                    type='text'
                                    id='objective'
                                    name='objective'
                                    value={form.objective}
                                    onChange={handleChange}
                                    placeholder='Ex : Améliorer mes rendus 3D, créer un visuel, autres...'
                                    className={errors.objective ? 'error' : ''}
                                />
                                {errors.objective && <p>{errors.objective}</p>}
                            </div>

                            <button className="btnAction">
                                Envoyer votre demande
                                {/* ...SVG ici... */}
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Bloc Coordonnées */}
            <section className='contact-info'>
                <h2>{blockContact?.title}</h2>
                <main>
                    <p>
                    <h3>{blockContact?.emailText}</h3>
                    <a href={`mailto:${blockContact?.emailLink}`}>
                        {blockContact?.emailLink}
                    </a>
                </p>
                <p>
                     <h3>   {blockContact?.mobileText}{' '}</h3>
                 
                    <a href={`tel:${blockContact?.mobileLink}`}>
                        {blockContact?.mobileLink}
                    </a>
                </p>
                </main>
            </section>
        </div>
    )
}

export default Contact
