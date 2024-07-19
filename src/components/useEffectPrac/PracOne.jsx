import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
const clientId =import.meta.env.VITE_APP_CLIENT_ID;
const api = 'https://api.unsplash.com/search/photos/'

export default function PracOne() {
    const [ keyword, setKeyword ] = useState('animals');
    const [ photoArr, serPhotoArr ] = useState([]);
    const currentPage = useRef(1);
    const isLoading = useRef(false);

    const handleSearch = ( e ) => {
        if(e.key === 'Enter') {
            setKeyword(e.target.value);
        }
    }

    const getPhotos = useCallback(
        async ( page = 1, isNew ) => {
            isLoading.current = true;
            try {
                const res = await axios.get(`${api}?client_id=${clientId}&query=${keyword}&page=${ page }`)
                const { results } = res.data
                setTimeout(() => {
                    isLoading.current = false
                }, 1000)
                if ( isNew ) {
                    serPhotoArr( results )
                    return
                }
                serPhotoArr((preData) => {
                    return [ ...preData, ...results ]
                })
            } catch(error) {
                console.error(error)
                isLoading.current = false
            }
        }, [ keyword ]
    )

    const listRef = useRef(null);

    useEffect(() => {
        getPhotos( 1, true )
        window.addEventListener( 'scroll', () => {
            const { offsetHeight, offsetTop } = listRef.current;
            const wrapHeight = offsetHeight + offsetTop - window.innerHeight;
            console.log(isLoading.current);
            if ( !isLoading.current && window.scrollY >= wrapHeight ) {
                console.log('fetch');
                currentPage.current ++
                getPhotos(currentPage.current, false)
            }
        } )
    }, [ getPhotos, keyword ])

    return (
        <div>
            <h2 className="mb-3">PracOne</h2>
            <input type="text" defaultValue={ keyword } onKeyDown={ e => handleSearch( e ) } className="form-control mb-3" />
            <div className="row" ref={listRef}>
                { photoArr.map( photo => 
                    <div key={ photo.id } className="col-lg-6 mb-4">
                        <div className="card ">
                            <img src={ photo.urls.regular } alt="" className="w-100 h-100 object-cover" />
                        </div>
                    </div>
                ) }
            </div>
        </div>
    )
}