// 製作搜尋列 v
// 抓取遠端資料 v
// 顯示資料 v

// 依照 keyword 改變抓取資料 v
// 滾動到底部時，抓取更多資料 v

// 取得剩餘呼叫次數

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Modal } from "bootstrap";

const clientId =import.meta.env.VITE_APP_CLIENT_ID;
const api = 'https://api.unsplash.com/search/photos/';

const PhotoList = ( { photoData, photoListRef, getSinglePhoto } ) => (
	<div className="row" ref={photoListRef}>
	{
		photoData.map( ( photo ) => (
			<div key={ photo.id } className="col-6" onClick={() => getSinglePhoto(photo.id)}>
				<div className="card mb-3">
					<img
						src={ photo.urls.regular }
						alt=""
						className="w-100 h-100 object-cover" />
				</div>
			</div>
		) )
	}
</div>
)

export default function PracThree() {
	const [ keyword, setKeyword ] = useState('buildings');
	const [ photoData, setPhotoData ] = useState([]);
	const [ xRatelimitRemaining, setXRatelimitRemaining] = useState(0);
	const [ isLoading, setIsLoading ] = useState(false);
	const [ singlePhotoUrl, setSinglePhotoUrl ] = useState('');
	const photoListRef = useRef(null);
	const currentPage = useRef(1);
	const isLoadingRef = useRef(false);
	const modalRef = useRef(null);
	const modal = useRef(null);

	// 取得遠端資料 function
	const getPhotos = async( page = 1, isNew ) => {
		isLoadingRef.current = true
		setIsLoading( true )
		try {
			const res = await axios( `${api}?client_id=${clientId}&query=${keyword}&page=${page}` )
			setXRatelimitRemaining( res.headers['x-ratelimit-remaining'] )
			const { results } = res.data
			if ( isNew ) {
				setPhotoData( results );
			} else {
				setPhotoData( (prePhotoData) => {
					return [ ...prePhotoData, ...results ]
				} );
			}
		} catch (error) {
			console.log(error)
		}
		setTimeout(() => {
			isLoadingRef.current = false
			setIsLoading( false )
		}, 1000)
	}

	// 處理搜尋
	const handleKeyword = ( e ) => {
		if ( e.key === 'Enter' ) {
			setKeyword( e.target.value )
		}
	}

	// 取得遠端資料
	useEffect( () => {
		getPhotos(1, true);

		const scrollEvent = () => {
			const height = photoListRef.current.offsetHeight + photoListRef.current.offsetTop - window.innerHeight;
			if ( height <= window.scrollY && !isLoadingRef.current ) {
				currentPage.current++
				getPhotos( currentPage.current )
			}
		}

		window.addEventListener( 'scroll', scrollEvent )
		
		return () => { window.removeEventListener( 'scroll', scrollEvent ) }
	}, [ keyword ])

	// 取得單張照片
	const getSinglePhoto = async( id ) => {
		try {
			const res = await axios.get( `https://api.unsplash.com/photos/${id}/?client_id=${clientId}` )
			setSinglePhotoUrl(res.data.urls.regular);
			modal.current.show();
		} catch( error ) {
			console.log(error);
		}
	}

	useEffect( () => {
		const body = document.querySelector('body')
		isLoading ? body.classList.add('overflow-hidden') : body.classList.remove('overflow-hidden')
	}, [isLoading])

	useEffect(() => {
		modal.current = new Modal(modalRef.current)
	})

	return (
		<>
			<h2>
				PracThree
			</h2>
			<input
				type="text"
				className="form-control mb-3"
				defaultValue={ keyword }
				onKeyDown={ ( e ) => { handleKeyword( e ) } }
			/>
			<p>剩餘呼叫次數：{xRatelimitRemaining}</p>
			<PhotoList photoData={ photoData } photoListRef={photoListRef} getSinglePhoto={getSinglePhoto} />
			<div className={`loading ${ isLoading ? 'show' : '' }`}>
				<div className="spinner-border" role="status">
						<span className="visually-hidden">Loading...</span>
				</div>
			</div>
			<div className="modal" tabIndex="-1" ref={ modalRef }>
					<div className="modal-dialog">
							<img src={ singlePhotoUrl } alt="" className="w-100" />
					</div>
			</div>
		</>
	)
}