import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { getRequest } from '../../../utils/api';
import ButtonCom from '../../../CommonComponent/ButtonCom';
import Table from '../../../CommonComponent/Table';
import filter from '../../../assets/filter.png'
import { useDispatch, useSelector } from 'react-redux';
import { allStudentList } from '../../../action/teacherStudent';
import { allStudentHeader } from '../../../StaticData/staticObj';

const AllStudent = () => {
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [students, setStudents] = useState([]);
    const [allStudent, setAllStudent] = useState(true);
    const [dataNotFound, setDataNoFound] = useState(false)
    const allStudentArray = useSelector((state) => state.teacherStudent);
    useEffect(() => {
        if (allStudentArray?.allStudent) {
            setAllStudent(allStudentArray?.allStudent)
        }
    },[allStudentArray])
  
    useEffect(() => {
        let apiEndpoint = allStudent ? 'dashboard/Teachers' : 'dashboard/Teachers/StudentForExam';
        const fetchData = async () => {
            const response = await getRequest(apiEndpoint, token);
            if (response.statusCode === 200) {
                setStudents(response.data);
                setDataNoFound(true);
            }
            else {
                console.log(response?.message);
                setDataNoFound(true);
            }
        }
        fetchData();
    }, [allStudent]);

    useEffect(() => {
        let apiEndpoint = allStudent ? 'dashboard/Teachers' : 'dashboard/Teachers/StudentForExam';
        dispatch(allStudentList(apiEndpoint,token))
    },[allStudent])
    
    const tableData = students.map((val, index) => ({
        Index: index,
        Name: val.name,
        Email: val.email,
        Status: val.status,
        Action: <ButtonCom text='student Details' id={val._id} onClick={() => navigate(`/teacher/student/${val._id}`)} />
    }))
    return (
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", }}>
            <div style={{ display: "flex", justifyContent: 'space-between', padding: "0px 20px", maxWidth: "900px", width: "100%", flexWrap: "wrap", alignItems: 'center' }}>
                <h1 style={{ textAlign: 'center', color: "rgb(18, 219, 206)" }}>{allStudent ? 'All Students' : 'Verified Students'}</h1>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>
                    <p style={{ fontSize: "18px" }}> {allStudent ? 'See Verified Students' : 'See All Students'}</p>
                    <ButtonCom text={<img src={filter} alt='Filter' width='20px' height='20px' />} onClick={() => setAllStudent(!allStudent)} />
                </div>
            </div>
            <div style={{ maxWidth: "1000px", margin: "0px auto", width: "100%", padding: "20px", maxHeight: "50vh", }}>
                <Table tableHeader={allStudentHeader} tableData={tableData} dataNotFound={dataNotFound}/> 
            </div>
        </div>
    )
}

export default AllStudent
