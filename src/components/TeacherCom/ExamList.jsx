import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom';
import ButtonCom from '../../CommonComponent/ButtonCom';
import Table from '../../CommonComponent/Table';
import { useDispatch, useSelector } from 'react-redux';
import { deleteExam, fetchExams } from '../../action/examActions';
import { examListHeader } from '../../StaticData/staticObj';

const ExamList = () => {
    const {token} = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const examsList = useSelector((state) => state.exams);

    const handleExaView = (exam) => { navigate(`/teacher/exam/${exam._id}`, { state: { subject: exam.subjectName, notes: exam.notes, id: exam._id } }); }
    
    const handleExaDelete = (id) => {
        let confirmDelete = confirm("Are you sure you want to delete this exam?");
        if (confirmDelete) {
            dispatch(deleteExam(id, token)); 
        }
    };
    useEffect(() => {
        dispatch(fetchExams(token));
    }, [dispatch, token]);

    const tableData = useMemo(() => {
        return examsList?.exams?.map((val) => ({
            Subject: val.subjectName,
            Email: val.email,
            Notes: val.notes.join(', '),
            'View Exam': <ButtonCom text='View Exam' onClick={() => handleExaView(val)} color='green' />,
            'Delete Exam': <ButtonCom text='Delete Exam' onClick={() => handleExaDelete(val._id)} color='red' />
        }));
    }, [examsList]);
    return (
        <div>
            <div style={{ maxWidth: "1100px", margin: "0px auto" }}>
                <Table tableHeader={examListHeader} tableData={tableData} />
            </div>
        </div>
    )
}

export default ExamList
