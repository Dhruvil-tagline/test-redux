import { useSelector } from 'react-redux';
import ButtonCom from '../../CommonComponent/ButtonCom';
import ExamList from './ExamList';
import { useNavigate } from 'react-router-dom';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth);

  return (
    <div style={{ padding: '0px 20px', }}>
      <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", flexWrap: "wrap", gap: "30px", color: "skyBlue", marginBottom: "20px", textShadow: "12px 12px  4px black" }}>
        <h1>Hello  {user?.user?.name}</h1>
        <h1>Role: {user?.user?.role}</h1>
      </div>
      <div style={{ marginBottom: "10px", display: "flex", justifyContent: 'center', marginBottom: "20px" }}>
        <ButtonCom text='Create New  Exam' color='blue' onClick={() => navigate('/teacher/teacherForm')} />
      </div>
      <ExamList />
    </div>
  )
}

export default TeacherDashboard
