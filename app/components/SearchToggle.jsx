import {useState} from 'react'

export function SearchToggle() {
    const [active, setActive] = useState(false);
        return <div className='srchDiv'>
            <a href="#search-aside" className={active ? 'toggled' : 'hid'} onClick={() => setActive(!active)}> <img src="/search.svg" alt="" /></a>
            <a href="#" className={active ? 'hid' : 'toggled'} onClick={() => setActive(!active)}><img src='/x.svg'/></a>
        </div>
}
