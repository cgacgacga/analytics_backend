import React from "react";
import {DialogType, PermissionsInfoFields, PracticeSteps} from "../../enum";
import connect from "./connect";
import withStyles from "@material-ui/core/styles/withStyles";
import styles from "../styles";
import {Typography, WithStyles} from "@material-ui/core";
import {PermissionsInfoState, PracticeActions, PracticeState} from "../../types";

import classNames from "classnames";
import Scrollbars from "react-custom-scrollbars";
import {PrerequisiteFields} from "../../../WorkProgram/enum";
import {TrainingEntitiesFields} from "../../../TrainingEntities/enum";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/DeleteOutlined";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/EditOutlined";
import Button from "@material-ui/core/Button";
import CreateModal from "./CreateModal";
import {PrerequisiteType} from "../../../WorkProgram/types";

interface PrerequisitesProps extends WithStyles<typeof styles> {
    actions: PracticeActions;
    fields: PracticeState;
    permissionsInfo: PermissionsInfoState;
    prerequisitesList: Array<PrerequisiteType>;
}

class Prerequisites extends React.Component<PrerequisitesProps> {

    handleCreateNew = () => {
        this.props.actions.openDialog({dialogType: DialogType.PREREQUISITES, data: {}});
    };

    handleClickDelete = (id: number) => () => {
        this.props.actions.deletePrerequisite(id);
    };

    handleClickEdit = (prerequisite: PrerequisiteType) => () => {
        this.props.actions.openDialog({dialogType: DialogType.PREREQUISITES, data: prerequisite});
    };

    render() {

        const {classes, permissionsInfo, prerequisitesList} = this.props;
        const isCanEdit = permissionsInfo[PermissionsInfoFields.CAN_EDIT];

        return (
            <div>
                <Typography variant='h5'>
                    {PracticeSteps.PREREQUISITES}
                </Typography>
                <div>
                    <div className={classNames(classes.header, classes.item)}>
                        <Typography className={classes.title}>
                            Учебная сущность
                        </Typography>
                        <Typography>
                            Уровень освоения
                        </Typography>
                    </div>
                    <Scrollbars style={{height: 'calc(100vh - 400px)'}}>
                        <div className={classes.list}>
                            {prerequisitesList.map((prerequisite) => (
                                <div className={classNames(classes.item, {[classes.disableItem]: !isCanEdit})}
                                     key={prerequisite[PrerequisiteFields.ID]}
                                >
                                    <Typography className={classes.title}>
                                        {prerequisite[PrerequisiteFields.ITEM][TrainingEntitiesFields.TITLE]}
                                    </Typography>

                                    <Typography>
                                        {prerequisite[PrerequisiteFields.MASTER_LEVEL] === '1' ? 'Начальный'
                                            : prerequisite[PrerequisiteFields.MASTER_LEVEL] === '2' ? 'Средний'
                                                : 'Высокий'
                                        }
                                    </Typography>

                                    {isCanEdit &&
                                    <div className={classes.actions}>
                                        <IconButton onClick={this.handleClickDelete(prerequisite[PrerequisiteFields.ID])}>
                                            <DeleteIcon/>
                                        </IconButton>
                                        <IconButton onClick={this.handleClickEdit(prerequisite)}>
                                            <EditIcon/>
                                        </IconButton>
                                    </div>
                                    }
                                </div>
                            ))}
                        </div>
                    </Scrollbars>

                    {isCanEdit &&
                    <Button color="secondary"
                            className={classes.addIcon}
                            onClick={this.handleCreateNew}
                    >
                        <AddIcon/> Добавить пререквизит
                    </Button>
                    }

                    {isCanEdit && <CreateModal />}
                </div>
            </div>
        );
    }
}

export default connect(withStyles(styles)(Prerequisites));
