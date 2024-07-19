import { useEffect, useState, useRef } from "react";
import { Modal } from "bootstrap";
import axios from "axios";
const clientId =import.meta.env.VITE_APP_CLIENT_ID;
const api = 'https://api.unsplash.com/search/photos/'

export default function PracOne() {
    const [ keyword, setKeyword ] = useState('buildings')
    const [ photoData, setPhotoData ] = useState([])
    const [ xRatelimitRemaining, setXRatelimitRemaining ] = useState(50);
    const [ isLoading, setIsLoading ] = useState(false)
    const [ photoUrl, setPhotoUrl ] = useState('')
    const currentPage = useRef(1)
    const isLoadingRef = useRef(false)
    const modalRef = useRef(null);
    const modal = useRef(null);

    const handleSearch = ( e ) => {
        if( e.key === 'Enter' ) {
            setKeyword( e.target.value )
        }
    }

    const getPhotos = async ( page = 1, isNew ) => {
        try {
            isLoadingRef.current = true
            setIsLoading( true )
            const results = await axios.get( `${ api }?client_id=${clientId}&query=${keyword}&page=${ page }` )
            setXRatelimitRemaining( results.headers['x-ratelimit-remaining'] )
            setPhotoData(( prePhotoData ) => {
                if ( isNew ) {
                    return [ ...results.data.results ]
                }
                return [ ...prePhotoData, ...results.data.results ]
            })
            currentPage.current = page;
            setTimeout(() => {
                isLoadingRef.current = false
                setIsLoading( false )
            }, 1000)
        } catch (error) {
            console.log(error)
        }
    }

    const getSinglePhoto = async(id) => {
        try {
            const results = await axios.get(`https://api.unsplash.com/photos/${id}/?client_id=${clientId}`)
            setPhotoUrl(results.data.urls.regular);
            modal.current.show()
        } catch (error) {
            console.log(error)
        }
    }

    const listRef = useRef(null) // 取得 list 的 DOM

    useEffect( () => {
        getPhotos(1, true)

        const scrollEvent = () => {
            const height = listRef.current.offsetHeight + listRef.current.offsetTop - window.innerHeight;
            if (  !isLoadingRef.current && window.scrollY >= height ) {
                console.log('true');
                currentPage.current ++
                getPhotos( currentPage.current, false )
            }
        }
        window.addEventListener( 'scroll', scrollEvent );

        // 清除監聽事件
        // 如果不清除的話，每一次 keyword 改變時，都會多一個 scrollEvent，導致畫面滾動時，會執行多次 getPhotos
        return () => {
            window.removeEventListener( 'scroll', scrollEvent );
        }
    }, [keyword] )


    useEffect(() => {
        const body = document.querySelector('body')
        body.style.overflow = isLoading ? 'hidden' : 'auto'

    }, [isLoading])

    useEffect(() => {
        modal.current = new Modal( modalRef.current )
    }, [] )

    return (
        <div>
            <h2>Prac Two</h2>
            <input type="text" className="form-control mb-3" defaultValue={keyword} onKeyDown={ ( e ) => { handleSearch( e ) } } />
            <p>剩餘請求次數 {xRatelimitRemaining} </p>
            <div className={`loading ${ isLoading ? 'show' : '' }`}>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
            <div className="row" ref={listRef}>
                {
                    photoData.map( photo => (
                        <a href="#" className="col-lg-6" key={ photo.id } onClick={ ( e ) => { e.preventDefault(), getSinglePhoto(photo.id)} }>
                            <div className="card mb-3">
                                <img src={ photo.urls.regular } alt="" className="w-100 h-100 object-cover"/>
                            </div>
                        </a>
                    ) )
                }
            </div>
            <div className="modal" tabIndex="-1" ref={ modalRef }>
                <div className="modal-dialog">
                        <img src={ photoUrl } alt="" className="w-100" />
                </div>
            </div>
        </div>
    )
}