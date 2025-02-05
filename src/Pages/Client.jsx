import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, InputGroup, FormControl, Toast } from "react-bootstrap";
import { HiUsers } from "react-icons/hi2";
import { GiReceiveMoney } from "react-icons/gi";
import {setUsers,setSelectedClient,setSearchQuery,} from "../Slicers/clientSlice";
import { setEmployees, setSelectedEmployee } from "../Slicers/employeeSlice";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { format, parse } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


function Client() {
  const API_URL = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dashboardNav, setDashboardNav] = useState("client");
  const [show, setShow] = React.useState(false);
  const [sendModal, setSendModal] = React.useState(false);
  const [employeeId, setEmployeeId] = React.useState("");
  const [clientName, setClientName] = useState();
  const [contactNumber, setContactNumber] = useState();
  const [amount, setAmount] = useState();
  const [todayrate, setTodayRate] = useState();
  const [city, setCity] = useState("");
  const [message, setMessage] = useState("");
  const [bname, setBname] = useState("")
  const [anumber, setAnumber] = useState("")
  const [ifsc, setIfsc] = useState("")
  const [holdername, setHoldername] = useState("")
  const [holderaddress, setHolderadderss] = useState("")
  const [type, setType] = useState("")
  const [senderinfo, setSenderinfo] = useState("")
  const [clientType, setClientType] = useState("");
  const [narration,setNarration] = useState("")
  const users = useSelector((state) => state.clients.users || []);
  const employees = useSelector((state) => state.employees.employees);
  const selectedClient = useSelector((state) => state.clients.selectedClient);
  const searchQuery = useSelector((state) => state.clients.searchQuery);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [clientIdToDelete, setClientIdToDelete] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [clientNameToDelete, setClientNameToDelete] = useState('');

  useEffect(() => {
    const Authorization = localStorage.getItem("authToken");
    if (Authorization) {
      fetch(`${API_URL}/acc_list`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: Authorization,
        },
      })
        .then((response) => {
          if (response.status === 401) {
            console.error("Unauthorized access - redirecting to login");
            handleUnauthorizedAccess();
            return;
          }
          return response.json();
        })
        .then((data) => dispatch(setUsers(data)))
        .then((data) => console.log(data))
        .catch((error) => console.error("Fetch error:", error));
    } else {
      console.error("No authorization token found in localStorage");
    }
  }, [dispatch]);

  useEffect(() => {
    const Authorization = localStorage.getItem("authToken");
    if (Authorization) {
      fetch(`${API_URL}/list`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: Authorization,
        },
      })
        .then((response) => {
          if (response.status === 401) {
            console.error("Unauthorized access - redirecting to login");
            handleUnauthorizedAccess();
            return;
          }
          return response.json();
        })
        .then((data) => dispatch(setEmployees(data)))

        .catch((error) => console.error("Fetch error:", error));
    } else {
      console.error("No authorization token found in localStorage");
    }
  }, [dispatch]);

  const handleUnauthorizedAccess = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handlemodelClose = () => setSendModal(false);
  const handlemodelShow = () => setSendModal(true);
  const handleClientClick = (client) => {
    dispatch(setSelectedClient(client));
    setSendModal(true);
  };

  const totalCount = users.length;
  const paidCount = users.filter((paid) => paid.paid_and_unpaid == true).length;
  const unpaidCount = users.filter(
    (unpaid) => unpaid.paid_and_unpaid == false
  ).length;

  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handlenav = (client) => {
    dispatch(setSelectedClient(client));
    navigate("/clientinfo");
  };

  const handlenav1 = (client) => {
    dispatch(setSelectedEmployee(client));
    navigate("/employeeinfo");
  };

  const DashboardClient = () => setDashboardNav("client");
  const DashboardPaid = () => setDashboardNav("paid");
  const DashboardUnpaid = () => setDashboardNav("unpaid");


  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");


  const handleDateChange = (date) => {
    setSelectedDate(date ? format(date, "dd-MM-yyyy") : null);
  };

  // const filteredData = useMemo(() => {
  //   if (!Array.isArray(users)) return [];
  //   return users.filter((row) => {
  //     const clientName = row.client_name?.toLowerCase().trim() || "";
  //     const clientContact = row.client_contact?.toLowerCase().trim() || "";
  //     const employeeName = row.employee_name?.toLowerCase().trim() || "";
  //     const accountNumbers = row.accno ? String(row.accno).toUpperCase().trim() : "";
  //     const clientStatus = row.status?.toLowerCase().trim() || "";
  //     const createdAt = row.created_at ? row.created_at.split("T")[0].trim() : "";
  //     const query = searchQuery?.toLowerCase().trim() || "";
  //     const paidAndUnpaid = row.paid_and_unpaid;
  //     const queryUpper = searchQuery?.toUpperCase().trim() || "";
  //     const matchesQuery =
  //       clientName.includes(query) ||
  //       clientContact.includes(query) ||
  //       employeeName.includes(query) ||
  //       accountNumbers.includes(queryUpper);
  //     const matchesDashboardFilter =
  //       dashboardNav === "client" ||
  //       (dashboardNav === "paid" && paidAndUnpaid === 1) ||
  //       (dashboardNav === "unpaid" && paidAndUnpaid === 0);
  //     const matchesStatusFilter = selectedStatus
  //       ? clientStatus === selectedStatus.toLowerCase()
  //       : true;
  //     const matchesDateFilter = selectedDate
  //       ? createdAt === selectedDate.trim()
  //       : true;
  //     return matchesQuery && matchesDashboardFilter && matchesStatusFilter && matchesDateFilter;
  //   });
  // }, [users, searchQuery, dashboardNav, selectedDate, selectedStatus]);


  const filteredData = useMemo(() => {
    if (!Array.isArray(users)) return [];
  
    return users.filter((row) => {
      const clientName = row.client_name?.toLowerCase().trim() || "";
      const clientContact = row.client_contact?.toLowerCase().trim() || "";
      const employeeName = row.employee_name?.toLowerCase().trim() || "";
      const accountNumbers = row.accno ? String(row.accno).toUpperCase().trim() : "";
      const clientStatus = row.status?.toLowerCase().trim() || "";
      const createdAt = row.date?.trim() || ""; // Use `row.date` instead of `created_at`
      const query = searchQuery?.toLowerCase().trim() || "";
      const paidAndUnpaid = row.paid_and_unpaid;
      const queryUpper = searchQuery?.toUpperCase().trim() || "";
  
      const matchesQuery =
        clientName.includes(query) ||
        clientContact.includes(query) ||
        employeeName.includes(query) ||
        accountNumbers.includes(queryUpper);
  
      const matchesDashboardFilter =
        dashboardNav === "client" ||
        (dashboardNav === "paid" && paidAndUnpaid === 1) ||
        (dashboardNav === "unpaid" && paidAndUnpaid === 0);
  
      const matchesStatusFilter = selectedStatus
        ? clientStatus === selectedStatus.toLowerCase()
        : true;
  
      const matchesDateFilter = selectedDate
        ? createdAt === selectedDate.trim() // Compare directly with `selectedDate`
        : true;
  
      return matchesQuery && matchesDashboardFilter && matchesStatusFilter && matchesDateFilter;
    });
  }, [users, searchQuery, dashboardNav, selectedDate, selectedStatus]);
  


  const handleSubmit = (e) => {
    e.preventDefault();
    const currentDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");

    // const clientData = {
    //   client_name: clientName,
    //   client_contact: contactNumber,
    //   client_city: city,
    //   amount: amount,
    //   today_rate: todayrate,
    //   date: currentDate,
    //   sent: false,
    //   message: message,
    //   paid_and_unpaid: false,
    //   success_and_unsuccess: false,
    //   bank_name: bname,
    //   accno: anumber,
    //   ifsc_code: ifsc,
    //   accoun_type: type,
    //   name_of_the_beneficiary: holdername,
    //   address_of_the_beneficiary: holderaddress,
    //   sender_information: senderinfo,
    //   bank_type:clientType,
    //   narration:narration,
    // };
    const clientData = {
      client_name: clientName || "N/A",
      client_contact: contactNumber || "N/A",
      client_city: city || "N/A",
      amount: amount || 0,
      today_rate: todayrate || 0,
      date: currentDate || new Date().toISOString(),
      sent: false,
      message: message || "",
      paid_and_unpaid: false,
      success_and_unsuccess: false,
      bank_name: bname || "N/A",
      accno: anumber || "N/A",
      ifsc_code: ifsc || "N/A",
      accoun_type: type || "N/A",
      name_of_the_beneficiary: holdername || "N/A",
      address_of_the_beneficiary: holderaddress || "N/A",
      sender_information: senderinfo || "N/A",
      bank_type: clientType || "N/A",
      narration: narration || "N/A",
    };
     console.log(clientData)    

    fetch(`${API_URL}/acc_insertarrays`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(clientData),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Something went wrong!");
      })
      .then((data) => {
        console.log("Response data:", data);
        alert("New Client Created");
        setShow(false);
        resetForm();
        // Re-fetch client list to show updated data
        fetch(`${API_URL}/acc_list`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("authToken"),
          },
        })
          .then((response) => response.json())
          .then((updatedData) => dispatch(setUsers(updatedData)))
          .catch((error) => console.error("Error fetching updated data:", error));

      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
 
 
  // const handleSubmit = async (e) => {
  //   e.preventDefault(); // Prevent default form submission
  
  //   try {
  //     const Authorization = localStorage.getItem("authToken");
  //     const currentDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");
  
  //     const clientData = {
  //       client_name: clientName,
  //       client_contact: contactNumber,
  //       client_city: city,
  //       amount: amount,
  //       today_rate: todayrate,
  //       date: currentDate,
  //       sent: false,
  //       message: message,
  //       paid_and_unpaid: false,
  //       success_and_unsuccess: false,
  //       bank_name: bname,
  //       accno: anumber,
  //       ifsc_code: ifsc,
  //       accoun_type: type,
  //       name_of_the_beneficiary: holdername,
  //       address_of_the_beneficiary: holderaddress,
  //       sender_information: senderinfo,
  //       bank_type: clientType,
  //       narration: narration,
  //     };
  //     console.log(clientData)
  //     // Send client data
  //     const response = await fetch(`${API_URL}/acc_insertarrays`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization, // Include token if required
  //       },
  //       body: JSON.stringify(clientData),
  //     });
  
  //     if (!response.ok) {
  //       throw new Error("Failed to create client");
  //     }
  
  //     const data = await response.json();
  //     console.log("Response data:", data);
  //     alert("New Client Created");
  //     setShow(false);
  //     resetForm();
  
  //     // Fetch updated client list
  //     const clientListResponse = await fetch(`${API_URL}/acc_list`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization,
  //       },
  //     });
  
  //     if (!clientListResponse.ok) {
  //       throw new Error("Failed to fetch updated client list");
  //     }
  
  //     const updatedData = await clientListResponse.json();
  //     dispatch(setUsers(updatedData));
  
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };
  
 
  const resetForm = () => {
    setClientName("");
    setContactNumber("");
    setAmount("");
    setTodayRate("");
    setCity("");
    setMessage("");
    setBname("");
    setAnumber("");
    setIfsc("");
    setHoldername("");
    setHolderadderss("");
    setType("");
    setSenderinfo("");
  };
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      // Sort by client_id in descending order first
      if (b.client_id !== a.client_id) {
        return b.client_id - a.client_id;
      }

      // Convert date strings to Date objects
      const dateA = parse(a.date, "yyyy-MM-dd HH:mm:ss", new Date());
      const dateB = parse(b.date, "yyyy-MM-dd HH:mm:ss", new Date());

      // Sort by sent status, then by date in descending order
      if (a.sent === b.sent) {
        return dateB - dateA;
      }
      return a.sent ? 1 : -1;
    });
  }, [filteredData]);

  const handleDelete = (clientId) => {
    const Authorization = localStorage.getItem("authToken");

    fetch(`${API_URL}/acc_delete/${clientId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: Authorization,

      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete client");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Client deleted successfully:", data);
        setShowConfirmModal(false); // Close the modal
        setToastMessage(`Client ${clientNameToDelete} deleted successfully!`);
        setShowToast(true); // Show the success notification
        // dispatch(setUsers(updatedData));
        fetch(`${API_URL}/acc_list`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("authToken"),
          },
        })
          .then((response) => response.json())
          .then((updatedData) => dispatch(setUsers(updatedData)))
          .catch((error) => console.error("Error fetching updated data:", error)); // Update the list of clients
      })
      .catch((error) => {
        console.error("Error deleting client:", error);
      });
  };

  const showConfirm = (clientId, clientName) => {
    setClientIdToDelete(clientId);
    setClientNameToDelete(clientName);
    setShowConfirmModal(true);
  };



  const handlesend = async (client_id) => {
    const sendData = {
      client_id,
      user_id: employeeId,
      sent: true,
    };

    try {
      const response = await fetch(`${API_URL}/client_IDupdated/${client_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sendData),
      });
      if (!response.ok) {
        throw new Error("Failed to update client");
      }
      const result = await response.json();
      console.log("Updated client response:", result);
      setSendModal(false);
      alert("Employee assignment successful");
      fetch(`${API_URL}/acc_list`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("authToken"),
        },
      })
        .then((response) => response.json())
        .then((updatedData) => dispatch(setUsers(updatedData)))
        .catch((error) => console.error("Error fetching updated data:", error));

    } catch (error) {
      console.error("Fetch error:", error);
    }
  };


  const [selectedRows, setSelectedRows] = useState([]);
  const handleCheckboxChange = (client) => {
    setSelectedRows((prevSelected) => {
      if (prevSelected.some((item) => item.client_id === client.client_id)) {
        return prevSelected.filter((item) => item.client_id !== client.client_id);
      } else {
        return [...prevSelected, client];
      }
    });
  };

  // const exportToCSV = () => {
  //   if (selectedRows.length === 0) {
  //     alert("No rows selected to export.");
  //     return;
  //   }

  //   const csvData = selectedRows.map((client, index) => {
  //     const employee = employees.find((e) => e.user_id === client.user_id);
  //     return {
  //       "#": 1,
  //       "Client Name": client.client_name || 'Unknown Client',
  //       "Client Number": client.client_contact || 'Unknown Client',
  //       "Amount": client.amount || 0,
  //       "Date": client.amount || 0,
  //       "Bank Name": client.bank_name || 'Unknown Bank',
  //       "IFSC Code": client.ifsc_code || 'Unknown IFSC',
  //       "Account Number": client.accno || 'Unknown Account',
  //       "Beneficiary Name": client.name_of_the_beneficiary || 'Unknown Beneficiary',
  //       "Beneficiary Address": client.address_of_the_beneficiary || 'Unknown Address',
  //       "Sender Information": client.sender_information || 'Unknown Sender',

  //     };
  //   });

  //   const csvContent = [
  //     ["#", "Client Name", "Client Number", "Amount", "Date", "Bank Name", "IFSC Code", "Account Number", "Beneficiary Name", "Beneficiary Address", "Sender Information"],
  //     ...csvData.map((row) => Object.values(row)),
  //   ]
  //     .map((e) => e.join(","))
  //     .join("\n");
  //   const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  //   const link = document.createElement("a");
  //   link.href = URL.createObjectURL(blob);
  //   link.download = `selected_clients_${format(new Date(), "dd-MM-yyyy")}.csv`;
  //   link.click();
  // };
  
  const exportToCSV = () => {
    if (selectedRows.length === 0) {
      alert("No rows selected to export.");
      return;
    }
  
    const csvData = selectedRows.map((client, index) => {
      let clientData = {
        "#": index + 1, // Adjusting index for correct row numbering
        "Client Name": client.client_name || "Unknown Client",
        "Amount": client.amount || 0,
        "Account Number": client.accno || "Unknown Account",
      };
  
      if (client.bank_type === "bank1") {
        clientData["Narration"] = client.narration || "N/A"; // Include Narration for Bank1 only
      } else if (client.bank_type !== "bank2") {
        // Include all fields if bank_type is neither "Bank1" nor "Bank2"
        clientData = {
          ...clientData,
          "Client Number": client.client_contact || "Unknown Client",
          "Bank Name": client.bank_name || "Unknown Bank",
          "IFSC Code": client.ifsc_code || "Unknown IFSC",
          "Beneficiary Name": client.name_of_the_beneficiary || "Unknown Beneficiary",
          "Beneficiary Address": client.address_of_the_beneficiary || "Unknown Address",
          "Sender Information": client.sender_information || "Unknown Sender",
        };
      } 
      else {
        clientData = {
          ...clientData,
          "Client Number": client.client_contact || "Unknown Client",
          "Date": client.date || "N/A",
          "Bank Name": client.bank_name || "Unknown Bank",
          "IFSC Code": client.ifsc_code || "Unknown IFSC",
          "Beneficiary Name": client.name_of_the_beneficiary || "Unknown Beneficiary",
          "Beneficiary Address": client.address_of_the_beneficiary || "Unknown Address",
          "Sender Information": client.sender_information || "Unknown Sender",
        };
      }
  
      return clientData;
    });
  
    
    const headers = [...new Set(csvData.flatMap((row) => Object.keys(row)))];
    const csvContent = [
      headers,
      ...csvData.map((row) => headers.map((header) => row[header] || "")), 
    ]
      .map((e) => e.join(",")) 
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `selected_clients_${format(new Date(), "dd-MM-yyyy")}.csv`;
    link.click();
  };
  
  
  return (
    <div style={{ marginTop: "50px", width: '100%' }}>
      <div className="page-header">
        <h1>Client</h1>
        <small>Client / Dash</small>
      </div>
      <div className="analytics">
        <div
          className={dashboardNav === "client" ? "cardAction" : "card"}
          onClick={DashboardClient}
        >
          <div className="card-head">
            <h2>{totalCount}</h2>{" "}
            <span className="las la-user-friends">
              <HiUsers />
            </span>
          </div>
          <div className="card-progress">
            <small>Client</small>
          </div>
        </div>

        <div
          className={dashboardNav === "paid" ? "cardAction" : "card"}
          onClick={DashboardPaid}
        >
          <div className="card-head">
            <h2>{paidCount}</h2>
            <span className="las la-user-friends">
              <GiReceiveMoney />
              <HiUsers />
            </span>
          </div>
          <div className="card-progress">
            <small>Money Paid Client</small>
          </div>
        </div>

        <div
          className={dashboardNav === "unpaid" ? "cardAction" : "card"}
          onClick={DashboardUnpaid}
        >
          <div className="card-head">
            <h2>{unpaidCount}</h2>
            <span className="las la-user-friends">
              <GiReceiveMoney />
              <HiUsers />
            </span>
          </div>
          <div className="card-progress">
            <small>Money Pending Client</small>
          </div>
        </div>
      </div>
      <div className="records table-responsive  table-responsive-md table-responsive-sm">
        <div className="record-header">
          <div className="add">
            <Button className="w-auto" onClick={handleShow}>
              Add New
            </Button>
          </div>
          <div className="browse">
            <Button onClick={exportToCSV} className='w-auto mb-1'>Export to CSV</Button>
            <div style={{ paddingTop: "10px" }}>
              <InputGroup className="d-flex gap-2 align-items-center">
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  placeholderText="Select Date"
                  dateFormat="dd-MM-yyyy"
                  className="form-control"
                  isClearable
                />
                <FormControl
                  placeholder="Name,phoneNumber,Acc_number"
                  aria-label="Search"
                  className="record-search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </InputGroup>
            </div>
          </div>
        </div>
        <div className="table-responsive-md table-responsive-sm">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>CLIENT</th>
                <th>CITY</th>
                <th>TOTAL</th>
                <th>STATUS</th>
                <th>LAST PAID DATE</th>
                <th>TOTALLY PAID AMOUNT</th>
                <th>BALANCE AMOUNT</th>
                <th>COLLECTION AGENT</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((row, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="checkbox"
                      style={{ width: "20px", height: "15px", paddingRight: '10px' }}
                      onChange={() => handleCheckboxChange(row)}
                      checked={selectedRows.some((item) => item.client_id === row.client_id)}
                    />
                    {row.client_id}
                  </td>
                  <td>
                    <div className="client">
                      <div
                        className="client-img bg-img"
                        style={{
                          backgroundImage:
                            "url(https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg)",
                        }}
                      ></div>
                      <div className="client-info">
                        <h4>{row.client_name ? row.client_name.replace(/"/g, "").toUpperCase() : ""}</h4>
                        <small>{row.client_contact.toUpperCase()}</small>
                      </div>
                    </div>
                  </td>
                  <td>{row.client_city ? row.client_city.replace(/"/g, "").toUpperCase() : ""}</td>
                  <td>
                    {row.amount ? row.amount : 0}{" "}
                    <span style={{ fontWeight: "bolder", color: "black" }}>KWD</span>
                  </td>
                  <td>
                    <p className={`badge ${row.paid_and_unpaid == 1 ? "bg-success" : "bg-danger"}`}>
                      {row.paid_and_unpaid == 1 ? "PAID" : "UNPAID"}
                    </p>
                  </td>
                  <td>
                    {Array.isArray(row.paid_amount_date) && row.paid_amount_date.length > 0 ? (
                      <div>{row.paid_amount_date[row.paid_amount_date.length - 1].date.toUpperCase()}</div>
                    ) : (
                      <span>-</span>
                    )}
                  </td>
                  <td>
                    {Array.isArray(row.paid_amount_date) && row.paid_amount_date.length > 0 ? (
                      <div>
                        {row.paid_amount_date
                          .reduce((total, entry) => total + parseFloat(entry.amount || 0), 0)
                          .toFixed(2)}{" "}
                        <span style={{ fontWeight: "bolder", color: "black" }}>KWD</span>
                      </div>
                    ) : (
                      <span>NO PAYMENTS YET</span>
                    )}
                  </td>
                  <td>
                    {Array.isArray(row.paid_amount_date) && row.paid_amount_date.length > 0 ? (
                      <div>
                        {(
                          (row.amount ? parseFloat(row.amount) : 0) -
                          row.paid_amount_date.reduce((total, entry) => total + parseFloat(entry.amount || 0), 0)
                        ).toFixed(2)}
                        <span style={{ fontWeight: "bolder", color: "black" }}>KWD</span>
                      </div>
                    ) : (
                      <span>NO PAYMENTS YET</span>
                    )}
                  </td>
                  <td>
                    {employees.length > 0 && row.user_id ? (
                      employees.some((eid) => eid.user_id === row.user_id) ? (
                        employees
                          .filter((eid) => eid.user_id === row.user_id)
                          .map((eid, idx) => (
                            <span key={idx} onClick={() => handlenav1(eid)}>
                              {eid.username.toUpperCase()}
                            </span>
                          ))
                      ) : (
                        <span>NO AGENT ASSIGNED</span>
                      )
                    ) : (
                      <span>NO AGENT</span>
                    )}
                  </td>
                  <td>
                    <div className="actions d-flex justify-content-start align-items-center pt-3">
                      {row.sent == false ? (
                        <span
                          className=""
                          style={{
                            cursor: "pointer",
                            fontSize: "11px",
                            backgroundColor: "#00bbf0",
                            padding: "5px 10px 5px 10px",
                            color: "white",
                            borderRadius: "10px",
                          }}
                          onClick={() => handleClientClick(row)}
                        >
                          SEND
                        </span>
                      ) : (
                        <span></span>
                      )}
                      <span
                        className=""
                        style={{
                          cursor: "pointer",
                          fontSize: "11px",
                          backgroundColor: "#42b883",
                          padding: "5px 10px 5px 10px",
                          color: "white",
                          borderRadius: "10px",
                        }}
                        onClick={() => handlenav(row)}
                      >
                        VIEW
                      </span>
                      <span
                        style={{
                          cursor: "pointer",
                          fontSize: "11px",
                          backgroundColor: "#dc2f2f",
                          padding: "5px 10px 5px 10px",
                          color: "white",
                          borderRadius: "10px",
                        }}
                        onClick={() => showConfirm(row.client_id, row.client_name)}
                      >
                        DELETE
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal show={sendModal} onHide={() => setSendModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Assign Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedClient ? (
            <form>
              <div className="txt_field">
                <h4>Client Name</h4>
                <input
                  type="text"
                  value={
                    selectedClient.client_name
                      ? selectedClient.client_name.replace(/"/g, "")
                      : ""
                  }
                  readOnly
                />
              </div>
              <div className="txt_field">
                <h4>Client Contact Number</h4>
                <input
                  type="text"
                  value={
                    selectedClient.client_contact
                      ? selectedClient.client_contact.replace(/"/g, "")
                      : ""
                  }
                  readOnly
                />
              </div>
              <div>
                <h4>Assign Employee</h4>
                {/* <select
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  style={{ padding: "0px 0px 0px 0px", border: "none" }}
                >
                  {employees.map(
                    (emp) =>
                      emp.role === "Collection Agent" && (
                        <option
                          key={emp.user_id}
                          value={emp.user_id}
                          style={{ fontSize: "15px" }}
                        >
                          {emp.username}
                        </option>
                      )
                  )}
                </select> */}
                <select
  value={employeeId}
  onChange={(e) => setEmployeeId(e.target.value)}
  style={{ padding: "0px", border: "none" }}
>
  {/* Default option */}
  <option value="" disabled>
    Select Employee
  </option>

  {/* Show only employees with role "Collection Agent" */}
  {employees
    .filter((emp) => emp.role === "Collection Agent")
    .map((emp) => (
      <option key={emp.user_id} value={emp.user_id} style={{ fontSize: "15px" }}>
        {emp.username}
      </option>
    ))}
</select>

              </div>
            </form>
          ) : (
            <p>No client selected</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSendModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => handlesend(selectedClient.client_id)}
          >
            Assign
          </Button>
        </Modal.Footer>
      </Modal>

      
      <Modal show={show} onHide={handleClose} dialogClassName="custom-modal">
        <div className="dio" style={{ width: '70vw' }}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Client</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit} className="custom-form">
              <div className="row d-flex  gap-5 xl-gap-1 justify-content-center align-items-center col-xxl-12 col-xl-12 col-md-12 col-12 ">
                <div className=" txt_field col-xxl-5 col-xl-5  col-lg-5 col-md-10  col-sm-10  ">
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    required
                  />
                  <label>Client Name</label>
                </div>
                <div className=" txt_field  col-xxl-5 col-xl-5  col-md-10  col-lg-5 col-sm-10">
                  <input
                    type="text"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    required
                  />
                  <label>Client Contact Number</label>
                </div>
              </div>
              <div className="row d-flex  gap-5 xl-gap-1 justify-content-center align-items-center col-xxl-12 col-xl-12 col-md-12 col-12 ">
                <div className="txt_field col-xxl-5 col-xl-5  col-lg-5 col-md-10  col-sm-10 ">
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                  <label>City</label>
                </div>
                <div className="txt_field col-xxl-5 col-xl-5  col-lg-5 col-md-10  col-sm-10 ">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                  <label>Amount</label>
                </div>
              </div>


             
    <div className="row d-flex gap-5 xl-gap-1 justify-content-center align-items-center col-xxl-12 col-xl-12 col-md-12 col-12">
      <div className="txt_field col-xxl-5 col-xl-5 col-lg-5 col-md-10 col-sm-10">
        <input
          type="number"
          value={todayrate}
          onChange={(e) => setTodayRate(e.target.value)}
          required
        />
        <label>Today Rate</label>
      </div>
      </div>
              
              <div className="row d-flex  gap-5 xl-gap-1 justify-content-center align-items-center col-xxl-12 col-xl-12 col-md-12 col-12 ">
                <div className="row col-xxl-3 col-xl-3 col-lg-3 col-md-12 col-sm-12">
                  <label className="form-label">Client Account Type</label>
                  <select
                    className="form-select"
                    value={clientType}
                    onChange={(e) => setClientType(e.target.value)}
                  >
                    <option value="bank1">Bank 1</option>
                    <option value="bank2">Bank 2</option>
                  </select>
                </div>
              </div>
{clientType === "bank2" ? (
  <div className="col-xxl-12 col-xl-12 col-md-12 col-12">
    <div className="row d-flex gap-5 xl-gap-1 justify-content-center align-items-center col-xxl-12 col-xl-12 col-md-12 col-12">
      <div className="txt_field col-xxl-5 col-xl-5 col-lg-5 col-md-10 col-sm-10">
        <input
          type="text"
          value={bname}
          onChange={(e) => setBname(e.target.value)}
          required
        />
        <label>Bank Name</label>
      </div>
    </div>

    <div className="row d-flex gap-5 xl-gap-1 justify-content-center align-items-center col-xxl-12 col-xl-12 col-md-12 col-12">
      <div className="txt_field col-xxl-5 col-xl-5 col-lg-5 col-md-10 col-sm-10">
        <input
          type="text"
          value={anumber}
          onChange={(e) => setAnumber(e.target.value)}
          required
        />
        <label>Account Number</label>
      </div>

      <div className="txt_field col-xxl-5 col-xl-5 col-lg-5 col-md-10 col-sm-10">
        <input
          type="text"
          value={ifsc}
          onChange={(e) => setIfsc(e.target.value)}
          required
        />
        <label>IFSC Code</label>
      </div>
    </div>

    <div className="row d-flex gap-5 xl-gap-1 justify-content-center align-items-center col-xxl-12 col-xl-12 col-md-12 col-12">
      <div className="txt_field col-xxl-5 col-xl-5 col-lg-5 col-md-10 col-sm-10">
        <input
          type="text"
          value={holdername}
          onChange={(e) => setHoldername(e.target.value)}
          required
        />
        <label>Name of the Beneficiary</label>
      </div>

      <div className="txt_field col-xxl-5 col-xl-5 col-lg-5 col-md-10 col-sm-10">
        <input
          type="text"
          value={holderaddress}
          onChange={(e) => setHolderadderss(e.target.value)}
          required
        />
        <label>Address of the Beneficiary</label>
      </div>
    </div>

    <div className="row d-flex gap-5 xl-gap-1 justify-content-center align-items-center col-xxl-12 col-xl-12 col-md-12 col-12">
      <div className="txt_field col-xxl-5 col-xl-5 col-lg-5 col-md-10 col-sm-10">
        <input
          type="text"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        />
        <label>Account Type</label>
      </div>
      <div className="txt_field col-xxl-5 col-xl-5 col-lg-5 col-md-10 col-sm-10">
        <input
          type="text"
          value={senderinfo}
          onChange={(e) => setSenderinfo(e.target.value)}
          required
        />
        <label>Sender Information</label>
      </div>
    </div>
  </div>
) : (
  <div className="col-xxl-12 col-xl-12 col-md-12 col-12">
    <div className="row d-flex gap-5 xl-gap-1 justify-content-center align-items-center col-xxl-12 col-xl-12 col-md-12 col-12">
      <div className="txt_field col-xxl-5 col-xl-5 col-lg-5 col-md-10 col-sm-10">
        <input
          type="text"
          value={anumber}
          onChange={(e) => setAnumber(e.target.value)}
          required
        />
        <label>Account Number</label>
      </div>

      <div className="txt_field col-xxl-5 col-xl-5 col-lg-5 col-md-10 col-sm-10">
        <input
          type="text"
          value={narration}
          onChange={(e) => setNarration(e.target.value)}
          required
        />
        <label>NARRATION</label>
      </div>
    </div>
  </div>
)}

              <Modal.Footer className=" w-100 justify-content-center">
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" type="submit">
                  Save Changes
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Body>
        </div>
      </Modal>
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the client "<span className="fw-bold">{clientNameToDelete}</span>"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (clientIdToDelete) {
                handleDelete(clientIdToDelete);
              }
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <Toast
        style={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 9999,
          backgroundColor: "green",
          color: "white",
        }}
        show={showToast}
        onClose={() => setShowToast(false)}
        delay={3000}
        autohide
      >
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
    </div>
  );
}

export default Client;
