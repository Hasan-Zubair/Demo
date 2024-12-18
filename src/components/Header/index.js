import React, { useState } from "react";
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Box,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import moment from "moment";

// Assets
import { ReactComponent as Logo } from "../../assets/nav-vera-icon.svg";
import { ReactComponent as Bell } from "../../assets/header/bell.svg";
import helpIcon from "../../assets/icons/Help_icon.svg";

// style
import styles from "./header.module.scss";
import myAPI from "../../utils/axios";
import axios from "axios";

// mark as read icon
import CloseIcon from "@mui/icons-material/Close";
import HelpCarousel from "../HelpCarousel/HelpCarousel";
import MessageModal from "../../common/MessageModal";
import Login from "../../pages/Login";

const NotificationModal = ({
  open,
  notifications,
  onClose,
  showLoadMoreButton,
  handleMarkAsRead,
  onLoadMoreNotifications,
}) => {
  return (
    <Box
      style={{
        position: "absolute",
        top: "0",
        right: "0",
        width: "400px",
        height: "100vh",
        backgroundColor: "#fff",
        zIndex: "9999",
        boxShadow: "0 0 10px rgba(0,0,0,0.2)",
        transition: "all 0.3s ease-in-out",
        transform: open ? "translateX(0)" : "translateX(100%)",
        //     give some padding
        padding: "20px",
        display: open ? "block" : "none",
        //     scroll
        overflowY: "scroll",
      }}
    >
      {/*  Notification List here  */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h3>Notifications</h3>
        <IconButton onClick={() => onClose()}>
          <CloseIcon />
        </IconButton>
      </div>
      <Divider />
      <div
        style={{
          marginTop: "20px",
        }}
      >
        {notifications.map((notification, index) => (
          // 1 notification will have a title, category, created_at, and 1 mark as read button
          <>
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <div>
                <h4>{notification.title}</h4>
                <p>
                  {moment(notification.created_at).format("MMM DD, Y - h:mm A")}
                </p>
              </div>
              <IconButton onClick={() => handleMarkAsRead(notification.id)}>
                <CloseIcon />
              </IconButton>
            </div>
          </>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        {showLoadMoreButton && (
          <Button onClick={onLoadMoreNotifications}>Load More</Button>
        )}
      </div>
    </Box>
  );
};

const Header = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const user = JSON.parse(localStorage.getItem("LoggedInObj"));
  const open = Boolean(anchorEl);
  const [opened, setOpened] = useState(null);
  const [isHelpCarouselOpen, setIsHelpCarouselOpen] = useState(false);
  const [isErrorModal, setIsErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [notifications, setNotifications] = React.useState([]);
  const [notificationModal, setNotificationModal] = React.useState(false);
  const [count, setCount] = React.useState(0);
  const [countLimit, setCountLimit] = React.useState(0);
  const [totalNotification, setTotalNotification] = React.useState(0);
  const [socket, setSocket] = React.useState(null);
  const [image, setImage] = React.useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [page, setPage] = React.useState(1);
  const [notificationsCount, setNotificationsCount] = React.useState(0);
  const [showLoadMoreButton, setShowLoadMoreButton] = useState(true);
  const currentUser = localStorage.getItem("LoggedInObj")
    ? JSON.parse(localStorage.getItem("LoggedInObj"))
    : null;
  const getNotifications = async () => {
    await myAPI.get(`api/auth/notification/?is_read=false`).then((response) => {
      setNotificationsCount(response.data.count);
      setNotifications(response.data.results);
      setCount(response.data.count);
      setCountLimit(response.data.limit);
      setTotalNotification(response.data.count);
      if (response.data.next === null) {
        setShowLoadMoreButton(false);
      }
    });
  };

  const loadMoreNotifications = async () => {
    if (page && countLimit < notificationsCount) {
      try {
        const nextPage = page + 1;
        const response = await myAPI.get(
          `api/auth/notification/?is_read=false&page=${nextPage}`
        );

        if (response.data.results.length > 0) {
          setNotifications([...notifications, ...response.data.results]);
          setCountLimit(response.data.limit);
          setPage(nextPage);

          // Check if the 'next' property is null and hide the button
          if (response.data.next === null) {
            console.log(
              "TCL: loadMoreNotifications -> response.data.next",
              response.data.next
            );
            setShowLoadMoreButton(false);
          }
        } else {
          setShowLoadMoreButton(false); // Hide the "Load More" button when there are no more notifications
        }
      } catch (error) {
        console.error("API Error:", error);
      }
    }
  };

  const getUserDetails = async () => {
    await axios
      .get(
        `${process.env.REACT_APP_BASE_API_URL}api/auth/user/${
          JSON.parse(localStorage.getItem("LoggedInObj")).id
        }/`,
        {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setImage(res.data.image);
      })
      .catch((err) => {
        console.log("Header -> ", err.response.data);
        if (
          err.response.data === "Token is invalid or Expired" ||
          err.code === "user_inactive" ||
          err.response.data.code === "user_inactive"
        ) {
          logout();
          setErrorMessage(
            err.response.data.code === "user_inactive" ||
              err.code === "user_inactive"
              ? "User is inactive."
              : err.response.data === "Token is invalid or Expired"
              ? "Token is invalid or expired."
              : "An error occurred. Please try again later."
          );
          setIsErrorModal(true);
        }
      });
  };

  React.useEffect(() => {
    getNotifications()
      .then((r) => console.log(r))
      .catch((error) => {
        console.error("Error fetching notifications:", error);
      });
    getUserDetails();
  }, []);

  React.useEffect(() => {
    if (currentUser?.id) {
      let socket = new WebSocket(
        `${process.env.REACT_APP_BASE_WS_URL}ws/notification/?token=${currentUser?.access}`
      );
      setSocket(socket);
    }
  }, []);

  if (socket) {
    socket.onmessage = (e) => {
      if (!e.data.includes("Notification Marked as Read")) {
        setCount(count + 1);
        setNotifications([JSON.parse(e.data), ...notifications]);
      }
    };
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const logout = () => {
    localStorage.removeItem("LoggedInObj");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <NotificationModal
        open={notificationModal}
        notifications={notifications}
        showLoadMoreButton={showLoadMoreButton}
        onClose={() => setNotificationModal(false)}
        handleMarkAsRead={(id) => {
          socket.send(JSON.stringify({ notification_id: id }));
          setCount(count - 1);
          setNotifications(
            notifications.filter((notification) => notification.id !== id)
          );
        }}
        onLoadMoreNotifications={loadMoreNotifications} // Pass the function here
      />
      <div
        className={
          JSON.parse(localStorage.getItem("LoggedInObj"))?.type === "admin"
            ? styles.adminHeaderWrapper
            : styles.headerWrapper
        }
      >
        <div className={styles.headerContainer}>
          <div className={styles.headerLeft}>
            <Logo
              className={styles.logo}
              onClick={() => {
                if (
                  JSON.parse(localStorage.getItem("LoggedInObj")).type ===
                  "admin"
                ) {
                  navigate("/admin/dashboard");
                } else if (
                  JSON.parse(localStorage.getItem("LoggedInObj")).type ===
                  "lawyer"
                ) {
                  navigate("/dashboard/lawyer");
                } else {
                  navigate("/dashboard");
                }
              }}
            />
            {user ? <span className={styles.status}>{user.type}</span> : null}
          </div>
          <div className={styles.headerRight}>
            <IconButton onClick={() => setIsHelpCarouselOpen(true)}>
              <Avatar
                style={{
                  position: "absolute",
                  top: "-20",
                  right: "0",
                  width: "20px",
                  height: "auto",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                alt="helpIcon"
                src={helpIcon}
              />
            </IconButton>
            <IconButton onClick={() => setNotificationModal(true)}>
              {count > 0 ? (
                <span
                  style={{
                    position: "absolute",
                    top: "0",
                    right: "0",
                    backgroundColor: "#FF0000",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    color: "#fff",
                    fontSize: "12px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  className={styles.notification}
                >
                  {count}
                </span>
              ) : null}
              <Bell className={styles.icon} />
            </IconButton>

            <IconButton
              id="logout-button"
              aria-controls={open ? "user-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
              sx={{ p: 0 }}
            >
              <Avatar src={!imageUrl ? image : imageUrl} />
            </IconButton>
            <Menu
              id="user-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              MenuListProps={{
                "aria-labelledby": "logout-button",
              }}
              PaperProps={{
                style: {
                  minWidth: "160px",
                },
              }}
            >
              <MenuItem onClick={() => navigate("/settings")}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>
              <Divider />
              <MenuItem onClick={logout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </div>
        </div>
      </div>
      <HelpCarousel
        opened={isHelpCarouselOpen}
        setOpened={setIsHelpCarouselOpen}
      />
      <MessageModal
        open={isErrorModal}
        onClose={setIsErrorModal}
        title="Error"
        error
        content={errorMessage}
      />
    </>
  );
};

export default Header;
