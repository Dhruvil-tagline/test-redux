import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux';

const Protected = ({ children }) => {
    const auth = useSelector((val) => val.auth);
    return ((!!auth?.token ? children : <Navigate to='/login' />))
}

export default Protected
