import React from 'react';
import Scrollbars from "react-custom-scrollbars";

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import withStyles from '@material-ui/core/styles/withStyles';
import TablePagination from '@material-ui/core/TablePagination';
import Checkbox from "@material-ui/core/Checkbox";
import Typography from "@material-ui/core/Typography";

import {getUserFullName} from "../../../../common/utils";

import {TrainingModuleType} from "../types";
import {fields} from '../enum';
import {TrainingModuleCreateModalProps} from './types';

import connect from './AddTrainingModuleModal.connect';
import styles from './AddTrainingModuleModal.styles';
import Switch from "@material-ui/core/Switch";

class AddTrainingModuleModal extends React.PureComponent<TrainingModuleCreateModalProps, { selectedTrainingModules: TrainingModuleType[]}> {
    state = {
        selectedTrainingModules: [] as TrainingModuleType[]
    };

    componentDidUpdate(prevProps: Readonly<TrainingModuleCreateModalProps>, prevState: Readonly<{ selectedTrainingModules: TrainingModuleType[] }>, snapshot?: any) {
        if (!prevProps.isOpen && this.props.isOpen) {
            this.searchModules()
        }
    }

    handleClose = () => {
        this.props.actions.resetFilters();
        this.props.actions.closeDialog();
    }

    handleSave = () => {
        const {connectedModules, onSave, fatherId} = this.props
        const selectedModules = this.state.selectedTrainingModules.map((trainingModule) => trainingModule.id)

        if (onSave) {
            onSave(selectedModules, fatherId)
        } else {
            this.props.actions.updateChildModules({
                trainingModules: [
                    ...selectedModules,
                    ...connectedModules,
                ],
                moduleId: fatherId
            });
        }

        this.setState({
            selectedTrainingModules: [],
        })
    }

    updateFilters = (field: string) => (e: React.ChangeEvent) => {
        this.props.actions.updateTrainingModuleFilters({
            field,
            //@ts-ignore
            value: e.currentTarget.value,
        })
    }

    updateAvailableForAllModulesFilter = () => {
        this.props.actions.updateTrainingModuleFilters({
            field: fields.FILTER_MODULE_AVAILABLE_FOR_ALL,
            //@ts-ignore
            value: !this.props.filterModuleAvailableForAll,
        })
        this.props.actions.getTrainingModulesList()
    }

    searchModules = () => {
        this.props.actions.getTrainingModulesList()
    }

    handleUnselect = (id: number) => () => {
        this.setState({
            selectedTrainingModules: this.state.selectedTrainingModules.filter((item: any) => item.id !== id)
        })
    }

    handleSelect = (trainingModule: TrainingModuleType) => () => {
        this.setState({
            selectedTrainingModules: [
                ...this.state.selectedTrainingModules,
                trainingModule,
            ]
        })
    }

    handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
        this.props.actions.changeCurrentPage(page + 1);
        this.props.actions.getTrainingModulesList();
    }

    render() {
        const {isOpen, classes, filterId, filterModuleIsuId, filterModuleName, filterModuleDisciplineName,
            trainingModules, allCount, currentPage, filterModuleAvailableForAll, onSave} = this.props;
        const {selectedTrainingModules} = this.state;

        return (
            <Dialog
                open={isOpen}
                onClose={this.handleClose}
                classes={{
                    paper: classes.dialog
                }}
                fullWidth
                maxWidth="xl"
            >
                <DialogTitle>
                    <div className={classes.dialogTitle}>
                        Добавить учебный модуль
                        {!onSave && ( // onSave передается в учебных планах, там не нужно показывать эту галку
                            <Typography>
                                <Switch checked={filterModuleAvailableForAll}
                                        onChange={this.updateAvailableForAllModulesFilter}
                                        color="primary"
                                />
                                Показать общедоступные модули
                            </Typography>
                      )}
                    </div>
                </DialogTitle>
                <DialogContent className={classes.dialogContent}>
                    <div className={classes.filtersLine}>
                        <TextField label="КОП ИД"
                                   onChange={this.updateFilters(fields.FILTER_ID)}
                                   variant="outlined"
                                   className={classes.input}
                                   fullWidth
                                   value={filterId}
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                        />
                        <TextField label="ИСУ ИД"
                                   onChange={this.updateFilters(fields.FILTER_MODULE_ISU_ID)}
                                   variant="outlined"
                                   className={classes.input}
                                   fullWidth
                                   value={filterModuleIsuId}
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                        />
                        <TextField label="Название модуля"
                                   onChange={this.updateFilters(fields.FILTER_MODULE_NAME)}
                                   variant="outlined"
                                   className={classes.input}
                                   fullWidth
                                   value={filterModuleName}
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                        />
                        <TextField label="Название блока"
                                   onChange={this.updateFilters(fields.FILTER_MODULE_DISCIPLINE_NAME)}
                                   variant="outlined"
                                   className={classes.input}
                                   fullWidth
                                   value={filterModuleDisciplineName}
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                        />
                        <Button variant="contained" color="primary" onClick={this.searchModules} className={classes.searchButton}>
                            Найти
                        </Button>
                    </div>

                    <div className={classes.list}>
                        <Scrollbars>
                            <>
                                {selectedTrainingModules.map((trainingModule: TrainingModuleType) => (
                                  <div key={trainingModule.id} className={classes.selectedItem}>
                                      <Checkbox checked={true} onChange={this.handleUnselect(trainingModule.id)}/>
                                      <Typography>{trainingModule.name} / {trainingModule.id} (КОП) / {trainingModule.module_isu_id} (ИСУ) / {trainingModule.editors?.map((editor) => getUserFullName(editor)).join(', ')} </Typography>
                                  </div>
                                ))}
                                {trainingModules.map((trainingModule: TrainingModuleType) => {
                                    if (selectedTrainingModules.find((selectedItem) => trainingModule.id === selectedItem.id)) return <></>
                                    return (
                                      <div key={trainingModule.id} className={classes.selectedItem}>
                                          <Checkbox checked={false} onChange={this.handleSelect(trainingModule)}/>
                                          <Typography>{trainingModule.name} / {trainingModule.id} (КОП) / {trainingModule.module_isu_id} (ИСУ) / {trainingModule.editors?.map((editor) => getUserFullName(editor)).join(', ')} </Typography>
                                      </div>
                                    )
                                })}
                            </>
                        </Scrollbars>

                        <TablePagination
                            component="div"
                            count={allCount}
                            page={currentPage - 1}
                            rowsPerPageOptions={[]}
                            onChangePage={this.handleChangePage}
                            rowsPerPage={10}
                            onChangeRowsPerPage={()=>{}}
                        />
                    </div>
                </DialogContent>
                <DialogActions className={classes.actions}>
                    <Button onClick={this.handleClose}
                            variant="text">
                        Отмена
                    </Button>
                    <Button onClick={this.handleSave}
                            variant="contained"
                            disabled={selectedTrainingModules.length === 0}
                            color="primary">
                        Добавить
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default connect(withStyles(styles)(AddTrainingModuleModal));
