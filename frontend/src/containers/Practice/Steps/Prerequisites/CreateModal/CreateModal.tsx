import React, {ReactText} from 'react';
import get from "lodash/get";
import {shallowEqual} from "recompose";

import {CreateModalProps} from './types';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import FormLabel from "@material-ui/core/FormLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Tooltip from "@material-ui/core/Tooltip";
import withStyles from '@material-ui/core/styles/withStyles';

import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

import connect from './CreateModal.connect';
import styles from './CreateModal.styles';
import {Link} from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import {SubjectAreaFields} from "../../../../SubjectArea/enum";
import SearchSelector from "../../../../../components/SearchSelector";
import {PrerequisiteFields} from "../../../../WorkProgram/enum";
import {appRouter} from "../../../../../service/router-service";
import {TrainingEntitiesFields} from "../../../../TrainingEntities/enum";
import {DialogType} from "../../../enum";

class CreateModal extends React.PureComponent<CreateModalProps> {
    state = {
        prerequisite: {
            [PrerequisiteFields.ID]: null,
            [PrerequisiteFields.MASTER_LEVEL]: '1',
            [PrerequisiteFields.ITEM]: {
                [TrainingEntitiesFields.ID]: ''
            },
        }
    };

    componentDidUpdate(prevProps: Readonly<CreateModalProps>, prevState: Readonly<{}>, snapshot?: any) {
        const {prerequisite} = this.props;

        if (!shallowEqual(prerequisite, prevProps.prerequisite)){
            const subjectAreaId = get(prerequisite, [PrerequisiteFields.ITEM, TrainingEntitiesFields.SUBJECT_AREA, SubjectAreaFields.ID], null);

            this.props.trainingEntitiesActions.changeSubjectId(subjectAreaId);
            this.props.trainingEntitiesActions.getTrainingEntities();

            this.setState({
                prerequisite: {
                    [PrerequisiteFields.MASTER_LEVEL]: get(prerequisite, PrerequisiteFields.MASTER_LEVEL, ''),
                    [PrerequisiteFields.ITEM]: get(prerequisite, PrerequisiteFields.ITEM, {}),
                    [PrerequisiteFields.ID]: get(prerequisite, PrerequisiteFields.ID, null),
                }
            });
        }
    }

    componentDidMount() {
        this.props.trainingEntitiesActions.getTrainingEntities();
    }

    handleClose = () => {
        this.props.actions.closeDialog({dialogType: DialogType.PREREQUISITES});
    };

    handleSave = () => {
        const {prerequisite} = this.state;

        if (prerequisite[PrerequisiteFields.ID]){
            this.props.actions.changePrerequisite(this.state.prerequisite);
        } else {
            this.props.actions.addPrerequisite(this.state.prerequisite);
        }
        this.props.actions.closeDialog({dialogType: DialogType.PREREQUISITES});
    }

    changeMasterLevelField = (e: React.ChangeEvent) => {
        const {prerequisite} = this.state;

        this.setState({
            prerequisite: {
                ...prerequisite,
                [PrerequisiteFields.MASTER_LEVEL]: get(e, 'target.value')
            }
        })
    }

    saveTrainingEntityField = (value: ReactText) => {
        const {prerequisite} = this.state;

        this.setState({
            prerequisite: {
                ...prerequisite,
                [PrerequisiteFields.ITEM]: {
                    ...prerequisite[PrerequisiteFields.ITEM],
                    [TrainingEntitiesFields.ID]: value
                }
            }
        })
    };

    handleChangeTrainingEntitySearchText = (searchText: string) => {
        this.props.trainingEntitiesActions.changeSearchQuery(searchText);
        this.props.trainingEntitiesActions.getTrainingEntities();
    };

    render() {
        const {isOpen, classes, trainingEntities} = this.props;
        const {prerequisite} = this.state;

        const disableButton = get(prerequisite, [PrerequisiteFields.ITEM, TrainingEntitiesFields.ID], '').length === 0;

        const isEditMode = Boolean(get(prerequisite, PrerequisiteFields.ID));

        return (
            <Dialog
                open={isOpen}
                onClose={this.handleClose}
                classes={{
                    paper: classes.dialog
                }}
            >
                <DialogTitle>
                    <div className={classes.dialogTitle}>
                        {isEditMode ? 'Редактировать' : 'Создать'} пререквизит
                        <Tooltip
                            title={
                                <span style={{ fontSize: '13px' }}>
                                    Пререквезит - объект, отражающий конкретное знание из конкретной области
                                    (далее "учебная сущность"), которое должно быть у студента перед началом изучения курса.
                                    <br /><br />Для добавления необходимо выбрать предметную область и учебную сущность в ней.
                                    <br /><br />Если необходимо создать новую учебную сущность, необходимо нажать кнопку "Создать учебную сущность"
                                     и создать ее в соответствующем интерфейсе.
                                </span>
                            }
                        >
                            <HelpOutlineIcon color="primary" style={{ marginLeft: '10px', paddingTop: '4px' }} />
                        </Tooltip>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Уровень освоения *</FormLabel>
                        <RadioGroup className={classes.radioGroup}
                                    onChange={this.changeMasterLevelField}
                                    value={prerequisite[PrerequisiteFields.ITEM]}
                        >
                            <FormControlLabel value="1" control={<Radio checked={prerequisite[PrerequisiteFields.MASTER_LEVEL] === '1'} />} label="Начальный" />
                            <FormControlLabel value="2" control={<Radio checked={prerequisite[PrerequisiteFields.MASTER_LEVEL] === '2'} />} label="Средний" />
                            <FormControlLabel value="3" control={<Radio checked={prerequisite[PrerequisiteFields.MASTER_LEVEL] === '3'} />} label="Высокий" />
                        </RadioGroup>
                    </FormControl>

                    <SearchSelector label="Учебная сущность *"
                                            changeSearchText={this.handleChangeTrainingEntitySearchText}
                                            list={trainingEntities}
                                            changeItem={this.saveTrainingEntityField}
                                            value={get(prerequisite, [PrerequisiteFields.ITEM, TrainingEntitiesFields.ID], '')}
                                            valueLabel={get(prerequisite, [PrerequisiteFields.ITEM, TrainingEntitiesFields.TITLE], '')}
                    />
                </DialogContent>
                <DialogActions className={classes.actions}>
                    <Link to={appRouter.getTrainingEntitiesRoute()}
                          className={classes.link}
                          target="_blank"
                    >
                        <Typography>
                            Создать учебную сущность
                        </Typography>
                    </Link>

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

export default connect(withStyles(styles)(CreateModal));
