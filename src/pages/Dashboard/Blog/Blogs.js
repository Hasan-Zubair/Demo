import React, { useState, useEffect } from "react";
import Navbar from "../../../components/Navbar";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Divider,
  Grid,
  InputAdornment,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Badge from "../../../assets/blog/Badge.png";
import "./Blogs.scss";
import { Search } from "@mui/icons-material";
// import { BlogsCardData } from "../../../common/BlogCardsData";
import ContactForm from "../../../components/ContactForm";
import Footer from "../../../components/Footer";
import { useNavigate } from "react-router";
import axios from "axios";
import myAPI from "../../../utils/axios";
import moment from "moment";
import MobileNavbar from "../../../components/MobileNavbar";

const Blogs = () => {
  const [searchValue, setSearchValue] = useState("");
  const [blogsCardData, setBlogsCardData] = useState([]);
  console.log("TCL: Blogs -> [blogsCardData", blogsCardData);
  const [searchBlogsCardData, setSearchBlogsCardData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [page, setPage] = useState(1);
  const [blogsCount, setBlogsCount] = useState(0);
  const [countLimit, setCountLimit] = useState(0);
  const [showLoadMoreButton, setShowLoadMoreButton] = useState(true);

  const navigate = useNavigate();

  function truncateText(text, charLimit) {
    if (text && text.length <= charLimit) {
      return text;
    }
    return text?.slice(0, charLimit) + "...";
  }

  function stripHtmlTags(html) {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = html;
    return tempElement.textContent || tempElement.innerText || "";
  }

  function debounce(func, delay) {
    let timeoutId;

    return function (...args) {
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }

  const getBlogPosts = async (params) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_API_URL}api/blog/post/`,
        { params }
      );
      let searchedResponse = [];
      if (params?.search && params?.page === 1) {
        searchedResponse = response.data.results;
      } else if (params?.search === "" && params?.page === 1) {
        searchedResponse = response.data.results;
      } else {
        searchedResponse = [...searchBlogsCardData, ...response.data.results];
      }
      setSearchBlogsCardData(searchedResponse);
      setBlogsCardData(searchedResponse);
      setBlogsCount(response?.data?.count);
      setCountLimit(response?.data?.limit);

      if (response.data.next === null) {
        setShowLoadMoreButton(false);
      } else {
        setShowLoadMoreButton(true);
      }
    } catch (error) {
      // Handle the error
    }
  };

  let delayTime = 500;

  useEffect(() => {
    debounce(getBlogPosts({ page, page_size: 6 }), delayTime);
  }, []);
  const getDate = (datetime) => {
    const dateObj = new Date(datetime);

    // Get the date components
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Month is zero-based
    const day = String(dateObj.getDate()).padStart(2, "0");
    return { year, month, day };
  };
  const mobile = useMediaQuery("(max-width: 600px)");
  return (
    <div id="blogBody">
      {mobile ? <MobileNavbar /> : <Navbar />}
      <Container>
        <Box
          mt={16}
          mb={8}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h2"
            color="primary"
            style={{
              fontWeight: "500",
              marginBottom: "2rem",
              marginTop: "4rem",
              textAlign: "center",
            }}
          >
            Resources and insights
          </Typography>
          <Typography
            variant="h5"
            color="primary"
            style={{ textAlign: "center" }}
          >
            The latest industry news, interviews, technologies, and resources.
          </Typography>
          <TextField
            style={{
              display: "inline-flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "2rem",
              backgroundColor: "white",
            }}
            id="application-search"
            placeholder="Search"
            value={searchValue}
            onChange={({ target: { value } }) => {
              setPage(1);
              setSearchValue(value);
              debounce(
                getBlogPosts({ page: 1, page_size: 6, search: value }),
                delayTime
              );
            }}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Container>

      <Container>
        <Grid container justifyContent="equally-spaced">
          {(searchValue ? searchBlogsCardData : blogsCardData).map(
            (data, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={index}
                mb={4}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Card
                  sx={{
                    maxWidth: 345,
                    height: 450,
                    width:345,
                    padding: 2,
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    const formattedTitle = encodeURIComponent(
                      data?.title.replace(/[^a-zA-Z0-9]/g, "-")
                    );
                    navigate(
                      `/blog/${getDate(data?.created_at)?.year}/${
                        getDate(data?.created_at)?.month
                      }/${getDate(data?.created_at)?.day}/${formattedTitle}`,
                      { state: data }
                    );
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={data.image}
                    alt="green iguana"
                    style={{ marginBottom: "10px" }}
                  />

                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    style={{ marginBottom: "10px" }}
                  >
                    {truncateText(data?.title, 64)}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    style={{ paddingBottom: "5px" }}
                  >
                    {/* subtitle field */}
                    {truncateText(stripHtmlTags(data.content), 160)}
                  </Typography>
                  <div
                    style={{
                      marginTop: "auto",
                      paddingTop: "10px",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {moment(data.created_at).format("YYYY-MM-DD")}
                    </Typography>
                  </div>
                </Card>
              </Grid>
            )
          )}
        </Grid>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          {showLoadMoreButton && (
            <Button
              onClick={() => {
                setPage((prev) => prev + 1);
                debounce(
                  getBlogPosts({ page: page + 1, page_size: 6 }),
                  delayTime
                );
              }}
            >
              Load More
            </Button>
          )}
        </div>
      </Container>
      <ContactForm />
      <Footer />
    </div>
  );
};

export default Blogs;
