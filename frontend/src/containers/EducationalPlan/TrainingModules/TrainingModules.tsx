import React, {SyntheticEvent} from 'react';
import Scrollbars from "react-custom-scrollbars";
import get from 'lodash/get';

import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import withStyles from '@material-ui/core/styles/withStyles';
import TableBody from "@material-ui/core/TableBody";
import DeleteIcon from "@material-ui/icons/DeleteOutlined";
import EditIcon from "@material-ui/icons/EditOutlined";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import EyeIcon from "@material-ui/icons/VisibilityOutlined";

import ConfirmDialog from "../../../components/ConfirmDialog/ConfirmDialog";
import SortingButton from "../../../components/SortingButton";
import Search from "../../../components/Search";
import {SortingType} from "../../../components/SortingButton/types";
import TableSettingsMenu from "../../../components/TableSettingsMenu/TableSettingsMenu";
import CustomizeExpansionPanel from "../../../components/CustomizeExpansionPanel";
import {getUserFullName, parseJwt} from "../../../common/utils";

import {DirectionFields} from "../../Direction/enum";
import {DirectionType} from "../../Direction/types";

import TrainingModuleCreateModal from "./TrainingModuleCreateModal";

import {appRouter} from "../../../service/router-service";
import UserService from "../../../service/user-service";

import {TrainingModulesProps, TrainingModuleType} from './types';
import {fields, TrainingModuleFields} from "./enum";
import {typesListObject} from './constants';

import connect from './TrainingModules.connect';
import styles from './TrainingModules.styles';

import Filters from "./Filters";
import Switch from "@material-ui/core/Switch";
import {withRouter} from "react-router-dom";

const userService = UserService.factory();

class TrainingModules extends React.Component<TrainingModulesProps> {
    state = {
        anchorsEl: {},
        deleteConfirmId: null,
    }

    componentDidMount() {
        this.props.actions.getTrainingModulesList();
    }

    componentWillUnmount() {
        this.props.actions.trainingModulesPageDown();
    }

    componentDidUpdate(prevProps: TrainingModulesProps) {
        if (prevProps.trainingModuleIdForRedirect !== this.props.trainingModuleIdForRedirect && this.props.trainingModuleIdForRedirect) {
            this.goToTrainingModule()
        }
    }

    goToTrainingModule = () => {
        // @ts-ignore
        const {history, trainingModuleIdForRedirect} = this.props;

        this.props.actions.setTrainingModuleIdForRedirect(null)
        history.push(appRouter.getTrainingModuleDetailLink(trainingModuleIdForRedirect));
    }

    handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
        this.props.actions.changeCurrentPage(page + 1);
        this.props.actions.getTrainingModulesList();
    }

    changeSorting = (field: string) => (mode: SortingType) => {
        this.props.actions.changeSorting({field: mode === '' ? '' : field, mode});
        this.props.actions.getTrainingModulesList();
    }

    handleChangeSearchQuery = (search: string) => {
        this.props.actions.changeSearchQuery(search);
        this.props.actions.changeCurrentPage(1);
        this.props.actions.getTrainingModulesList();
    }

    handleMenu = (id: number) => (event: SyntheticEvent): void => {
        this.setState({
            anchorsEl: {
                [id]: event.currentTarget
            }
        });
    };

    handleCloseMenu = () => {
        this.setState({anchorsEl: {}});
    };

    handleConfirmDeleteDialog = () => {
        this.props.actions.deleteTrainingModule(this.state.deleteConfirmId);

        this.closeConfirmDeleteDialog();
    }

    closeConfirmDeleteDialog = () => {
        this.setState({
            deleteConfirmId: null
        });
    }

    handleClickDelete = (id: number) => () => {
        this.setState({
            deleteConfirmId: id
        });
    }

    handleClickEdit = (trainingModule: TrainingModuleType) => () => {
        this.props.actions.openDialog({
            data: trainingModule,
            dialog: fields.CREATE_TRAINING_MODULE_DIALOG,
        });
        this.handleCloseMenu()
    }

    handleClickCreate = () => {
        this.props.actions.openDialog({
            data: {},
            dialog: fields.CREATE_TRAINING_MODULE_DIALOG
        });
    }

    handleOpenMenu = (id: number) => (event: SyntheticEvent): void => {
        this.setState({
            anchorsEl: {
                [id]: event.currentTarget
            }
        });
    };

    onShowOnlyMyChange = () => {
        const {showOnlyMy} = this.props;

        this.props.actions.showOnlyMy(!showOnlyMy);

        this.props.actions.getTrainingModulesList();
    }

    getMenuItems = (trainingModule: TrainingModuleType) => {
        const accessToken = userService.getToken();

        if (!accessToken) {
            return [];
        }

        const userId: number = parseJwt(accessToken).user_id;
        const menuItems = [
            {
                text: 'Удалить',
                icon: <DeleteIcon />,
                handleClickItem: this.handleClickDelete(trainingModule[TrainingModuleFields.ID])
            },
            {
                text: 'Редактировать',
                icon: <EditIcon />,
                handleClickItem: this.handleClickEdit(trainingModule)
            },
            {
                text: 'Смотреть детально',
                icon: <EyeIcon />,
                link: appRouter.getTrainingModuleDetailLink(trainingModule[TrainingModuleFields.ID])
            }
        ];

        if (!trainingModule.editors.map((editor) => editor.id).includes(userId)) {
            menuItems.splice(1, 1);
        }

        return menuItems;
    }

    render() {
        const {classes, trainingModules, allCount, currentPage, sortingField, sortingMode, canEdit, showOnlyMy} = this.props;
        const {deleteConfirmId, anchorsEl} = this.state;

        return (
            <Paper className={classes.root}>
                <div className={classes.titleWrap}>
                    <Typography className={classes.title}> Образовательные модули </Typography>

                    <Typography className={classes.switch}>
                        <Switch checked={showOnlyMy}
                                onChange={this.onShowOnlyMyChange}
                                color="primary"
                        />
                        Показать только мои модули
                    </Typography>

                    <Search handleChangeSearchQuery={this.handleChangeSearchQuery}/>
                </div>

                <CustomizeExpansionPanel label="Фильтрация" details={<Filters />}/>

                <Scrollbars>
                    <div className={classes.tableWrap}>
                        <Table stickyHeader size='small'>
                            <TableHead className={classes.header}>
                                <TableRow>
                                    <TableCell>
                                        Название
                                        <SortingButton changeMode={this.changeSorting(TrainingModuleFields.NAME)}
                                                       mode={sortingField === TrainingModuleFields.NAME ? sortingMode : ''}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        Тип
                                        <SortingButton changeMode={this.changeSorting(TrainingModuleFields.TYPE)}
                                                       mode={sortingField === TrainingModuleFields.TYPE ? sortingMode : ''}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        КОП ИД
                                    </TableCell>
                                    <TableCell>
                                        ИСУ ИД
                                    </TableCell>
                                    <TableCell>
                                        Редакторы
                                    </TableCell>

                                    {canEdit && <TableCell />}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {trainingModules.map((trainingModule: TrainingModuleType) => {
                                    const profile = get(trainingModule, [TrainingModuleFields.DISCIPLINE, TrainingModuleFields.ACADEMIC_PLAN, TrainingModuleFields.EDUCATIONAL_PROFILE], '');
                                    const plans = get(trainingModule, [TrainingModuleFields.DISCIPLINE, TrainingModuleFields.ACADEMIC_PLAN, TrainingModuleFields.ACADEMIC_PLAN_IN_FIELD_OF_STUDY], []);
                                    // @ts-ignore
                                    const type = typesListObject[trainingModule[TrainingModuleFields.TYPE]];

                                    return (
                                        <TableRow key={trainingModule[TrainingModuleFields.ID]}>
                                            <TableCell>
                                                {trainingModule[TrainingModuleFields.NAME]}
                                            </TableCell>
                                            <TableCell>
                                                {type}
                                            </TableCell>
                                            <TableCell>
                                                {trainingModule[TrainingModuleFields.ID]}
                                            </TableCell>
                                            <TableCell>
                                                {trainingModule[TrainingModuleFields.ISU_ID]}
                                            </TableCell>
                                            <TableCell>
                                                {trainingModule[TrainingModuleFields.EDITORS].map((editor) => getUserFullName(editor)).join(', ')}
                                            </TableCell>
                                            {canEdit &&
                                                <TableCell>
                                                    <TableSettingsMenu
                                                        menuItems={this.getMenuItems(trainingModule)}
                                                        handleOpenMenu={this.handleOpenMenu(trainingModule[TrainingModuleFields.ID])}
                                                        handleCloseMenu={this.handleCloseMenu}
                                                        anchorEl={get(anchorsEl, trainingModule[TrainingModuleFields.ID])}
                                                    />
                                                </TableCell>

                                                // <TableCell className={classes.actions}>
                                                //     <IconButton
                                                //         onClick={this.handleClickDelete(trainingModule[TrainingModuleFields.ID])}>
                                                //         <DeleteIcon/>
                                                //     </IconButton>
                                                //     <IconButton onClick={this.handleClickEdit(trainingModule)}>
                                                //         <EditIcon/>
                                                //     </IconButton>
                                                // </TableCell>
                                            }
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </Scrollbars>


                <div className={classes.footer}>
                    <TablePagination count={allCount}
                                     component="div"
                                     page={currentPage - 1}
                                     rowsPerPageOptions={[]}
                                     onChangePage={this.handleChangePage}
                                     rowsPerPage={10}
                                     onChangeRowsPerPage={()=>{}}
                    />
                    {canEdit &&
                        <Fab color="secondary"
                             classes={{
                                 root: classes.addIcon
                             }}
                             onClick={this.handleClickCreate}
                        >
                            <AddIcon/>
                        </Fab>
                    }
                </div>

                {canEdit &&
                    <>
                        <ConfirmDialog onConfirm={this.handleConfirmDeleteDialog}
                                       onDismiss={this.closeConfirmDeleteDialog}
                                       confirmText={'Вы точно уверены, что хотите удалить учебный модуль?'}
                                       isOpen={Boolean(deleteConfirmId)}
                                       dialogTitle={'Удалить учебнуй модуль'}
                                       confirmButtonText={'Удалить'}
                        />

                        <TrainingModuleCreateModal/>
                    </>
                }
            </Paper>
        );
    }
}

//@ts-ignore
export default connect(withStyles(styles)(withRouter(TrainingModules)));
