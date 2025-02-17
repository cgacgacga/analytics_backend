import React from 'react';
import Scrollbars from "react-custom-scrollbars";

import Typography from "@material-ui/core/Typography";
import withStyles from '@material-ui/core/styles/withStyles';
import Button from "@material-ui/core/Button";

import AddIcon from "@material-ui/icons/Add";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/DeleteOutlined";

import {FourthStepProps} from './types';
import {fields} from "../enum";
import {literatureFields} from '../../Literature/enum';

import LiteratureAddModal from "./LiteratureModal";

import connect from './Literature.connect';
import styles from './Literature.styles';

class Literature extends React.PureComponent<FourthStepProps> {
    handleCreateNewTopic = () => {
        const {literatureList} = this.props;

        this.props.actions.openDialog({dialogType: fields.ADD_NEW_LITERATURE, data: literatureList});
    };

    handleClickDelete = (id: number) => () => {
        this.props.actions.deleteLiterature(id);
    };

    render() {
        const {classes, literatureList, isCanEdit} = this.props;

        return (
            <div className={classes.root}>
                <Scrollbars style={{height: 'calc(100vh - 400px)'}} >
                    <div className={classes.list}>
                        {literatureList.map((literature) => (
                            <div className={classes.item}>
                                <Typography className={classes.title}>
                                    {literature[literatureFields.DESCRIPTION] || literature[literatureFields.DESCRIPTION_EBSCO]}
                                </Typography>

                                {isCanEdit &&
                                    <div className={classes.actions}>
                                        <IconButton onClick={this.handleClickDelete(literature[literatureFields.ID])}>
                                            <DeleteIcon/>
                                        </IconButton>
                                    </div>
                                }
                            </div>
                        ))}
                    </div>
                </Scrollbars>

                {isCanEdit &&
                    <div className={classes.iconWrapper}>
                        <Button color="secondary"
                            className={classes.addIcon}
                            onClick={this.handleCreateNewTopic}
                        >
                            <AddIcon/> Добавить источник
                        </Button>
                    </div>
                }

                {isCanEdit && <LiteratureAddModal />}
            </div>
        );
    }
}

export default connect(withStyles(styles)(Literature));
