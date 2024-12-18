import React, { useState } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { Link, Popover } from "@mui/material";
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import "./Navbar.scss";
import { ReactComponent as Logo } from "../assets/nav-vera-icon.svg";
import { ReactComponent as VoiceIcon } from "../assets/voice-icon.svg";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import { useNavigate } from "react-router";
const Navbar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const location = window.location.href;
  const blogLocation =
    location === "https://app.veralegal.uk/header/public-header/"
      ? "https://app.veralegal.uk"
      : "";
  const navigationURL = () => {
    if (blogLocation) {
      window.open(blogLocation, "_blank");
    } else {
      navigate("/");
      window.scrollTo(0, 0);
    }
  };

  return (
    <Box className="nav-wrapper">
      <Container className="nav-container custom-container">
        <Box className="logo">
          <Logo
            onClick={navigationURL}
            style={{ cursor: "pointer" }}
          />
        </Box>
        <ul>
          <li>
            <Link
              sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              onClick={(event) => setAnchorEl(event.currentTarget)}
              className="headerText"
            // onClick={() => !blogLocation && navigate("/")}
            // target={blogLocation ? "_blank" : ""}
            // rel="noreferrer"
            // href={
            //   blogLocation ? `${blogLocation}/` + "#services" : "#services"
            // }
            >
              Services
              <KeyboardArrowDownIcon fontSize="small" />
            </Link>
          </li>
          <li>
            <a
              className="headerText"
              onClick={() => !blogLocation && navigate("/")}
              target={blogLocation ? "_blank" : ""}
              href={blogLocation ? `${blogLocation}/` + "#process" : "#process"}
            >
              Process
            </a>
          </li>
          <li>
            <a
              className="headerText"
              onClick={() => !blogLocation && navigate("/")}
              target={blogLocation ? "_blank" : ""}
              href={blogLocation ? `${blogLocation}/` + "#faqs" : "#faqs"}
            >
              FAQs
            </a>
          </li>
          <li>
            <a
              className="headerText"
              onClick={() => !blogLocation && navigate("/")}
              target={blogLocation ? "_blank" : ""}
              href={blogLocation ? `${blogLocation}/` + "#contact" : "#contact"}
            >
              Contact Us
            </a>
          </li>
          <li>
            <a
              className="headerText"
              href={"/blogs"}
              //href="https://blog.veralegal.uk/"
              rel="noreferrer"
            >
              Blog
            </a>
          </li>
        </ul>

        <Box className="btns">
          <Typography
            variant="body1"
            className="login-btn"
            onClick={() => navigate("/login")}
            color="initial"
          >
            Log in
          </Typography>

          <Button
            className="started-btn"
            onClick={() => {
              localStorage.clear();
              navigate("/onboarding/0");
            }}
            variant="contained"
            color="primary"
          >
            Get Started
          </Button>

          <Button
            className="voice-btn"
            onClick={() => navigate("/onboarding/0?selectedOption=voice-memo")}
            variant="contained"
            color="primary"
          >
            Tell Us
            <VoiceIcon />
          </Button>
        </Box>
      </Container>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        disableScrollLock
        sx={{
          zIndex: 9999999999999,
        }}
        PaperProps={{
          sx: {
            width: 200,
            mt: 2,
          }
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <List
          sx={{ width: '100%', maxWidth: 360, }}
        >
          <ListItemButton href="https://veralegal.uk/immigration">
            <ListItemText sx={{ width: '100%' }} primary="Immigration" />
            <ListItemIcon sx={{ minWidth: 'unset' }}>
              <KeyboardArrowRightIcon />
            </ListItemIcon>
          </ListItemButton>
          <ListItemButton href="https://veralegal.uk/family-law">
            <ListItemText sx={{ width: '100%' }} primary="Family Law" />
            <ListItemIcon sx={{ minWidth: 'unset' }}>
              <KeyboardArrowRightIcon />
            </ListItemIcon>
          </ListItemButton>
        </List>
      </Popover>
    </Box>
  );
};

export default Navbar;
