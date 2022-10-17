import "./Task.css";
import DeleteIcon from "@mui/icons-material/Delete";
import { List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";

const Task = ({ taskText, onClick }) => {
  return (
    <div className="Parent">
    <List className="todo__list">
      <ListItem>
            <ListItemAvatar />    
                <ListItemText primary ={taskText} />
      </ListItem>
      <DeleteIcon fontSize="large" style={{ opacity: 0.7 }} onClick={onClick} />
    </List>
    </div>
  );
};

export default Task;
