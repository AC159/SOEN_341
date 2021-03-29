import React, {useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { blue } from '@material-ui/core/colors';
import { ModalContext } from '../ModalContextProvider/ModalContextProvider';
import { useHistory } from "react-router";

const useStyles = makeStyles({
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
    },
});

function SimpleDialog(props) {
    const classes = useStyles();
    const { type, onClose, selectedValues, open } = props;
    const history = useHistory();

    const handleClose = () => {
        onClose(selectedValues);
    };

    const handleListItemClick = (user) => {
        onClose(user);
        history.push(`/profile/${user._id}`);
    };

    return (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle id="simple-dialog-title">{type}</DialogTitle>
            <List>
                {selectedValues.map((followerOrfollowing) => (
                    <ListItem button onClick={() => handleListItemClick(followerOrfollowing)} key={followerOrfollowing._id}>
                        <ListItemAvatar>
                            <Avatar className={classes.avatar} src={followerOrfollowing.avatar}>
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={followerOrfollowing.name} />
                    </ListItem>
                ))}
            </List>
        </Dialog>
    );
}

export default function SimpleDialogDemo(props) {

    const [open, setOpen] = React.useState(true);
    const [selectedValues, setSelectedValues] = React.useState(props.data);
    const { closeFollowersDialog, closeFollowingDialog } = useContext(ModalContext);

    // Close the modal
    const handleClose = (value) => {
        setOpen(false);
        setSelectedValues(value);

        if (props.type === "followers") {
            closeFollowersDialog();
        }

        if (props.type === "following") {
            closeFollowingDialog();
        }

    };

    return (
        <div>
            <SimpleDialog type={props.type} selectedValues={selectedValues} open={open} onClose={handleClose} />
        </div>
    );
}
