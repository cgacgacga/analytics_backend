import React, {ReactText} from 'react';
import get from 'lodash/get';
import {withRouter} from "react-router-dom";
import Scrollbars from "react-custom-scrollbars";
import {Link} from "react-router-dom";

import Typography from '@material-ui/core/Typography';

import {BlocksOfWorkProgramsFields, ModuleFields} from "../../enum";
import {DetailTrainingModuleProps} from './types';

import connect from './DetailTrainingModule.connect';
import WPBlockCreateModal from "../../Detail/WPBlockCreateModal";
import TextField from "@material-ui/core/TextField";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Button from "@material-ui/core/Button";
import withStyles from '@material-ui/core/styles/withStyles';
import TableBody from "@material-ui/core/TableBody";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/DeleteOutlined";
import EditIcon from "@material-ui/icons/EditOutlined";
import Paper from "@material-ui/core/Paper";
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';

import ConfirmDialog from "../../../../components/ConfirmDialog/ConfirmDialog";

import {WorkProgramGeneralFields} from "../../../WorkProgram/enum";
import {OPTIONALLY, typeOfWorkProgramInPlan} from "../../data";
import {appRouter} from "../../../../service/router-service";
import {BlocksOfWorkProgramsType} from "../../types";

import styles from './DetailTrainingModule.styles';
import LikeButton from "../../../../components/LikeButton/LikeButton";
import {FavoriteType} from "../../../Profile/Folders/enum";
import Chip from "@material-ui/core/Chip";
import {getUserFullName} from "../../../../common/utils";
import AddIcon from "@material-ui/icons/Add";
import {UserType} from "../../../../layout/types";
import UserSelector from "../../../Profile/UserSelector/UserSelector";
import Dialog from "@material-ui/core/Dialog";
import {fields, StepsEnum, TrainingModuleFields} from "../enum";
import {selectRulesArray, steps} from "../constants";
import StepButton from "@material-ui/core/StepButton";
import TrainingModuleCreateModal from "../TrainingModuleCreateModal/TrainingModuleCreateModal";
import SimpleSelector from "../../../../components/SimpleSelector/SimpleSelector";
import EvaluationTools from '../EvaluationTools'
import AddEducationalProgramModal from "../AddEducationalProgramModal/AddEducationalProgramModal";
import AddTrainingModuleModal from "../AddTrainingModuleModal/AddTrainingModuleModal";
import {TrainingModuleType} from "../types";
import {BACHELOR_QUALIFICATION, specializationObject} from "../../../WorkProgram/constants";
import {Checkbox, FormControlLabel} from "@material-ui/core";

class DetailTrainingModule extends React.Component<DetailTrainingModuleProps> {
  state = {
    deleteBlockConfirmId: null,
    deletedWorkProgramsLength: 0,
    addEditorsMode: false,
    activeStep: StepsEnum.GENERAL,
    description: this.props.module[TrainingModuleFields.DESCRIPTION],
    selectionParameter: this.props.module[TrainingModuleFields.SELECTION_PARAMETER],
  }

  componentDidMount() {
    this.props.actions.getTrainingModule(this.getModuleId());
  }

  componentWillUnmount() {
    this.props.actions.trainingModulesPageDown();
  }

  componentDidUpdate(prevProps: DetailTrainingModuleProps, nextProps: any) {
    if (prevProps.module !== this.props.module) {
      this.setState({
        description: this.props.module[TrainingModuleFields.DESCRIPTION],
        selectionParameter: this.props.module[TrainingModuleFields.SELECTION_PARAMETER],
      })
    }
  }

  handleCreateNewWPBlock = (moduleId: number) => () => {
    this.props.educationPlansActions.createBlockOfWorkPrograms(moduleId);
  }

  handleCreateNewModule = () => {
    this.props.actions.openDialog({
      dialog: fields.CREATE_TRAINING_MODULE_DIALOG
    });
  }

  openAddEducationalProgramModal = () => {
    this.props.actions.openDialog({
      dialog: fields.ADD_EDUCATIONAL_PROGRAM_DIALOG
    });
  }

  handleAddNewModule = (id: number, modules: Array<TrainingModuleType>) => () => {
    this.props.actions.openDialog({
      data: {
        moduleId: id,
        trainingModules: modules?.map((module) => module.id)
      },
      dialog: fields.ADD_TRAINING_MODULE_DIALOG
    });
  }

  removeFatherFromModule = (removedId: number, allChild: any, fatherId: number) => () => {
    this.props.actions.updateChildModules({
      //@ts-ignore
      trainingModules: allChild.map((item) => item.id).filter(item => item !== removedId),
      moduleId: fatherId,
    })
  }

  getModuleId = () => get(this.props.match.params, 'id');

  handleConfirmBlockDeleteDialog = () => {
    const {deleteBlockConfirmId} = this.state;

    this.props.educationPlansActions.deleteBlockOfWorkPrograms(deleteBlockConfirmId);
    this.closeConfirmDeleteDialog();
  }

  closeConfirmDeleteDialog = () => {
    this.setState({
      deleteBlockConfirmId: null,
      deletedWorkProgramsLength: 0,
    });
  }

  handleClickBlockDelete = (id: number, length: number) => () => {
    this.setState({
      deleteBlockConfirmId: id,
      deletedWorkProgramsLength: length
    });
  }

  handleOpenDetailModal = (block: BlocksOfWorkProgramsType | {}) => () => {
    this.props.educationPlansActions.openDetailDialog({
      ...block,
      moduleId: this.getModuleId()
    });
  }

  handleClickLike = () => {
    const {moduleRating, moduleRatingId} = this.props;
    const moduleId = this.getModuleId();

    if (moduleRating) {
      this.props.foldersActions.removeFromFolder({
        id: moduleRatingId,
        callback: this.props.actions.getTrainingModule,
        type: FavoriteType.MODULES,
        relationId: moduleId
      });
    } else {
      this.props.foldersActions.openAddToFolderDialog({
        relationId: moduleId,
        type: FavoriteType.MODULES,
        callback: this.props.actions.getTrainingModule,
      });
    }
  }

  handleAddingEditor = (userId: number) => {
    const module = this.props.module;
    const newEditorIds = module[TrainingModuleFields.EDITORS].map((editor: UserType) => editor.id).concat(userId);

    this.props.actions.changeEditorList({
      data: {
        [TrainingModuleFields.ID]: module[TrainingModuleFields.ID],
        [TrainingModuleFields.EDITORS]: newEditorIds,
      }
    });

    this.setState({
      addEditorsMode: false
    });
  }

  handleDeletingEditor = (userId: number) => () => {
    const module = this.props.module;
    const newEditorIds = module[TrainingModuleFields.EDITORS]
      .map((editor: UserType) => editor.id)
      .filter((editorId: number) => editorId !== userId);

    this.props.actions.changeEditorList({
      data: {
        [TrainingModuleFields.ID]: module[TrainingModuleFields.ID],
        [TrainingModuleFields.EDITORS]: newEditorIds,
      }
    });
  }

  renderBlockOfWP = (blockOfWorkPrograms: any, level: number) => {
    const {classes, canEdit} = this.props

      return (
        <>
          {blockOfWorkPrograms?.map((blockOfWorkProgram: any) => {
            const workPrograms = get(blockOfWorkProgram, BlocksOfWorkProgramsFields.WORK_PROGRAMS);
            const gia = blockOfWorkProgram?.gia || [];
            const practice = blockOfWorkProgram?.practice || [];
            const semesterStart = blockOfWorkProgram?.[BlocksOfWorkProgramsFields.SEMESTER_START]?.join(', ');
            const type = blockOfWorkProgram[BlocksOfWorkProgramsFields.TYPE]
            const semesterStartArr = blockOfWorkProgram?.semester_start
            const qualification = blockOfWorkProgram?.work_program?.[0]?.qualification

            const renderRow = (title: any, itemsArray: Array<any>) => {
              const duration = itemsArray?.[0]?.number_of_semesters;

              const allCreditUnits = itemsArray?.[0]?.ze_v_sem;
              const creditUnitsArray = allCreditUnits?.split(', ')
              // @ts-ignore
              const indexFirstNumber1 = creditUnitsArray?.findIndex((item: number) => +item !== 0)
              const withoutZero1 = creditUnitsArray?.slice(indexFirstNumber1, creditUnitsArray.length)
              const withoutZero1Reverse = withoutZero1?.reverse()
              // @ts-ignore
              const indexFirstNumber2 = withoutZero1Reverse?.findIndex((item: number) => +item !== 0)
              const withoutZero2 = withoutZero1?.slice(indexFirstNumber2, withoutZero1.length)

              const creditUnits = withoutZero2?.reverse()?.join(' ')

              const semesterAvailableCount = qualification === BACHELOR_QUALIFICATION ? 9 : 5;
              const hasSemesterError = semesterStartArr.some((item: any) => ((item + duration) > semesterAvailableCount));

              return (
                <TableRow key={blockOfWorkProgram[BlocksOfWorkProgramsFields.ID]}>
                  <TableCell>
                    <div style={{ paddingLeft: (level + 1) * 5 }}>
                      {title}
                    </div>
                  </TableCell>
                  <TableCell>
                    {hasSemesterError ? (
                      <Tooltip title="Обучение по этой дисциплине выходит за рамки обучения (длительность дисциплины больше допустимой в данном семестре)">
                        <span className={classes.semesterError}>{duration}</span>
                      </Tooltip>
                    ) : duration}
                  </TableCell>
                  <TableCell>
                    {creditUnits}
                  </TableCell>
                  <TableCell>
                    {hasSemesterError ? (
                      <Tooltip title="Обучение по этой дисциплине выходит за рамки обучения (длительность дисциплины больше допустимой в данном семестре)">
                        <span className={classes.semesterError}>
                          {semesterStart}
                        </span>
                      </Tooltip>
                    ) : semesterStart}
                  </TableCell>
                  <TableCell>
                    {type === OPTIONALLY ? '-' : '+'}
                  </TableCell>
                  {canEdit &&
                    <TableCell className={classes.actions}>
                      {level === -1 &&
                        <>
                          <Tooltip
                            title={`Удалить ${get(workPrograms, 'length', 0) > 1 ? 'комплект рабочих программ' : 'рабочую программу'}`}>
                            <DeleteIcon className={classes.deleteIcon}
                                        onClick={this.handleClickBlockDelete(blockOfWorkProgram[BlocksOfWorkProgramsFields.ID], get(workPrograms, 'length', 0))}
                            />
                          </Tooltip>
                          <Tooltip
                            title={`Изменить ${get(workPrograms, 'length', 0) > 1 ? 'комплект рабочих программ' : 'рабочую программу'}`}>
                            <EditIcon
                                onClick={this.handleOpenDetailModal(blockOfWorkProgram)}/>
                          </Tooltip>
                        </>
                      }
                    </TableCell>
                  }
                </TableRow>
              )
            }

            return (
              <>
                {Boolean(workPrograms?.length) && renderRow(workPrograms.map((workProgram: any) =>
                    <div className={classes.displayFlex}>
                      <Link className={classes.workProgramLink}
                            to={appRouter.getWorkProgramLink(workProgram[WorkProgramGeneralFields.ID])}
                            target="_blank"
                      >
                        {workProgram[WorkProgramGeneralFields.TITLE]}
                      </Link>
                    </div>
                ), workPrograms)}
                {Boolean(gia?.length) && renderRow(gia.map((gia: any) =>
                  <div className={classes.displayFlex}>
                    <Link className={classes.workProgramLink}
                          to={appRouter.getFinalCertificationLink(gia[WorkProgramGeneralFields.ID])}
                          target="_blank"
                    >
                      {gia[WorkProgramGeneralFields.TITLE]}
                    </Link>
                  </div>
                ), gia)}
                {Boolean(practice?.length) && renderRow(practice.map((practice: any) =>
                  <div className={classes.displayFlex}>
                    <Link className={classes.workProgramLink}
                          to={appRouter.getPracticeLink(practice[WorkProgramGeneralFields.ID])}
                          target="_blank"
                    >
                      {practice[WorkProgramGeneralFields.TITLE]}
                    </Link>
                  </div>
                ), practice)}
              </>
            )
          })}
        </>
      )
  }

  renderModule = (item: any, level: number, allChild: any, fatherId: number): any => {
    const {classes, canEdit} = this.props
    const blockOfWorkPrograms = item?.change_blocks_of_work_programs_in_modules

    return(
      <>
        <TableRow>
          <TableCell  style={{ height: '40px'}} rowSpan={2} colSpan={canEdit ? 3 : 2} className={classes.moduleNameWrap}>
            <Link className={classes.workProgramLink}
                  to={appRouter.getTrainingModuleDetailLink(item?.[WorkProgramGeneralFields.ID])}
                  target="_blank"
            >
              <Typography className={classes.moduleName} style={{ paddingLeft: level * 5 }}>
                {'*'.repeat(level)}
                {item?.name}
              </Typography>
            </Link>

          </TableCell>
          <TableCell />
          <TableCell />
          <TableCell />
          <TableCell />
          {canEdit && (
            <TableCell style={{ height: '40px'}}>
              <div className={classes.moduleButtons}>
                {/*{item?.childs?.length === 0 && level === 0 ? (*/}
                {/*    <Button size="small" onClick={this.handleCreateNewWPBlock(item.id)}>*/}
                {/*      <AddIcon/> РПД*/}
                {/*    </Button>*/}
                {/*  ) : <></>*/}
                {/*}*/}
                {/*{blockOfWorkPrograms?.length === 0 && level === 0 ? (*/}
                {/*    <Button size="small" onClick={this.handleAddNewModule(item.id, item?.childs)}>*/}
                {/*      <AddIcon/> Модуль*/}
                {/*    </Button>*/}
                {/*  ) : <></>*/}
                {/*}*/}
                {level === 0 ? (
                  <Tooltip
                    title={`Открепить модуль`}>
                    <DeleteIcon className={classes.deleteIcon}
                                onClick={this.removeFatherFromModule(item.id, allChild, fatherId)}
                                style={{
                                  marginRight: '28px',
                                  marginTop: '5px',
                                  marginLeft: 'auto',
                                }}
                    />
                  </Tooltip>
                ) : <></>}
              </div>
            </TableCell>
          )}
        </TableRow>
        {this.renderBlockOfWP(blockOfWorkPrograms, level)}
        {item?.childs?.map((child: any) => (
          this.renderModule(child, level + 1, item?.childs, item.id)
        ))}
      </>
    )
  }

  updateTrainingModuleField = (field: string) => (e: React.ChangeEvent) => {
    this.props.actions.changeTrainingModule({
      data: {
        [field]: get(e, 'target.value'),
        id: this.props.module?.id
      }
    })
  }

  updateOnlyForStructUnitsField = (e: React.ChangeEvent) => {
    this.props.actions.changeTrainingModule({
      data: {
        [TrainingModuleFields.ONLY_FOR_STRUCT_UNITS]: get(e, 'target.checked'),
        id: this.props.module?.id
      }
    })
  }

  updateSelectRule = (value: ReactText) => {
    this.props.actions.changeTrainingModule({
      data: {
        [TrainingModuleFields.SELECTION_RULE]: value,
        id: this.props.module?.id
      }
    })
  }

  renderModules = () => {
    const {classes, module, canEdit} = this.props
    return (
      <>
        <Scrollbars style={{height: 'calc(100vh - 400px)'}}>
          <div className={classes.tableWrap}>
            <Table stickyHeader size='small'>
              <TableHead className={classes.header}>
                <TableRow>
                  <TableCell>
                    Модуль/РПД
                  </TableCell>
                  <TableCell> Длительность </TableCell>
                  <TableCell> Зачетные единицы </TableCell>
                  <TableCell> Семестр начала </TableCell>
                  <TableCell> Обязательность </TableCell>
                  {canEdit && <TableCell/>}
                </TableRow>
              </TableHead>
              <TableBody>
                {module?.childs?.map((item: any) => this.renderModule(item, 0, module?.childs, module?.id))}
                {this.renderBlockOfWP(module?.change_blocks_of_work_programs_in_modules, -1)}
              </TableBody>
            </Table>
          </div>
        </Scrollbars>
        <div className={classes.createModuleButtonWrap}>
          {canEdit && <Button onClick={this.handleCreateNewModule} variant="outlined">
            <AddIcon/>
            Создать модуль
          </Button>}
          {canEdit && Boolean(!module?.change_blocks_of_work_programs_in_modules?.length) && <Button onClick={this.handleAddNewModule(module.id, module?.childs)} variant="outlined" style={{marginRight: 10}}>
            <AddIcon/>
            Добавить модуль
          </Button>}
          {canEdit && Boolean(!module?.childs?.length) && <Button onClick={this.handleCreateNewWPBlock(module.id)} variant="outlined">
            <AddIcon/>
            Добавить рабочую программу
          </Button>}
        </div>
      </>
    )
  }

  renderGeneral = () => {
    const {module, classes, canEdit} = this.props
    if (!module?.id) return <></>

    const onlyForStrucUnit = module?.[TrainingModuleFields.ONLY_FOR_STRUCT_UNITS]

    return (
      <>
        <div className={classes.editors}>
          <Typography className={classes.editorsTitle}>
            Редакторы:
          </Typography>

          {module?.editors?.map((editor: UserType) =>
            <Chip
              key={editor.id}
              label={getUserFullName(editor)}
              onDelete={canEdit ? this.handleDeletingEditor(editor.id) : undefined}
              className={classes.editorsItem}
            />
          )}
          {module?.editors?.length === 0 && <Typography>ни одного редактора не добавлено</Typography>}

          {canEdit && (
            <Button
              onClick={() => this.setState({addEditorsMode: true})}
              variant="outlined"
              className={classes.editorsAdd}
              size="small"
            >
              <AddIcon/> Добавить редактора
            </Button>
          )}
        </div>

        <>
          <Typography className={classes.textInfo}>
            ID конструктора КОП: <b>{module?.[TrainingModuleFields.ID]}</b>
            {module?.[TrainingModuleFields.ISU_ID] && <><br/> ISU id: <b>{module?.[TrainingModuleFields.ISU_ID]}</b></>}
          </Typography>

          {canEdit ? (
            onlyForStrucUnit !== undefined ? (
              <FormControlLabel
                control={<Checkbox checked={onlyForStrucUnit} onChange={this.updateOnlyForStructUnitsField} />}
                label="Использовать только сотрудниками подразделений, в которых работают редакторы данного модуля."
                className={classes.checkbox}
              />
            ) : null)
            : onlyForStrucUnit ? (
              <Typography className={classes.textInfo}>
                Использовать только сотрудниками подразделений, в которых работают редакторы данного модуля
              </Typography>
            ) : null
          }

          {canEdit ? <TextField variant="outlined"
                     label="Описание"
                     value={this.state.description}
                     onChange={(e) => this.setState({ description: e.target.value })}
                     onBlur={this.updateTrainingModuleField(TrainingModuleFields.DESCRIPTION)}
                     className={classes.textField}
                     InputLabelProps={{
                       shrink: true,
                     }}
                     disabled={!canEdit}
          /> : (
            <Typography className={classes.textInfo}>
              <b>Описание:</b> {module?.[TrainingModuleFields.DESCRIPTION]}
            </Typography>
          )}
          {canEdit ? (
            <SimpleSelector label="Правило выбора"
              value={module?.[TrainingModuleFields.SELECTION_RULE]}
              onChange={this.updateSelectRule}
              metaList={selectRulesArray}
              wrapClass={classes.selectorWrap}
            />
          ) : (
            <Typography className={classes.textInfo}>
              <b>Правило выбора:</b> {selectRulesArray.find((item) => item.value === module?.[TrainingModuleFields.SELECTION_RULE])?.label}
            </Typography>
          )}

          {canEdit ? <TextField variant="outlined"
                       label="Параметр выбора"
                       value={this.state.selectionParameter}
                       onChange={(e) => this.setState({ selectionParameter: e.target.value })}
                       onBlur={this.updateTrainingModuleField(TrainingModuleFields.SELECTION_PARAMETER)}
                       className={classes.textField}
                       InputLabelProps={{
                         shrink: true,
                       }}
                       type="number"
                       disabled={['any_quantity', 'all'].includes(module?.[TrainingModuleFields.SELECTION_RULE])}
          /> : (
            this.state.selectionParameter?.length ? (
              <Typography>
                <b>Параметр выбора:</b> {this.state.selectionParameter}
              </Typography>
            ) : null
          )}

          {canEdit && this.state.selectionParameter?.length === 0 && !['any_quantity', 'all'].includes(module?.[TrainingModuleFields.SELECTION_RULE]) ? (
            <Typography className={classes.errorBlock}>
              Параметр выбора обязателен для заполнения
            </Typography>
          ) : null}
        </>
      </>
    )
  }

  handleDeleteEducationalProgram = (id: number) => () => {
    const {module} = this.props
    this.props.actions.changeTrainingModuleEducationalPrograms({
      educationalPrograms: module?.educational_programs_to_access?.map((item: any) => item.id).filter((item: any) => item !== id)
    });
  }

  renderPlans = () => {
    const {classes, module, canEdit} = this.props

    return (
      <>
        <div className={classes.plansTitle}>
          <Typography className={classes.subTitle}>
            {steps[StepsEnum.PLANS]}
          </Typography>
        </div>
        <Scrollbars style={{height: 'calc(100vh - 400px)'}}>
          <Table stickyHeader>
            <TableHead style={{height: 45}}>
              <TableRow>
                <TableCell className={classes.header}>Образовательная программа</TableCell>
                <TableCell className={classes.header}>Номер</TableCell>
                <TableCell className={classes.header}>Уровень</TableCell>
                <TableCell className={classes.header}>Год набора</TableCell>
                <TableCell className={classes.header}>Включен в эту ОП</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {module?.educational_programs_to_access?.map((plan: any) => (
                <TableRow>
                  <TableCell>
                    {get(plan, 'title')}
                  </TableCell>
                  <TableCell>
                    {get(plan, 'field_of_study.0.number')}
                  </TableCell>
                  <TableCell>
                    {specializationObject[get(plan, 'field_of_study.0.qualification', '')]}
                  </TableCell>
                  <TableCell>
                    {get(plan, 'year')}
                  </TableCell>
                  <TableCell>
                    {get(plan, 'is_included') ? 'Включен' : 'Не включен'}
                  </TableCell>
                  <TableCell>
                    {canEdit && <Tooltip
                      title={'Удалить образовательную программу'}>
                      <DeleteIcon className={classes.deleteIcon}
                                  onClick={this.handleDeleteEducationalProgram(plan.id)}
                      />
                    </Tooltip>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Scrollbars>
        {canEdit && <div className={classes.addEducationalProgramButtonWrap}>
          <Button onClick={this.openAddEducationalProgramModal} variant="outlined">
            Добавить образовательную программу
          </Button>
        </div>}
      </>
    )
  }

  renderContent = () => {
    const {activeStep} = this.state

    switch (activeStep) {
      case StepsEnum.GENERAL:
        return this.renderGeneral()
      case StepsEnum.MODULES:
        return this.renderModules()
      case StepsEnum.PLANS:
        return this.renderPlans()
      case StepsEnum.EVALUATION_TOOLS:
        return <EvaluationTools />
    }
  }

  render() {
    const {module, classes, moduleRating} = this.props;
    const {deleteBlockConfirmId, deletedWorkProgramsLength, addEditorsMode, activeStep} = this.state;

    return (
      <div className={classes.wrap}>
        <Paper className={classes.root}>
          <Stepper activeStep={activeStep}
                   orientation="vertical"
                   nonLinear
                   className={classes.stepper}
          >
            {Object.keys(steps).map((key) => (
              <Step key={key} onClick={() => this.setState({activeStep: parseInt(key)})}>
                <StepButton completed={false}
                            style={{textAlign: 'left',}}
                            key={key}
                >{/*
                                                // @ts-ignore*/}
                  {steps[parseInt(key)]}
                </StepButton>
              </Step>
            ))}
          </Stepper>

          <div className={classes.content}>
            <div className={classes.title}>
              <Typography> {get(module, ModuleFields.NAME, '')} </Typography>
              <LikeButton onClick={this.handleClickLike}
                          isLiked={moduleRating}
              />
            </div>
            {this.renderContent()}
          </div>

          <ConfirmDialog onConfirm={this.handleConfirmBlockDeleteDialog}
                         onDismiss={this.closeConfirmDeleteDialog}
                         confirmText={`Вы точно уверены, что хотите ${deletedWorkProgramsLength > 1 ? 'комлект рабочих программ' : 'рабочую программу'}?`}
                         isOpen={Boolean(deleteBlockConfirmId)}
                         dialogTitle={`Удалить ${deletedWorkProgramsLength > 1 ? 'комплект рабочих программ' : 'рабочую программу'}`}
                         confirmButtonText={'Удалить'}
          />

          <WPBlockCreateModal disableZUN
                              moduleId={this.getModuleId()}
          />

          {addEditorsMode && (
            <Dialog
              open
              fullWidth
              maxWidth="sm"
              classes={{
                paper: classes.dialog,
              }}
              onClose={() => this.setState({addEditorsMode: false})}
            >
              <UserSelector
                handleChange={this.handleAddingEditor}
                selectorLabel="Выберите редактора"
                label="Выберите редактора"
                noMargin
              />
            </Dialog>
          )}
        </Paper>

        <TrainingModuleCreateModal/>
        {module?.id && <AddTrainingModuleModal />}
        <AddEducationalProgramModal />
      </div>
    );
  }
}

export default connect(withStyles(styles)(withRouter(DetailTrainingModule)));
