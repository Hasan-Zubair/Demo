import {
  Backdrop,
  Button,
  Container,
  Grid,
  Input,
  Modal,
  TextField,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";

// components
// import Filters from "./components/Filters";
import { LoadingButton } from "@mui/lab";
import axios from "axios";
// style
import "./Add.scss";
import MessageModal from "../../../common/MessageModal";
import HandleApiError from "../../../utils/apiError";
import handleApiError from "../../../utils/apiError";

const AddBlog = ({
  open,
  setOpen,
  getBlogPosts,
  updateData,
  handleSaveAndPublishP,
  handleSaveP,
}) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const [headlineImage, setHeadlineImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorModal, SetErrorModal] = useState(false);
  const [errorModalTitle, SetErrorModalTitle] = useState("");
  const [errorModalContent, SetErrorModalContent] = useState("");
  const [selectedFileName, setSelectedFileName] = useState(null);
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxFileNameLength = 15;
      const fileName = file.name;
      const truncatedFileName =
        fileName.length > maxFileNameLength
          ? fileName.substring(0, maxFileNameLength) + "..."
          : fileName;
      setSelectedFileName(truncatedFileName);
      setHeadlineImage(file);
    }
  };

  const handleClose = () => {
    if (!title && !headlineImage && (!content || content == "<p><br></p>")) {
      setOpen(false);
    } else {
      if (updateData) {
        handleSave();
      } else {
        handleSaveAndPublish();
      }
    }
  };

  useEffect(() => {
    setTitle(updateData?.title ? updateData?.title : "");
    setSubTitle(updateData?.sub_title ? updateData?.sub_title : "");
    setContent(updateData?.content ? updateData?.content : "");
    setHeadlineImage(updateData?.image ? updateData?.image : "");
    setSelectedFileName(
      updateData?.image ? updateData?.image.split("/").pop().split(".")[0] : ""
    );
  }, [updateData, open]);

  const handleSave = async (data) => {
    setLoading(true);
    let formData = new FormData();
    formData.append("title", title);
    formData.append("sub_title", subTitle);
    if (typeof headlineImage === "object") {
      formData.append("image", headlineImage);
    }
    formData.append("content", content);
    const slug = updateData.slug;
    handleSaveP(slug , formData)
    setLoading(false);
    
  };

  const handleSaveAndPublish = async () => {
    setLoading(true);
    let formData = new FormData();
    formData.append("title", title);
    formData.append("sub_title", subTitle);
    formData.append("image", headlineImage);
    formData.append("content", content);
    formData.append("is_published", true);
    handleSaveAndPublishP(formData);
    setLoading(false);
  };


  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Container
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "#fff",
            boxShadow: 24,
            p: 4,
            height: "90vh",
            minHeight: "600px",
          }}
        >
          <form>
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ marginBottom: "20px" }}
            />
            {/* <TextField
              label="Sub-title"
              variant="outlined"
              fullWidth
              value={subTitle}
              onChange={(e) => setSubTitle(e.target.value)}
              style={{ marginBottom: "20px" }}
            /> */}

            <div className="file-input-container">
              <Button
                variant="contained"
                color="primary"
                className="select-button"
                onClick={handleButtonClick}
              >
                {selectedFileName ? selectedFileName : "Cover Image"}
              </Button>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
                inputRef={fileInputRef}
              />
            </div>

            <ReactQuill
              value={content}
              onChange={(value) => setContent(value)}
              style={{ marginBottom: "20px", height: "200px" }}
              modules={AddBlog.modules}
            />
            <Grid container spacing={2} style={{ marginTop: "40px" }}>
              <Grid item>
                <LoadingButton
                  loading={loading}
                  variant="contained"
                  color="primary"
                  onClick={updateData?.slug ? handleSave : handleSaveAndPublish}
                >
                  Save
                </LoadingButton>
              </Grid>
            </Grid>
          </form>
        </Container>
      </Modal>
      <MessageModal
        open={errorModal}
        onClose={SetErrorModal}
        title={errorModalTitle}
        content={error}
      />
    </>
  );
};

AddBlog.modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image", "video"],
    ["clean"],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};

export default AddBlog;
