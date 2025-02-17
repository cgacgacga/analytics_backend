import React from 'react';

import {Props} from './types';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import withStyles from '@material-ui/core/styles/withStyles';

import SearchSelector from "../../../../components/SearchSelector";

import connect from './AddPracticeModal.connect';
import styles from './AddPracticeModal.styles';

class AddPracticeModal extends React.PureComponent<Props> {
    state = {
        id: null,
        label: ''
    };

    componentDidMount() {
        this.props.actions.getPracticeList();
    }

    handleClose = () => {
        this.props.closeDialog();
    }

    handleSave = () => {
        this.props.saveDialog(this.state.id, this.state.label);
        this.props.closeDialog();
    }

    savePractice = (value: string, label: string) => {
        this.setState({id: value, label})
    }

    handleChangeSearchText = (searchText: string) => {
        this.props.actions.setSearchText(searchText);
        this.props.actions.getPracticeList();
    }

    render() {
        const {isOpen, classes, list} = this.props;

        const disableButton = this.state.id === null;

        return (
            <Dialog
                open={isOpen}
                onClose={this.handleClose}
                classes={{
                    paper: classes.dialog,
                    root: classes.root,
                }}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Добавить практику</DialogTitle>

                <DialogContent>
                    <SearchSelector label="Практика * "
                                    changeSearchText={this.handleChangeSearchText}
                                    list={list}
                                    changeItem={this.savePractice}
                                    value={''}
                                    valueLabel={''}
                    />
                </DialogContent>
                <DialogActions className={classes.actions}>
                    <Button onClick={this.handleClose}
                            variant="text">
                        Отмена
                    </Button>
                    <Button onClick={this.handleSave}
                            variant="contained"
                            disabled={disableButton}
                            color="primary">
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

// @ts-ignore
export default connect(withStyles(styles)(AddPracticeModal));
