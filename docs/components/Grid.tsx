export default function Grid(props) {
    return <div {...props} data-mode='base' style={{
        display: 'grid',
        gap: '1rem',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))'
    }}/>
}
