import React, { useState, useEffect } from "react";

import { Button } from "@mui/material";

import { getCurrentUser } from "../services/authServices";

import { logout } from "../services/authServices";
import { DataGrid } from "@mui/x-data-grid";
import { getUserBooks } from "../services/studentsBooksServices";
import CircularProgress from "@mui/material/CircularProgress";
import PasswordChange from "../components/studentPage/PasswordChangeBox";

const columns = [
  { field: "bookID", headerName: "ID", width: 110 },
  { field: "title", headerName: "Knygos pavadinimas", width: 430 },
  { field: "author", headerName: "Autorius", width: 230 },
  { field: "dateTaken", headerName: "Paėmimo data", width: 230 },
  { field: "returnDate", headerName: "Iki kada gražinti", width: 230 }
];



export default function StudentsPage() {
  //const [usersList, setUsersList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({});
  const [studentBooks, setStudentBooks] = useState([]);
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  useEffect(() => {
    getRole();
    getStudentBooks();
  }, []);

  async function getRole() {
    try {
      const user = await getCurrentUser();
      setUser(user);
      console.log(user);
      if (!user) window.location = "/unauthorized";
      if (user.role !== "STUDENT" && user.role !== "ADMIN") {
        window.location = "/unauthorized";
      }
    } catch (error) {
      window.location = "/unauthorized";
    }
  }

  async function getStudentBooks() {
    setIsLoading(true);
    try {
      const {data} = await getUserBooks();
      console.log(data);

      setStudentBooks(data.booksArr);

    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }

  const handleShowPasswordChange = () => {
    showPasswordChange ? setShowPasswordChange(false) : setShowPasswordChange(true);
  };

  return (
    <div>
      <Button
        variant="contained"
        className="logoutStudent-btn"
        onClick={logout}
      >
        Atsijungti
      </Button>
      <Button
        variant="contained"
        className="pswChangeStudent-btn"
        onClick={handleShowPasswordChange}
      >
        Slaptažodžio keitimas
      </Button>
      <h1 className="centerHeader">Studento puslapis</h1>
      <h2 className="centerHeader">{`${user.firstName} ${user.lastName}`}</h2>
      
      {isLoading ? 
        <CircularProgress sx={{ display: "flex", margin: "150px auto" }} />
       : (<div style={{ height: 700, width: "70%", margin: "0px auto" }}>
        <DataGrid
          rows={studentBooks}
          columns={columns}
          pageSize={15}
          rowsPerPageOptions={[5]}
          getRowId={(row) => row.bookID}
        />
        </div>)}
        {showPasswordChange ? <PasswordChange handleChange={handleShowPasswordChange}/> : null}
    </div>
  );
}
