import { Link } from "react-router-dom"

export default function Navbar() {
    return (
        <div>
            <div className="container">
                <div className="d-flex justify-content-between">
                    <div>
                        <Link to='/'>Home</Link>
                    </div>
                    <ul className="list-unstyled">
                        <li>
                            <Link to="/use-effect-prac"> useEffect prac </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}