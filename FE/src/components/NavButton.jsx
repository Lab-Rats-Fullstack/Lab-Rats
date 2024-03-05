import React from 'react';
import { useNavigate } from 'react-router-dom'

export default function NavButton ({location, buttonText}) {
    const navigate = useNavigate();
    return (
        <button onClick={() => {
            navigate(location)
        }}>{buttonText}</button>
    )    
}