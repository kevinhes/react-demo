// 載入主要 hook
import { useState, useEffect, useRef } from 'react';
// 載入需要套件
import axios from 'axios';
import { Modal } from 'bootstrap';
// 載入環境元件
const clientId =import.meta.env.VITE_APP_CLIENT_ID;
const api = 'https://api.unsplash.com/search/photos/';

const SearchBar = ( { keyword, handleSearch } ) => (
	<input type="text" className='form-control mb-3' defaultValue={ keyword } onKeyDown={ ( e ) => { handleSearch( e ) } } />
)
const PhotosList = ({photoData, photoListRef, getSinglePhoto}) => (
	<div className="row" ref={photoListRef}>
		{
			photoData.map( ( photo ) => (
				<div className="col-6" key={ photo.id } onClick={ () => { getSinglePhoto(photo.id) } }>
					<div className="card mb-3">
						<img src={ photo.urls.regular } className='w-100 h-100 object-cover' />
					</div>
				</div>
			))
		}
	</div>
)

const ModalComponent = ( { modalRef, singlePhotoUrl } ) => (
	<div className="modal" tabIndex="-1" ref={modalRef}>
		<div className="modal-dialog">
			<img src={ singlePhotoUrl } alt="" className='w-100' />
		</div>
	</div>
)

const LoaderComponent = ( { isLoading } ) => (
	<div className={`loading ${ isLoading ? 'show' : '' }`}>
		<div className="spinner-border" role="status">
			<span className="visually-hidden">Loading...</span>
		</div>
	</div>
)

export default function PracFour() {
	// 設定狀態
	const [ keyword, setKeyword ] = useState('building');
	const [ photoData, setPhotoData ] = useState([]);
	const [ isLoading, setIsLoading ] = useState(false);
	const [ singlePhotoUrl, setSinglePhotoUrl ] = useState('');
	const [ xRatelimitRemaining, setXRatelimitRemaining ] = useState(0);
	const currentPage = useRef(1);
	const isLoadingRef = useRef(false);
	const photoListRef = useRef(null);
	const modalRef = useRef(null);
	const modal = useRef(null);

	// 設定按下 enter 鍵時的事件
	const handleSearch = ( e ) => {
		if( e.key === 'Enter' ) {
			setKeyword( e.target.value )
		}
	}

	const getPhotos = async ( page, isNew ) => {
		isLoadingRef.current = true;
		setIsLoading( true );
		try {
			const res = await axios.get( `${api}?client_id=${clientId}&query=${keyword}&page=${page}` )
			const { results } = res.data;
			setXRatelimitRemaining(res.headers['x-ratelimit-remaining']);
			console.log(res);
			if ( isNew ) {
				setPhotoData( results );
			} else {
				setPhotoData( ( preData ) => {
					return [ ...preData, ...results ];
				} );
			}
		} catch ( error ) {
			console.log(error);
		}
		setTimeout(() => {
			isLoadingRef.current = false;
			setIsLoading( false );
		}, 1000);
	}

	const getSinglePhoto = async( id ) => {
		try {
			const res = await axios.get( `https://api.unsplash.com/photos/${id}/?client_id=${clientId}` )
			setSinglePhotoUrl( res.data.urls.regular );
			modal.current.show();
		} catch ( error ) {
			console.log(error);
		}
	}

	useEffect(() => {
		getPhotos( 1, true );
		const scrollGetPhotos = () => {
			const height = photoListRef.current.offsetHeight + photoListRef.current.offsetTop - window.innerHeight;
			if ( window.scrollY >= height && !isLoadingRef.current ) {
				currentPage.current = currentPage.current + 1;
				getPhotos(currentPage.current, false);
			}
		}
		window.addEventListener('scroll', scrollGetPhotos);
		return () => {
			window.removeEventListener('scroll', scrollGetPhotos);
		}
	}, [keyword])

	useEffect(() => {
		modal.current = new Modal(modalRef.current);
	},[])

	useEffect(() => {
		const body = document.querySelector('body');
		isLoading ? body.classList.add('overflow-hidden') : body.classList.remove('overflow-hidden')
	}, [isLoading])

	return (
		<div>
			<h2>Prac Four</h2>
			<SearchBar keyword={keyword} handleSearch={handleSearch} />
			<p>剩餘呼叫次數：{xRatelimitRemaining}</p>
			<PhotosList
				photoData={photoData} photoListRef={photoListRef} getSinglePhoto={getSinglePhoto} />
			<ModalComponent modalRef={modalRef} singlePhotoUrl={singlePhotoUrl} />
			<LoaderComponent isLoading={isLoading} />
		</div>
	)
}