import {
  Avatar,
  Box,
  Drawer,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import Fab from "@mui/material/Fab";
import { styled } from "@mui/material/styles";
import { Badge } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { ReactComponent as BotIcon } from "../../assets/icons/bot-icon.svg";
import botProfile from "../../assets/icons/chat-profile.png";
import { ReactComponent as Send } from "../../assets/icons/send.svg";
import clipboard from "../../assets/icons/clipboard.svg";
import checkCircle from "../../assets/icons/checkCircle.svg";
import axios from "../../utils/axios";
import { formatFileSize } from "./functions";
import { getCurrentTimestamp } from "../../utils/getCurrentTimestamp";

// style
import { LoadingButton } from "@mui/lab";
import styles from "./aiBot.module.scss";
import { Close } from "@mui/icons-material";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#66B1B4",
    color: "#66B1B4",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
  },
}));

const VeraAiBot = () => {
  const [icon, setIcon] = useState("clipboard");
  const [clickedMessageIndex, setClickedMessageIndex] = useState(null);
  const [open, setOpen] = useState(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    {
      role: "system",
      content:
        "you are an AI legal adivser in UK and I am a lawyer and i want need your assist in my daily legal queries according to UK Laws. Note: Do not reply non legal queries and remeber this in future prompts as well",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [dis, setDis] = useState(false);
  const [file, setFile] = useState(null);
  const [image, setImage] = useState("");
  const lastMessegeRef = useRef(null);
  const fileInputRef = useRef(null);
  const [showCloseIcon, setShowCloseIcon] = useState(false);
  const [socket, setSocket] = useState(null);

  const currentUser = localStorage.getItem("LoggedInObj")
    ? JSON.parse(localStorage.getItem("LoggedInObj"))
    : null;

  const handleClick = () => {
    setOpen(true);
    setTimeout(() => {
      setChat((prev) => [...prev]);
    }, 50);

    if (currentUser?.id) {
      let socket = new WebSocket(
        `${process.env.REACT_APP_BASE_WS_URL}ws/chatgpt/${currentUser?.id}/?token=${currentUser?.access}`
      );
      setSocket(socket);
    }
    axios
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
      });
  };

  const handleClose = () => {
    setOpen(null);
    socket.close();
    setSocket(null);
  };

  const sendMessage = async () => {
    setLoading(true);
    const newData = {
      message: [
        ...chat,
        {
          role: "user",
          content: message,
        },
      ],
    };
    setChat(newData.message);
    setMessage("");
    try {
      if (socket) {
        setLoading(true);
        socket.send(JSON.stringify(newData));
        socket.addEventListener("message", () => {
          setLoading(false);
        });
      }
    } catch (err) {
      setChat((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong on server.😟",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sendClick = () => {
    if (file) {
      setChat((prev) => [
        ...prev,
        {
          content: "upload__file",
          role: "user",
          fileName: file.name,
          fileSize: formatFileSize(file.size, 2),
          fileType: file.type,
          timestamp: getCurrentTimestamp,
        },
      ]);
      setTimeout(() => {
        removeFile();
        setChat((prev) => [
          ...prev,
          {
            content: "Your file has been uploaded successfully.",
            role: "assistant",
            timestamp: getCurrentTimestamp,
          },
        ]);
      }, 100);
    } else {
      sendMessage();
    }
  };

  useEffect(() => {
    try {
      if (lastMessegeRef.current) {
        lastMessegeRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    } catch (error) {
      console.error(error)
    }
  }, [chat]);

  useEffect(() => {
    const keyDownHandler = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (message && !loading) {
          sendClick();
        }
      }
    };
    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [message]);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const removeFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
      setFile(null);
    }
  };

  function handleCopyToClipboard(text, index) {
    setClickedMessageIndex(index);
    setIcon(checkCircle);

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).catch((error) => {
        console.error("Unable to copy: " + error);
      });
    } else {
      console.error("Clipboard API is not supported in this browser.");
    }

    setTimeout(() => {
      setClickedMessageIndex(null);
      setIcon(clipboard);
    }, 1000);
  }

  useEffect(() => {
    const handleWindowResize = () => {
      if (window.innerWidth < 1200) {
        setShowCloseIcon(true);
      } else {
        setShowCloseIcon(false);
      }
    };
    handleWindowResize();
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  if (socket) {
    console.log("TCL: socket", socket);
    socket.onmessage = (e) => {
      setDis(true);
      console.log("socket.onmessage", e);
      const message_ = JSON.parse(e.data);
      if (!message_.content) {
        setDis(false);
      }
      if (chat.length === 0 || chat[chat.length - 1].role === "user") {
        // If there's no assistant message or the last message was from the user,
        // add a new response box
        setChat((prev) => [
          ...prev,
          {
            role: "assistant",
            content: message_.content,
          },
        ]);
      } else {
        // Append the new content to the current assistant response
        setChat((prev) => [
          ...prev.slice(0, prev.length - 1), // Remove the last response
          {
            role: "assistant",
            content: prev[prev.length - 1].content + message_.content,
          },
        ]);
      }
    };
  }

  return (
    <Box className={styles.veraBot}>
      <Fab color="primary" onClick={handleClick}>
        <BotIcon />
      </Fab>
      <Drawer
        anchor={"right"}
        open={open}
        onClose={handleClose}
        className={styles.chatWrapper}
        sx={{ zIndex: "9999999999 !important" }}
      >
        <Box className={styles.header}>
          <h4>
            Vera AI
            {showCloseIcon && (
              <IconButton className={styles.closeIcon} onClick={handleClose}>
                <Close />
              </IconButton>
            )}
          </h4>
        </Box>
        <Box className={styles.messageWrapper}>
          <Box className={styles.chatMessage}>
            <Box className={styles.messageWrap}>
              <img src={botProfile} alt="assistant-profile" />
              <Box className={styles.message}>
                <div className={styles.messageHeader}>
                  <span
                    style={{
                      display: "block",
                      textAlign: "right",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      handleCopyToClipboard(
                        "Hello! How can I assist you today with a legal question?",
                        "header"
                      )
                    }
                  >
                    <img
                      src={clickedMessageIndex === "header" ? icon : clipboard}
                      alt="icon"
                      style={{ width: "17px" }}
                    />
                  </span>
                </div>
                Hello! How can I assist you today with a legal question?
              </Box>
            </Box>

            {chat.map(
              (item, i) =>
                item.role !== "system" && (
                  <Box
                    key={i}
                    ref={
                      chat.length && chat.length - 2 <= i
                        ? lastMessegeRef
                        : null
                    }
                    className={
                      item.role === "assistant"
                        ? styles.messageWrap
                        : styles.messageWrapRight
                    }
                  >
                    {item.role === "assistant" ? (
                      <>
                        <img src={botProfile} alt="assistant profile" />
                        <Box className={styles.message}>
                          <span
                            style={{
                              display: "block",
                              textAlign: "right",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              handleCopyToClipboard(item.content, i)
                            }
                          >
                            <img
                              src={i === clickedMessageIndex ? icon : clipboard}
                              alt="icon"
                              style={{ width: "17px" }}
                            />
                          </span>
                          <div
                            id="aiMessage"
                            dangerouslySetInnerHTML={{ __html: item.content }}
                          />
                          <span
                            style={{
                              display: "block",
                              textAlign: "right",
                              fontSize: "12px",
                              color: "GrayText",
                            }}
                          >
                            {item.timestamp}
                          </span>
                        </Box>
                      </>
                    ) : (
                      <>
                        <Box className={styles.message}>
                          {item.content}
                          <span
                            style={{
                              display: "block",
                              textAlign: "right",
                              fontSize: "12px",
                              color: "GrayText",
                            }}
                          >
                            {item.timestamp}
                          </span>
                        </Box>
                        <StyledBadge
                          overlap="circular"
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                          }}
                        >
                          <Avatar
                            style={{ width: "32px", height: "32px" }}
                            alt="user-image"
                            src={image}
                          />
                        </StyledBadge>
                      </>
                    )}
                  </Box>
                )
            )}
          </Box>

          <div className={styles.sendForm}>
            <input
              id="fileInput"
              hidden
              type="file"
              accept=".pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
            <TextField
              disabled={dis}
              name="message"
              fullWidth
              value={message}
              variant="outlined"
              placeholder="Message"
              onChange={(e) => setMessage(e.target.value)}
            />
            <LoadingButton
              className={styles.sendButton}
              variant="contained"
              onClick={sendClick}
              loading={loading}
              loadingPosition="start"
              disabled={dis}
            >
              <Send />
            </LoadingButton>
          </div>
          <p className={styles.disclaimer}>
            DISCLAIMER: This is a beta version to be used only by qualified
            solicitors or barristers to function as a base guide. All responses
            should be independently verified.
          </p>
        </Box>
      </Drawer>
    </Box>
  );
};

export default VeraAiBot;
