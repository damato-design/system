import React from 'react';

export default function Grid(props) {
    return <div {...props} style={{
        display: 'grid',
        gap: '1rem',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))'
    }}/>
}