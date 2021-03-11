import React, {Component} from "react";
import axios from 'axios';
import Button from '@material-ui/core/Button';
import {DropzoneDialog} from 'material-ui-dropzone'
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import classes from '../../Navbar/Navbar.module.css';

class Upload extends Component{
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            files: []
        };
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
        console.log(files[0]);
        const formData = new FormData();
        formData.append('image', files[0], files[0].name);
        console.log(this.props)
        formData.append('uid', this.props.currentUser.uid)
        axios.post('/users/images', formData).then(res => {
            console.log(res);
        });
    }

    render() {
        return(
            <div>
                <Button onClick={this.handleOpen.bind(this)} classes={{root:classes.UploadButton}} >
                    <AddAPhotoIcon/>
                </Button>
                <DropzoneDialog
                    open={this.state.open}
                    onSave={this.handleSave.bind(this)}
                    acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
                    showPreviews={true}
                    maxFileSize={1000000}
                    onClose={this.handleClose.bind(this)}
                />
            </div>
        );
    }
}

export default Upload;

