import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { ReactComponent as Logo } from "../assets/nav-vera-icon.svg";
import { ReactComponent as VoiceIcon } from "../assets/voice-icon.svg";
import { useNavigate } from "react-router";
import "./MobileNavbar.scss";

const drawerWidth = 240;
const navItems = ["Services", "Immigration", "Family Law", "Process", "FAQs", "Contact Us", "Blog"];

function MobileNavbar(props) {
  const { window } = props;
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography
        variant="h6"
        onClick={() => {
          navigate("/");
          document.documentElement.scrollTop = 0;
        }}
        sx={{ my: 2 }}
      >
        <Logo />
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          // eslint-disable-next-line
          <a
            className="nav-link-items"
            onClick={() => navigate("/")}
            rel="noreferrer"
            href={
              item === "Services"
                ? "#servicesMob"
                : item === "Immigration"
                  ? "https://veralegal.uk/immigration"
                  : item === "Family Law"
                    ? "https://veralegal.uk/family-law"
                    : item === "Process"
                      ? "#process"
                      : item === "FAQs"
                        ? "#faqs"
                        : item === "Contact Us"
                          ? "#contact"
                          : item === "Blog"
                            ? "/blogs"
                            : ""
            }
            key={item}
          >
            <ListItem key={item} disablePadding>
              <ListItemButton sx={{ textAlign: "center" }}>
                <ListItemText primary={item} />
              </ListItemButton>
            </ListItem>
          </a>
        ))}
      </List>
      <Box display="flex" flexDirection="column" mt={3} m={2}>
        <Button
          variant="contained"
          className="hero-btn-getstarted"
          color="primary"
          size="large"
          onClick={() => navigate("/onboarding/0")}
          style={{ marginBottom: "10px" }}
        >
          Get Started
        </Button>
        <Button
          variant="contained"
          className="hero-btn-getstarted"
          color="primary"
          size="large"
          onClick={() => navigate("/onboarding/0?selectedOption=voice-memo")}
          style={{ marginBottom: "10px" }}
        >
          Tell Us
          <VoiceIcon style={{ marginLeft: "10px" }} />
        </Button>
        <Button
          variant="outlined"
          className="hero-btn-login"
          color="primary"
          onClick={() => navigate("/login")}
          size="large"
        >
          Log in
        </Button>
      </Box>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar component="nav" className="mobile-Nav">
        <Toolbar className="mob-nav-toolbar">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { md: "none" } }}
          >
            <MenuIcon style={{ color: "black" }} />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "block", md: "block" } }}
            onClick={() => {
              navigate("/");
              document.documentElement.scrollTop = 0;
            }}
          >
            <Logo />
          </Typography>
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            {navItems.map((item) => (
              <Button key={item} sx={{ color: "#fff" }}>
                {item}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
            zIndex: "11111111",
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}

MobileNavbar.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default MobileNavbar;
