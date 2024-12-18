import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Input,
  Divider,
  useMediaQuery,
} from "@mui/material";

import {
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import Header from "../../../components/Header";
import blogHeaderImage from "../../../assets/blog/blogHeaderImage.png";
import blogLinkedInIcon from "../../../assets/blog/blogLinkedIn.png";
import blogFacebook from "../../../assets/blog/blogFacebook.png";
import blogCopyLink from "../../../assets/blog/blogCopyLink.png";
import copyIcon from "../../../assets/blog/copyIcon.png";
import tickIcon from "../../../assets/blog/tickIcon.png";

// components
// import Filters from "./components/Filters";
import { Box } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import CssBaseline from "@mui/material/CssBaseline";
import VeraAiBot from "../../../components/VeraAIBot";
import AddNewTaskModal from "./../components/AddNewTaskModal";
import ContactForm from "../../../components/ContactForm/index";
import Footer from "../../../components/Footer/index";
import axios from "axios";
// style
import "./Detail.scss";
import Navbar from "../../../components/Navbar";
import MobileNavbar from "../../../components/MobileNavbar";
import { Helmet } from "react-helmet-async";
import { CoPresentOutlined } from "@mui/icons-material";

const BlogDetail = () => {
  const navigate = useNavigate();
  const { blogSlug } = useParams();
  // const blogSlug = localStorage.getItem("blogSearch")
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const drawerWidth = 240;
  const [loading, setLoading] = React.useState(false);
  const [copied, setCopied] = useState(false);
  const [blogCopyIcon, setBlogCopyIcon] = useState(false);
  const [blogData, setBlogData] = useState("");

  const location = useLocation();
  // const blogData = location.state;

  

  const copyToClipboard = () => {
    const dynamicLink = `${window.location.origin}${location.pathname}`;
    const textarea = document.createElement("textarea");
    textarea.value = dynamicLink;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    setCopied(true);
    setBlogCopyIcon(true);

    setTimeout(() => {
      setBlogCopyIcon(false);
    }, 1000);
  };

  
  const mobile = useMediaQuery("(max-width: 600px)");

  const getBlogPosts = async () => {
    console.log("uu");
    try {
      const response = await axios.get(
        `${
          process.env.REACT_APP_BASE_API_URL
        }api/blog/post/?search=${blogSlug.replace(/-/g, " ")}`
      );
      if (response.data.results.length) {
        setBlogData(response.data.results[0]);
      }
    } catch (error) {
      // Handle the error
    }
  };

  useEffect(() => {
    getBlogPosts();
    console.log('blogdata', blogData)
    window.scrollTo({ top: 0 });
  }, []);



  return (
    <>
      {mobile ? <MobileNavbar /> : <Navbar />}

      {!loading ? (
        <>
          {/* <Helmet prioritizeSeoTags>
            <title>{blogData?.title}</title>
            <meta name="description" content={blogData?.content} />
            <meta
              property="og:image"
              content={blogData?.image ? blogData?.image : blogHeaderImage}
            />
          </Helmet> */}

<Helmet>
  <title>{blogData?.title}</title>
  <meta name="description" content={blogData?.description} />
  <meta property="og:title" content={blogData?.title} />
  <meta property="og:description" content={blogData?.description} />
  <meta property="og:image" content={`${blogData?.image || blogHeaderImage}`} />
  <meta property="og:url" content={`${window.location.pathname+window.location.search}`} />
  <meta property="og:type" content="article" />
  <meta property="article:published_time" content={moment(blogData?.created_at).toISOString()} />
</Helmet>


          <Container sx={{ marginTop: "6rem" }}>
            <Typography mb={2} className="date">
              Published {moment(blogData?.created_at).format("DD MMM YYYY")}
            </Typography>
            <Typography
              variant="h1"
              className="center"
              mb={2}
              style={{
                fontWeight: "600",
                textAlign: "center",
                fontSize: "50px",
              }}
            >
              {blogData?.title}
            </Typography>

            <Card style={{ marginBottom: "20px" }}>
              <CardMedia
                component="img"
                alt={blogData?.title}
                height="300"
                image={blogData?.image ? blogData?.image : blogHeaderImage}
                title={blogData?.title}
              />
            </Card>
            <Container>
              <Typography
                variant="body1"
                component="div"
                style={{ fontSize: "14pt" }}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: blogData?.content?.replace(
                      /<img/g,
                      '<img style="max-width:100%"'
                    ),
                  }}
                />
              </Typography>
            </Container>
            <Divider
              sx={{
                borderColor: "F9FAFB",
                borderWidth: "1px",
                marginBottom: "10px",
              }}
            />

            <div className="linkIcons">
              <Paper
                variant="outlined"
                square={false}
                elevation={1}
                sx={{
                  height: "2.5rem",
                  maxWidth: "8rem",
                  padding: "1em",
                  margin: "0.1rem",
                  borderRadius: "0.5rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontWeight: "600",
                  fontFamily: "Inter",
                  fontSize: "small",
                }}
              >
                <div
                  onClick={copyToClipboard}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ paddingRight: "5px" }}>
                    <img
                      src={blogCopyIcon ? tickIcon : copyIcon}
                      alt="copyLinkIcon"
                    />
                  </div>
                  {blogCopyIcon ? "Copied" : "Copy link"}
                </div>
              </Paper>
              <Paper
                variant="outlined"
                square={false}
                elevation={1}
                sx={{
                  height: "2.5rem",
                  maxWidth: "2.5rem",
                  padding: "1em",
                  margin: "0.1rem",
                  borderRadius: "0.5rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <a
                  href="https://web.facebook.com/veralegaluk"
                  target="_blank"
                  rel="noreferrer"
                  style={{ cursor: "pointer" }}
                >
                  <img src={blogFacebook} alt="facebookIcon" />
                </a>
              </Paper>

              <Paper
                variant="outlined"
                square={false}
                elevation={1}
                sx={{
                  height: "2.5rem",
                  maxWidth: "2.5rem",
                  padding: "1em",
                  borderRadius: "0.5rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <a
                  href="https://www.linkedin.com/company/veralegal"
                  target="_blank"
                  rel="noreferrer"
                  style={{ cursor: "pointer" }}
                >
                  <img src={blogLinkedInIcon} alt="linkedInIcon" />
                </a>
              </Paper>
            </div>
          </Container>

          <Container>
            <ContactForm />
          </Container>
          <Footer />
        </>
      ) : (
        "Loading"
      )}
    </>
  );
};

export default BlogDetail;
