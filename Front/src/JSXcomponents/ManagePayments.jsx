

import styles from "../CSS/ManagePayments.module.css";

import React, { useState, useEffect } from "react";
import axios from "axios";


const ManagePayments = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [academicPeriod, setAcademicPeriod] = useState("P1");
  const [statusFilter, setStatusFilter] = useState("All");
  //  new kherti 
  useEffect(() => {
    // Mock data for testing
    const mockData = [
      { id: 1, teacher: "John Doe", supHours: 10, hourlyRate: 2000, totalPayment: 20000, status: "Unpaid", academicPeriod: "P1" },
      { id: 2, teacher: "Jane Smith", supHours: 15, hourlyRate: 1800, totalPayment: 27000, status: "Paid", academicPeriod: "P1" },
      { id: 3, teacher: "Emily Johnson", supHours: 12, hourlyRate: 1900, totalPayment: 22800, status: "Unpaid", academicPeriod: "P2" },
      { id: 4, teacher: "Michael Brown", supHours: 20, hourlyRate: 2100, totalPayment: 42000, status: "Paid", academicPeriod: "P2" },
      { id: 5, teacher: "Chris Evans", supHours: 8, hourlyRate: 1700, totalPayment: 13600, status: "Unpaid", academicPeriod: "P3" }
    ];
  
    setPayments(mockData.filter(payment => payment.academicPeriod === academicPeriod));
    setFilteredPayments(mockData.filter(payment => payment.academicPeriod === academicPeriod));
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
          <option value="P1">P1</option>
          <option value="P2">P2</option>
          <option value="P3">P3</option>
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
            <th>Sup Hours</th>
            <th>Hourly Rate (DA)</th>
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
                <td>{payment.supHours}</td>
                <td>{payment.hourlyRate}</td>
                <td>{payment.totalPayment}</td>
                <td className={payment.status === "Paid" ? styles.paid : styles.unpaid}>
                  {payment.status}
                </td>
                <td>
                  {payment.status === "Unpaid" && (
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
