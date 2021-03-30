import React, { Component } from "react";
import axios from 'axios';
import Button from '@material-ui/core/Button';
import { DropzoneDialog } from 'material-ui-dropzone'
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import classes from '../../Navbar/Navbar.module.css'
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class Upload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            files: [],
            isShown: false,
            description: ""
        };
    }

    //Create a POST request to upload the image
    dialogSubmit() {
        this.setState({
            isShown: false
        });
        const formData = new FormData();
        formData.append('image', this.state.files[0], this.state.files[0].name);
        formData.append('uid', this.props.currentUser.uid);
        formData.append('caption', this.state.description);
        formData.append('avatar', this.props.currentUser.avatar);
        axios.post('/posts/new', formData).then(res => {
            console.log(res);
            location.reload(); //Profile and feed update
        });
    };

    //Modal handlers
    dialogOpen() {
        this.setState({
            isShown: true
        });
    };

    dialogClose() {
        this.setState({
            isShown: false
        });
    };

    handleTextChange(desc) {
        this.setState({
            description: desc.target.value
        })
    }

    handleClose() {
        this.setState({
            open: false
        });
    }

    handleOpen() {
        this.setState({
            open: true,
        });
    }

    handleSave(files) {
        this.setState({
            files: files,
            open: false
        });
        this.dialogOpen(); //Caption modal
    }

    render() {
        return (
            <div>
                <Button onClick={this.handleOpen.bind(this)} classes={{ root: classes.UploadButton }} >
                    <AddAPhotoIcon />
                </Button>
                <DropzoneDialog
                    open={this.state.open}
                    onSave={this.handleSave.bind(this)}
                    acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
                    showPreviews={false}
                    showPreviewsInDropzone={true}
                    maxFileSize={1000000}
                    filesLimit={1}
                    onClose={this.handleClose.bind(this)}>
                </DropzoneDialog>

                <div>
                    <Dialog open={this.state.isShown} onClose={this.dialogClose.bind(this)} aria-labelledby="form-dialog-title" fullWidth={true}>
                        <DialogTitle id="form-dialog-title">Finish uploading</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Give your image a description
                            </DialogContentText>
                            <TextField value={this.state.description}
                                multiline
                                autoFocus
                                rows={7}
                                rowsmax={Infinity}
                                margin="normal"
                                id="desc"
                                label="description"
                                fullWidth
                                onChange={this.handleTextChange.bind(this)}
                                inputProps={{
                                    maxLength: '512',
                                }}
                                helperText={`${this.state.description.length}/512`}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.dialogClose.bind(this)} color="primary">
                                Cancel
                        </Button>
                            <Button onClick={this.dialogSubmit.bind(this)} color="primary">
                                Submit
                        </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </div>
        );
    }
}

export default Upload;

