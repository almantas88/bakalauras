import React, { useState, useContext, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { MessageContext } from "../../context/messageContext";
import { getOneUser, updateOneUser } from "../../services/userServices";
import CircularProgress from "@mui/material/CircularProgress";
import { UsersContext } from "../../context/usersContext";
import { GradesContext } from "../../context/gradesContext";
import MenuItem from "@mui/material/MenuItem";


export default function UpdateUserForm(props) {
  const messageContext =
    useContext(MessageContext);

    
    const gradesContext =
    useContext(GradesContext);

    const usersContext =
    useContext(UsersContext);

  const [isLoading, setIsLoading] = useState(false);

  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    cardID: "",
    grade: "",
    email: "",
    password: "",
    passwordCheck: "",
    initialCardID: props.userInfo.cardID
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    cardID: "",
    grade: "",
    email: "",
    password: "",
    passwordCheck: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    //setErrors({ ...errors, [name]: "" });
    setValues({
      ...values,
      [name]: value,
    });
    validate(name, value);
    checkIfAllFilled()
  };

  const validate = (name, value) => {
    let temp = {};
    if (name === "email") {
      temp.email = /$|.+@.+..+/.test(value) ? "" : "El. paštas yra netinkamas";
      setErrors({ ...errors, [name]: temp.email });
    } else {
      temp.name = value ? "" : "Šis laukas yra privalomas";
      setErrors({ ...errors, [name]: temp.name });
    }
  };

  const checkIfAllFilled = () => {
    console.log(values.cardID !== "" && values.firstName !== "" && values.lastName !== "");
    if(values.cardID !== "" && values.firstName !== "" && values.lastName !== "") {return false} else {return true}
  }

  const handleChange = (event) => {
    setValues({
      ...values,
      grade: event.target.value,
    });
  };

  const fetchUser = async (cardID) => {
    try {
      const { data } = await getOneUser({cardID});
      setValues({
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        cardID: data.user.cardID,
        grade: data.user.grade,
        email: data.user.email,
        password: "",
        passwordCheck: "",
        initialCardID: props.userInfo.cardID
      });
    } catch (error) {
      messageContext.handleMessageShow(error.response.data.msg, "error");
    }
  };

  useEffect(() => {
    console.log(window.localStorage.getItem("token"));
    setIsLoading(true);
    try {
      fetchUser(props.userInfo.cardID);
    } catch (error) {
      messageContext.handleMessageShow(error.response.data.msg, "error");
    }
    setIsLoading(false);
  }, []);


  // darbai ateičiai : 
  // reikia padaryti update route back ende ir čia išsiuntimą į jį
  const handleSubmit = async () => {
    try {
      const { data } = await updateOneUser(values);    
      usersContext.handleUpdateUserContext(values.initialCardID, values);
      messageContext.handleMessageShow("Vartotojas atnaujintas!", "success");
      setValues({
        ...values,
        initialCardID: values.cardID,
      });
    } catch (error) {
      console.log(error.response.data);
      messageContext.handleMessageShow(error.response.data.msg, "error");
    }
  };

  return (
    <div className="addUserContainer">
      <Container
        sx={{
          width: 500,
          height: 650,
          marginTop: "120px",
          backgroundColor: "#F5F5F5",
          borderRadius: "1%",
        }}
      >
        {isLoading ? (
          <CircularProgress sx={{ display: "flex", margin: "auto", padding: 15 }} />
        ) : (
          <Grid container spacing={2} justify="center">
            <Grid item xs={10}>
              <h2>Atnaujinti vartotoją</h2>
            </Grid>
            <Grid item xs={2} onClick={props.handleChange}>
              <CloseIcon sx={{ fontSize: 40, color: "#252525", padding: 1, '&:hover': {
      color: "#69717d",
    } }} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="cardID"
                value={values.cardID}
                onChange={handleInputChange}
                fullWidth
                required
                error={Boolean(errors?.cardID)}
              helperText={errors?.cardID}
                autoComplete="disabled"
                label="Kortelės id"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="firstName"
                value={values.firstName}
                onChange={handleInputChange}
                fullWidth
                required
                autoComplete="disabled"
                label="Vardas"
                variant="outlined"
                error={Boolean(errors?.firstName)}
                helperText={errors?.firstName}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="lastName"
                value={values.lastName}
                onChange={handleInputChange}
                fullWidth
                required
                autoComplete="disabled"
                label="Pavardė"
                variant="outlined"
                error={Boolean(errors?.lastName)}
              helperText={errors?.lastName}
              />
            </Grid>
            <Grid item xs={12}>
            <TextField
            fullWidth
              id="outlined-select-currency"
              select
              inputProps={{MenuProps: {disableScrollLock: true}}}
              label="Klasė"
              value={values.grade}
              onChange={handleChange}
            >
              {gradesContext.gradesList.map((option) => (
                <MenuItem key={option.grade} value={option.grade}>
                  {option.grade}
                </MenuItem>
              ))}
            </TextField>
            </Grid>
            <Grid item xs={12}>
              <h3>Vaiko prisijungimo duomenys</h3>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                value={values.email}
                onChange={handleInputChange}
                fullWidth
                required
                autoComplete="disabled"
                label="El. paštas"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="password"
                value={values.password}
                onChange={handleInputChange}
                fullWidth
                required
                type="password"
                autoComplete="disabled"
                label="Slaptažodis"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="passwordCheck"
                value={values.passwordCheck}
                onChange={handleInputChange}
                fullWidth
                required
                autoComplete="disabled"
                type="password"
                label="Pakartotas slaptažodis"
                variant="outlined"
              />
            </Grid>
            <Grid align="center" item xs={12}>
              <Button
                onClick={handleSubmit}
                size="large"
                variant="contained"
                sx={{ padding: 1, width: "50%", margin: "20px 0" }}
              >
                Redaguoti
              </Button>
            </Grid>
          </Grid>
        )}
      </Container>
    </div>
  );
}
