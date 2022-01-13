import React, { useState, useEffect, useRef, useContext } from "react";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SearchIcon from "@mui/icons-material/Search";
import { BooksContext } from "../../context/booksContext";
import { BooksCartContext } from "../../context/booksCartContext";
import BooksTable from "./booksCheckInTable";
import BooksCart from "./booksCartTable";
import SendIcon from "@mui/icons-material/Send";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function BookSearch(props) {
  const booksContext = useContext(BooksContext);
  const booksCartContext = useContext(BooksCartContext);

  const [allRowsForShowing, setAllRowsForShowing] = useState(props.booksList);

  const [searchTextBookId, setSearchTextBookId] = useState("");
  const [searchTextTitle, setSearchTextTitle] = useState("");
  const [searchTextAuthor, setSearchTextAuthor] = useState("");

  const childRef = useRef();

  const handleSearchButton = () => {
    var filteredRows = booksContext.allBooksList;

    filteredRows = filteredRows.filter((row) => {
      return row.bookID.toLowerCase().includes(searchTextTitle.toLowerCase());
    });

    filteredRows = filteredRows.filter((row) => {
      return row.author.toLowerCase().includes(searchTextAuthor.toLowerCase());
    });

    filteredRows = filteredRows.filter((row) => {
      return row.title.toLowerCase().includes(searchTextBookId.toLowerCase());
    });

    console.log(filteredRows);
    setAllRowsForShowing(filteredRows);
    childRef.current.setToFirstPage();
  };

  const handleClearButton = () => {
    setSearchTextBookId("");
    setSearchTextAuthor("");
    setSearchTextTitle("");
    setAllRowsForShowing(booksContext.allBooksList);
    childRef.current.setToFirstPage();
  };

  const handleChangeBookID = (text) => {
    setSearchTextBookId(text);
  };

  const handleChangeAuthor = (text) => {
    setSearchTextAuthor(text);
  };

  const handleChangeTitle = (text) => {
    setSearchTextTitle(text);
  };

  const handleSelectOtherUser = () => {
    booksCartContext.setCurrentUser({});
  };

  useEffect(() => {
    booksContext.setAllBooksList(booksContext.allBooksList);
    setAllRowsForShowing(booksContext.allBooksList);
  }, [booksContext.allBooksList]);

  return (
    <>
      <Container sx={{ overflow: "hidden", width: "95%" }}>
        <h3>Paieška:</h3>
        <Grid container spacing={1}>
          <Grid item xs={2.5}>
            <TextField
              fullWidth
              value={searchTextTitle}
              onChange={(event) => {
                handleChangeTitle(event.target.value);
              }}
              label="Knygos ID"
              variant="outlined"
              autoComplete="disabled"
            />
          </Grid>
          <Grid item xs={2.5}>
            <TextField
              fullWidth
              value={searchTextBookId}
              onChange={(event) => {
                handleChangeBookID(event.target.value);
              }}
              label="Pavadinimas"
              variant="outlined"
              autoComplete="disabled"
            />
          </Grid>
          <Grid item xs={2.5}>
            <TextField
              fullWidth
              value={searchTextAuthor}
              onChange={(event) => {
                handleChangeAuthor(event.target.value);
              }}
              label="Autorius"
              variant="outlined"
              autoComplete="disabled"
            />
          </Grid>

          <Grid item xs={2.5}>
            <Button
              sx={{
                height: "100%",
              }}
              fullWidth
              autoComplete="disabled"
              variant="contained"
              size="large"
              startIcon={<SearchIcon />}
              onClick={() => {
                handleSearchButton();
              }}
            >
              Ieškoti
            </Button>
          </Grid>

          <Grid item xs={2}>
            <Button
              sx={{
                height: "100%",
              }}
              variant="contained"
              size="large"
              fullWidth
              startIcon={<DeleteOutlineIcon />}
              onClick={() => {
                handleClearButton();
              }}
            >
              Išvalyti
            </Button>
          </Grid>
        </Grid>
      </Container>


      <Grid container spacing={2} sx={{margin: "10px auto",width: "95%"}}>
            <h3>Vartotojo knygos:</h3>
            <BooksTable
              ref={childRef}
              allRowsForShowing={allRowsForShowing}
              handleShowUserInfo={props.handleChange}
              isLoading={props.isLoading}
            />
                </Grid>


        <Grid container spacing={2} sx={{margin: "10px auto",width: "97%"}}>
          <Grid
            xs={6}
            sx={{ margin: "20px 0px" }}
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
          >
            <Button
              size="large"
              startIcon={<ArrowBackIcon />}
              variant="contained"
              onClick={() => { handleSelectOtherUser()}}
            >
              Pasirinkti kitą vartotoją
            </Button>
          </Grid>
          <Grid
            xs={6}
            sx={{ margin: "20px 0px" }}
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
          >
            <Button endIcon={<SendIcon />} size="large" variant="contained">
              Atnaujinti vartotojo knygas
            </Button>
          </Grid>
        </Grid>

    </>
  );
}
