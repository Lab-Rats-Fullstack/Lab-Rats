import React from 'react';

export default function TagInfo ({tag}) {
    return (
        <div className="tagInfo">
            <p>{tag.name}</p>
        </div>
    )
}