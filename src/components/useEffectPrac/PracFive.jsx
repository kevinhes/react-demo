// 版型製作
// 輸入框的 useState and handler
// import axios
// useEffect get unsplash photo data
// 渲染到畫面上
// 製作搜尋功能
// 搜尋功能優化
// 滾動加載更多
	// 增加 api 的 page 參數
	// 取得照片列表的 ref
	// 取得列表高度
	// 視窗高度大於等於列表高度時取得照片
	// 增加 isLoading 狀態 以及 isloadingRef 來避免重複取得資料
// 優惠搜尋功能
// 清除滾動事件
// 取得剩餘呼叫次數

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const clientId =import.meta.env.VITE_APP_CLIENT_ID;
const api = 'https://api.unsplash.com/search/photos/';

export default function PracFive() {
	const [ keyword, setKeyword ] = useState('building');
	const [ photoData, setPhotoData ] = useState([]);
	const [ isLoading, setIsLoading ] = useState(false);
	const [ xRatelimitRemaining, setXRatelimitRemaining ] = useState(0);
	const currentPage = useRef(1);
	const photoList = useRef(null);
	const isLoadingRef = useRef(false);

	const handleSearch = ( e ) => {
		if( e.key === 'Enter' ) {
			setKeyword( e.target.value );
		}
	}

	const getPhotosData = async ( page = 1, isNew ) => {
		setIsLoading( true );
		isLoadingRef.current = true;
		try {
			const res = await axios.get( `${api}?client_id=${clientId}&query=${keyword}&page=${page}` )
			setXRatelimitRemaining( res.headers['x-ratelimit-remaining'] );
			const { results } = res.data;
			if ( isNew ) {
				setPhotoData( results );
			} else {
				setPhotoData( ( preData ) => {
					return [ ...preData, ...results ];
				} );
			}
			setTimeout( () => {
				isLoadingRef.current = false;
				setIsLoading( false );
			}, 1000 );
		} catch( error ) {
			console.log(error);
		}
	}

	useEffect(() => {
		getPhotosData(1, true);

		const scrollGetPhotos = () => {
			const listHeight = photoList.current.offsetHeight + photoList.current.offsetTop - window.innerHeight;
			if ( window.scrollY >= listHeight ) {
				currentPage.current += 1;
				getPhotosData( currentPage.current, false );
			}
		}

		window.addEventListener( 'scroll', scrollGetPhotos );

		return () => {
			window.removeEventListener( 'scroll', scrollGetPhotos );
		}
	}, [ keyword ])

	useEffect(() => {
		const body = document.querySelector('body');
		if ( isLoading ) {
			body.style.overflow = 'hidden';
		} else {
			body.style.overflow = 'auto';
		}
	}, [ isLoading])

	return (
		<div>
			<h2>Prac Five</h2>
			<input
				type="text"
				className="form-control mb-3"
				defaultValue={ keyword }
				onKeyDown={ ( e ) => { handleSearch(e) } }
			/>
			<p>剩餘呼叫次數:{ xRatelimitRemaining }</p>
			<div className="row gy-3" ref={photoList}>
				{
					photoData.map( ( photo ) => (
						<div className="col-lg-6" key={ photo.id }>
							<div className="card">
								<img src={ photo.urls.regular } alt={ photo.title } className='w-100 h-100 object-cover' />
							</div>
						</div>
					) )
				}
			</div>
			<div className={`loading ${ isLoading ? 'show' : '' }`}>
				<div className="spinner-border" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
			</div>
		</div>
	)
}