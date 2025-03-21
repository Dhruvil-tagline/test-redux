import { useLocation } from 'react-router-dom'
import Table from '../../CommonComponent/Table';
import { useSelector } from 'react-redux';
const tableHeader = ['Index', 'Subject', "Score", 'Rank'];

const StudentResult = () => {
  const { state } = useLocation();
  const user = useSelector((state) => state.auth);
  const tableData = state?.Result.map((res, index) => ({
    Index: index + 1,
    Subject: res.subjectName,
    Score: res.score,
    Rank: res.rank
  }))
  return (
    <div style={{ display: "flex", justifyContent: 'center', height: "80vh", alignItems: "center", flexDirection: "column" }}>
      <h1 style={{ color: " rgb(18, 219, 206)" }}> Hello" {user?.user?.name || 'Unknown'} your Result is</h1>
      <p style={{ padding: "10px 0px" }}> {user?.user?.email || 'Data not found'}</p>
      <div style={{ maxWidth: "900px", padding: "10px", width: "100%" }}>
        <Table tableData={tableData} tableHeader={tableHeader} />
      </div>
    </div>

  )
}

export default StudentResult
