import styles from "../CSS/ManagePayments.module.css";

import React, { useState, useEffect } from "react";
import axios from "axios";


const ManagePayments = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [academicPeriod, setAcademicPeriod] = useState();
  const [statusFilter, setStatusFilter] = useState("All");
  const [date,setDate]=useState(new Date().toISOString().split("T")[0])
  const [teacherList,setTeacherList]=useState([])
  //  new kherti 

  useEffect(()=>{
    console.log(academicPeriod)
  },[academicPeriod])
  useEffect(() => {
    async function getTeachers() {
      try{
      await axios.get(`http://localhost:3000/api/user/get-teachers?date=${date}`).then(res=>{setTeacherList(res.data.teachers)
        setAcademicPeriod(res.data.period)
        console.log(teacherList)
      })
      }
      catch(err){
        console.log(err)
      }
    }
    getTeachers()
    setPayments(teacherList.filter(payment => payment.academicPeriod === academicPeriod));
    setFilteredPayments(teacherList);
  }, [academicPeriod]);
  









  // useEffect(() => {
  //   fetchPayments(academicPeriod);
  // }, [academicPeriod]);

  // const fetchPayments = (period) => {
  //   axios.get(`/api/payments?academicPeriod=${period}`) // Ensure API supports filtering by period
  //     .then((response) => {
  //       const data = Array.isArray(response.data) ? response.data : [];
  //       setPayments(data);
  //       setFilteredPayments(data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching payments:", error);
  //       setPayments([]);
  //       setFilteredPayments([]);
  //     });
  // };

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    filterPayments(term, statusFilter);
  };

  const handleStatusFilter = (event) => {
    const status = event.target.value;
    setStatusFilter(status);
    filterPayments(searchTerm, status);
  };

  const handleAcademicPeriod = (event) => {
    const period = event.target.value;
    setAcademicPeriod(period);
    fetchPayments(period);
  };

  const handleMarkPaid = (id) => {
    axios.put(`/api/payments/${id}`, { status: "Paid" })
      .then(() => {
        const updatedPayments = payments.map(payment =>
          payment.id === id ? { ...payment, status: "Paid" } : payment
        );
        setPayments(updatedPayments);
        filterPayments(searchTerm, statusFilter);
      })
      .catch(error => console.error("Error updating payment status:", error));
  };

  const filterPayments = (term, status) => {
    let filtered = payments.filter((payment) =>
      payment.teacher.toLowerCase().includes(term.toLowerCase())
    );
    if (status !== "All") {
      filtered = filtered.filter((payment) => payment.status === status);
    }
    setFilteredPayments(filtered);
  };

  return (
    <div className={styles.containerpay}>
      <h2 className={styles.payh2}>Manage Payments</h2>
      <div className={styles.controls}>
        <div className={styles.divpay1}>
        <label className={styles.lpay1}>Academic Period:</label>
        <select className={styles.spay1}
          value={academicPeriod}
          onChange={handleAcademicPeriod}
        >
          <option value={1}>P1</option>
          <option value={2}>P2</option>
          <option value={3}>P3</option>
        </select>
        </div>
        <div className={styles.divpay2}>
        <input className={styles.serpay1}
          type="text"
          placeholder="Search teacher..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <select  className={styles.spay1}  value={statusFilter} onChange={handleStatusFilter}>
          <option value="All">All</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
        </select>
        </div>
      </div>
      <div className={styles.tpay}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Teacher</th>
            <th>Sup Hours (Course)</th>
            <th>Sup Hours (Tutorial)</th>

            <th>Sup Hours (Lab woek)</th>
            <th>Total Payment (DA)</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(filteredPayments) && filteredPayments.length > 0 ? (
            filteredPayments.map((payment, index) => (
              <tr key={index}>
                <td>{payment.teacher}</td>
                <td>{payment.supHourCourse}</td>
                <td>{payment.supHourTut}</td>
                <td>{payment.suphourlab}</td>
                <td>{payment.totalPayment}</td>
                <td className={payment.status === 1?styles.paid : styles.unpaid}>
                  {payment.status===1? "Paid":"Unpaid"}
                </td>
                <td>
                  {payment.status === 0 && (
                    <button className={styles.actionButton} onClick={() => handleMarkPaid(payment.id)}>
                      Mark as paid
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className={styles.noData}>No payments found</td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default ManagePayments;