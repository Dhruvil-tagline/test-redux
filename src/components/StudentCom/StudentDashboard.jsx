import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Table from '../../CommonComponent/Table';
import { getRequest } from '../../utils/api';
import ButtonCom from '../../CommonComponent/ButtonCom';
import { useSelector } from 'react-redux';
const tableHeader = ['Index', 'Subject', 'Email', 'Notes', 'Action'];

const StudentDashboard = () => {
  const user = useSelector((state) => state.auth);
  const [exam, setExam] = useState([]);
  const [dataNotFound, setDataNotFound] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      let response = await getRequest('student/studentExam', user?.token);
      if (response.statusCode === 200) {
        setDataNotFound(true);
        setExam(response.data);
      }
      else {
        setDataNotFound(true);
      }
    }
    fetchData()
  }, []);
  const tableData = useMemo(() => {
    return exam.map((val, index) => ({
      Index: index + 1,
      Subject: val.subjectName,
      Email: val.email,
      Notes: val.notes.join(', '),
      Action: !!val?.Result?.length ? (<ButtonCom text='View result' onClick={() => navigate('/student/result', { state: val })} />)
        : (<ButtonCom text='Start Exam' onClick={() => navigate('/student/examForm', { state: { id: val._id, subjectName: val.subjectName, notes: val.notes } })} />)
    }))
  }, [exam])
  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", flexWrap: "wrap", gap: "30px", color: "skyBlue", marginBottom: "20px", textShadow: "12px 12px  4px black" }}>
        <h1>Hello  {user?.user?.name}</h1>
        <h1>Role: {user?.user?.role}</h1>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ maxWidth: "1100px", padding: "10px", width: "100%" }}>
          <Table tableData={tableData} tableHeader={tableHeader} dataNotFound={dataNotFound} />
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
