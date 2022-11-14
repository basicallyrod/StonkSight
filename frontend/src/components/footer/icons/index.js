import React from 'react'
import { Icon } from './styles/icons'
import { Github } from '@styled-icons/fa-brands/Github'
import { LinkedinIn } from '@styled-icons/fa-brands/LinkedinIn'
import { Instagram } from '@styled-icons/fa-brands/Instagram'
import { Phone } from '@styled-icons/evaicons-solid/Phone'
import { Email } from '@styled-icons/evaicons-solid/Email'
import { ArrowLeft } from '@styled-icons/bootstrap/ArrowLeft'
import { ArrowRight } from '@styled-icons/bootstrap/ArrowRight'

import {StyledIconBase} from '@styled-icons/styled-icon'

import {
    LinkedinInStyle,
    GithubStyle,
    InstagramStyle,
    PhoneStyle,
    EmailStyle
} from './styles/icons'
import { Link } from 'react-router-dom'




export default function Icons({className}) {
    let loadIcon;
    switch(className) {
        case "Github":
            loadIcon = <Github/>
            return <Github style = {{marginRight : 16}} size="18"/>
            //return <Icon><Github/></Icon>
        case "LinkedinIn":
            loadIcon = <LinkedinIn/>
            return <LinkedinIn style = {{marginRight : 16}} size="18"/>
            //return <Icon><LinkedinIn/></Icon>
            //return <LinkedinIn/>
        case "Instagram":
            loadIcon = <Instagram/>
            return <Instagram style = {{marginRight : 16}} size="18"/>
        case "Phone":
            loadIcon = <Phone/>
            return <Phone style = {{marginRight : 16}} size="18"/>
        case "Email":
            loadIcon = <Email/>
            return <Email style = {{marginRight : 16}} size="18"/>
        case "ArrowLeft":
            loadIcon = <ArrowLeft/>
            return <ArrowLeft style = {{marginRight : 16}} size="18"/>
        case "ArrowRight":
            loadIcon = <ArrowRight/>
            return <ArrowRight style = {{marginRight : 16}} size="18"/>
        default:
            loadIcon = "No Icons"
    }
    
    
}