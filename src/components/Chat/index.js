import React, { useState, useEffect, useRef, useMemo } from "react";
import PropTypes from "prop-types"; // Add this import
import { styled } from "@mui/material/styles";
import {
  InputAdornment,
  TextField,
  Badge,
  Avatar,
  IconButton,
  Backdrop,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import myAPI from "../../utils/axios";

// styles
import { ReactComponent as Send } from "../../assets/icons/send.svg";
import { ReactComponent as Search } from "../../assets/dashboard/search.svg";
import avatar from "../../assets/header/avatar.png";
import styles from "./chat.module.scss";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroller";
import CircularProgress from "@mui/material/CircularProgress";
import { Close } from "@mui/icons-material";

let _isMore = true;
let pageNumber = 1;
let isMsgLoading = false;

const ChatBox = ({ caseID, status, lawyer, handleClose }) => {
  const [showCloseIcon, setShowCloseIcon] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [data, setData] = useState();
  const [socket, setSocket] = useState(null);
  const [image, setImage] = useState("");
  const [receImage, setReceImage] = useState("");
  const [filterMsgs, setFilterMsgs] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const currentUser = localStorage.getItem("LoggedInObj")
    ? JSON.parse(localStorage.getItem("LoggedInObj"))
    : null;
  const getMessages = async (page, cb = undefined) => {
    // cb = callback function
    // setLoading(true);
    isMsgLoading = true;
    await myAPI
      .get(`api/chat/?case=${caseID}&page_size=100&page=${page}`)
      .then(({ data }) => {
        cb && cb();
        isMsgLoading = false;
        if (!data?.next) {
          setHasMore(false);
          _isMore = false;
          document.getElementById("backdrop").style.opacity = 0;
          document.getElementById("backdrop").style.zIndex = 0;
        }
        setMessages((previousMessages) => [
          ...data.results,
          ...previousMessages,
        ]);
        setTimeout(() => {
          // setLoading(false);
          setHasMore(true);
        }, 2000);
      })
      .catch(() => {
        setHasMore(false);
        // setLoading(false);
        isMsgLoading = false;
        _isMore = false;
      });
  };
  useMemo(() => {
    if (pageNumber == 1) {
      setTimeout(() => {
        setLoading(false);
        scrollToBottom();
      }, 500);
    }
  }, [pageNumber]);

  useEffect(() => {
    getMessages(pageNumber);
    pageNumber++;
    return () => {
      pageNumber = 1;
    };
  }, []);

  useEffect(() => {
    if (!receImage && messages.length > 0) {
      const Id =
        messages[messages.length - 1].receiver?.id ===
        JSON.parse(localStorage.getItem("LoggedInObj"))?.id
          ? messages[messages.length - 1].sender?.id
          : messages[messages.length - 1].receiver?.id;
      if (Id) {
        axios
          .get(`${process.env.REACT_APP_BASE_API_URL}api/auth/user/${Id}/`, {
            headers: {
              Authorization: `JWT ${localStorage.getItem("token")}`,
            },
          })
          .then((res) => {
            setReceImage(res.data.image);
          })
          .catch((error) => {
            console.log("Error is ", error.message);
          });
      }
    }
  }, [messages]);

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

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    const filteredMessages = messages.filter((message) =>
      message.message.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilterMsgs(filteredMessages);
    if (searchQuery.length === 0) {
      setFilterMsgs([]);
      setTimeout(() => {
        scrollToBottom();
      }, 500);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (currentUser?.id) {
      let socket = new WebSocket(
        `${process.env.REACT_APP_BASE_WS_URL}ws/chat/${caseID}/?token=${currentUser?.access}`
      );
      // let socket = new WebSocket(`ws://localhost:8000/ws/chat/${caseID}/?token=${currentUser?.access}`)
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

        // getTasksData(caseID);
      })
      .catch((err) => {});
  }, []);

  if (socket) {
    socket.onmessage = (e) => {
      const message = JSON.parse(e.data);
      setMessages([...messages, message]);
      scrollToBottom();
    };
  }

  const sendMessage = () => {
    const newData = {
      message: data,
      sender_id: currentUser.id,
    };
    if (data && socket) {
      setLoading(true);
      socket.send(JSON.stringify(newData));
      setData("");
      scrollToBottom();
      socket.addEventListener("message", () => {
        setLoading(false);
      });
      // getMessages()
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    pageNumber == 2 && scrollToBottom();
  }, [messages]);

  return (
    <div className={styles.chatWrapper}>
      <div className={styles.searchWrapper}>
        <h4>
          Messages
          {showCloseIcon && (
            <IconButton className={styles.closeIcon} onClick={handleClose}>
              <Close />
            </IconButton>
          )}
        </h4>
        <TextField
          className={styles.searchBar}
          id="application-search"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearch}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </div>

      <div
        className={
          status === "locked" || !lawyer || status === "closed" || !lawyer
            ? "disabled" + " " + styles.usersChat
            : styles.usersChat
        }
        style={{ scrollSnapAlign: "center", position: "relative" }}
      >
        <InfiniteScroll
          loadMore={() => {
            getMessages(pageNumber);
            pageNumber++;
            isMsgLoading = true;
          }}
          hasMore={!isMsgLoading && _isMore && hasMore}
          useWindow={false}
          isReverse={true}
          initialLoad={false}
        >
          <Backdrop
            id="backdrop"
            style={{ position: "absolute", zIndex: "1000" }}
            open={true}
          >
            <CircularProgress color="inherit" />
          </Backdrop>

          <div className={styles.messagesWrapper}>
            {filterMsgs?.length === 0 &&
              messages.map((message, key) => {
                if (message?.sender?.id === currentUser?.id) {
                  return (
                    <div
                      className={`${styles.messageWrapper} ${styles.sender}`}
                    >
                      <Avatar src={image} />

                      <div>
                        <div className={styles.details}>
                          {/* <h5>You</h5> */}
                          {message?.created_at}
                        </div>
                        <div className={styles.message}>{message?.message}</div>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div
                      className={`${styles.messageWrapper} ${styles.receiver}`}
                    >
                      <Avatar src={receImage} />
                      <div>
                        <div className={styles.details}>
                          <h5>{message?.sender?.name}</h5>
                          {message?.created_at}
                        </div>
                        <div className={styles.message}>{message?.message}</div>
                      </div>
                    </div>
                  );
                }
              })}
            {filterMsgs &&
              filterMsgs.map((message) => {
                if (message?.sender?.id === currentUser?.id) {
                  return (
                    <div
                      className={`${styles.messageWrapper} ${styles.sender}`}
                    >
                      <Avatar src={image} />

                      <div>
                        <div className={styles.details}>
                          {/* <h5>You</h5> */}
                          {message?.created_at}
                        </div>
                        <div className={styles.message}>{message?.message}</div>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div
                      className={`${styles.messageWrapper} ${styles.receiver}`}
                    >
                      <Avatar src={receImage} />

                      <div>
                        <div className={styles.details}>
                          <h5>{message?.sender?.name}</h5>
                          {message?.created_at}
                        </div>
                        <div className={styles.message}>{message?.message}</div>
                      </div>
                    </div>
                  );
                }
              })}
          </div>
        </InfiniteScroll>
        <div ref={messagesEndRef} />
      </div>

      <div
        className={
          status === "locked" || status === "closed"
            ? "disabled" + " " + styles.sendForm
            : styles.sendForm
        }
      >
        <TextField
          disabled={!lawyer}
          className={styles.sendInput}
          placeholder="Message"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          variant="outlined"
          value={data}
          onChange={(e) => {
            setData(e.target.value);
          }}
        />
        <LoadingButton
          className={styles.sendButton}
          variant="contained"
          onClick={sendMessage}
          loading={loading}
          loadingPosition="start"
        >
          <Send disabled={!lawyer} />
        </LoadingButton>
      </div>
    </div>
  );
};

ChatBox.propTypes = {
  caseID: PropTypes.string,
  status: PropTypes.string,
  lawyer: PropTypes.bool,
};

export default ChatBox;
