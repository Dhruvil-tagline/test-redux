import { NavLink, Outlet } from 'react-router-dom';
import './studCss/studentNav.css'

const StudentProfile = () => {
    return (
        <div className='stuContainer'>
            <nav className='StudentNavbar'>
                <NavLink className={({ isActive }) => isActive ? "StuActive" : " "} to='/student/profile/editName'>Edit Name</NavLink>
                <NavLink className={({ isActive }) => isActive ? "StuActive" : ""} to='/student/profile/resetPassword'>Change Password</NavLink>
            </nav>
            <Outlet/>
        </div>
    )
}

export default StudentProfile
