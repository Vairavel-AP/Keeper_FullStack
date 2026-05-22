import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

function Note({ id, title, content, onDelete }) {
  return (
    <div className="note">
      {title && <h1>{title}</h1>}
      <p>{content}</p>
      <IconButton onClick={() => onDelete(id)} aria-label="delete" size="small">
        <DeleteIcon />
      </IconButton>
    </div>
  );
}

export default Note;
