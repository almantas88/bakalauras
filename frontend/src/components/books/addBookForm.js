import React, { useState, useContext } from "react";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { createNewBook } from "../../services/bookServices";
import { MessageContext } from "../../context/messageContext";

export default function AddBookForm(props) {
  const messageContext = useContext(MessageContext);

  const [values, setValues] = useState({
    bookID: "",
    title: "",
    author: "",
    description: "",
  });

  const [errors, setErrors] = useState({
    bookID: "",
    title: "",
    author: "",
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setValues({
      ...values,
      [name]: value,
    });

    validate(name, value);
    checkIfAllFilled()
  };

  const checkIfAllFilled = () => {
    console.log(values.title !== "" && values.author !== "" && values.bookID !== "");
    if(values.title !== "" && values.author !== "" && values.bookID !== "") {return false} else {return true}
  }

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

  const handleSubmit = async () => {
    try {
      const { data } = await createNewBook(values);
      messageContext.handleMessageShow("Naujas knyga sukurta!", "success");
      try {
        props.setBooksList([
          {
            bookID: values.bookID,
            title: values.title,
            author: values.author,
            description: values.description,
          },
          ...props.booksList,
        ]);
      } catch (error) {
        messageContext.handleMessageShow("Ups... Kažkas nutiko negerai...","error");
      }
    } catch (error) {
      messageContext.handleMessageShow(error.response.data.msg,"error");
    }
  };

  return (
    <div className="addUserContainer">
      <Container
        sx={{
          width: 500,
          marginTop: "110px",
          backgroundColor: "#F5F5F5",
          borderRadius: "1%",
        }}
      >
        <Grid container spacing={2} justify="center">
          <Grid item xs={10}>
            <h2>Pridėti knygą</h2>
          </Grid>
          <Grid item xs={2} onClick={props.handleChange}>
            <CloseIcon sx={{ fontSize: 40, color: "#252525", padding: 1, '&:hover': {
      color: "#69717d",
    } }} />
          </Grid>
          <Grid item xs={12}>
            <h3>Knygos duomenys</h3>
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="bookID"
              value={values.bookID}
              onChange={handleInputChange}
              fullWidth
              required
              autoComplete="disabled"
              label="Knygos id"
              variant="outlined"
              error={Boolean(errors?.bookID)}
              helperText={errors?.bookID}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="title"
              value={values.title}
              onChange={handleInputChange}
              fullWidth
              required
              autoComplete="disabled"
              label="Knygos pavadinimas"
              variant="outlined"
              error={Boolean(errors?.title)}
              helperText={errors?.title}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="author"
              value={values.author}
              onChange={handleInputChange}
              fullWidth
              required
              autoComplete="disabled"
              label="Autorius"
              variant="outlined"
              error={Boolean(errors?.author)}
              helperText={errors?.author}
            />
          </Grid>
          <Grid item xs={12}>
            <h3>Knygos aprašymas</h3>
          </Grid>
          <Grid item xs={12}>
            <TextField
              minRows={4}
              multiline
              maxRows={4}
              name="description"
              value={values.description}
              onChange={handleInputChange}
              fullWidth
              label="Aprašymas"
              variant="outlined"
            />
          </Grid>
          <Grid align="center" item xs={12}>
            <Button
              onClick={handleSubmit}
              size="large"
              variant="contained"
              sx={{ padding: 1, width: "50%", margin: "20px 0" }}
              disabled={checkIfAllFilled()}
            >
              Pridėti
            </Button>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
