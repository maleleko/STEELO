import {useState} from 'react'

export function SearchToggle() {
    const [active, setActive] = useState(false);
    // let hmm = document.querySelectorAll("a[href='#search-aside']")
        return <div className='srchDiv'>
            <a href='#search-aside' className={active ? 'toggled' : 'hid'} onClick={() => setActive(!active)}> <img src="/search.svg" alt="search icon" /></a>
            <a href='#' className={active ? 'hid' : 'toggled'} onClick={() => setActive(!active)} id='toggled'><img src='/x.svg' alt='close or cancel search icon'/></a>
        </div>
}

// const [href, setHref] = useState('/')

// const toggleHref = () => {
//   if (href === '/' && '#') {
//     setHref('#mobile-menu-aside')
//   } else if (href === '#mobile-menu-aside') {
//     setHref('#')
//   }
//   else {
//     setHref('#mobile-menu-aside')
//   }
