import React from 'react';
import get from "lodash/get";
import {shallowEqual} from "recompose";
import classNames from 'classnames';

import {CreateModalProps} from './types';

import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from "@material-ui/core/TextField";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import AppBar from "@material-ui/core/AppBar";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import {AutoSizer} from "react-virtualized";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import QuestionIcon from "@material-ui/icons/HelpOutline";
import Tooltip from "@material-ui/core/Tooltip";
import CKEditor from '../../../../components/CKEditor'
import { types } from '../constants'

import {
    EvaluationToolFields,
    fields, IntermediateCertificationFields,
    workProgramSectionFields,
} from '../../enum';

import connect from './CreateModal.connect';
import styles from './CreateModal.styles';

class CreateModal extends React.PureComponent<CreateModalProps> {
    editor = null;

    state = {
        isOpen: false,
        showErrors: false,
        evaluationTool: {
            [EvaluationToolFields.ID]: null,
            [EvaluationToolFields.DESCRIPTION]: '',
            [EvaluationToolFields.SECTIONS]: [],
            [EvaluationToolFields.MIN]: undefined,
            [EvaluationToolFields.NAME]: '',
            [EvaluationToolFields.MAX]: undefined,
            [EvaluationToolFields.TYPE]: '',
            [EvaluationToolFields.DEADLINE]: 1,
            [EvaluationToolFields.CHECK_POINT]: false,
            [EvaluationToolFields.SEMESTER]: '1',
        }
    };

    componentDidUpdate(prevProps: Readonly<CreateModalProps>, prevState: Readonly<{}>, snapshot?: any) {
        const {evaluationTool} = this.props;

        if (!shallowEqual(this.props, prevProps)){
            this.setState({
                isOpen: this.props.isOpen,
                evaluationTool: {
                    [EvaluationToolFields.ID]: get(evaluationTool, EvaluationToolFields.ID, null),
                    [EvaluationToolFields.NAME]: get(evaluationTool, EvaluationToolFields.NAME, ''),
                    [EvaluationToolFields.DESCRIPTION]: get(evaluationTool, EvaluationToolFields.DESCRIPTION, ''),
                    //@ts-ignore
                    [EvaluationToolFields.SECTIONS]: get(evaluationTool, EvaluationToolFields.SECTIONS, []).map(item => item[workProgramSectionFields.ID]),
                    [EvaluationToolFields.MIN]: get(evaluationTool, EvaluationToolFields.MIN, undefined),
                    [EvaluationToolFields.MAX]: get(evaluationTool, EvaluationToolFields.MAX, undefined),
                    [EvaluationToolFields.DEADLINE]: get(evaluationTool, EvaluationToolFields.DEADLINE, 1),
                    [EvaluationToolFields.TYPE]: get(evaluationTool, EvaluationToolFields.TYPE, ''),
                    [EvaluationToolFields.CHECK_POINT]: get(evaluationTool, EvaluationToolFields.CHECK_POINT, false),
                    [EvaluationToolFields.SEMESTER]: get(evaluationTool, EvaluationToolFields.SEMESTER, '1'),
                }
            });
        }
    }

    handleClose = () => {
        this.props.actions.closeDialog(fields.CREATE_NEW_EVALUATION_TOOLS);
        this.setState({ showErrors: false })
    }

    handleSave = () => {
        const {evaluationTool} = this.state;

        const disableSave = get(evaluationTool, [EvaluationToolFields.NAME, 'length'], 0) === 0
                            || get(evaluationTool, [EvaluationToolFields.DESCRIPTION, 'length'], 0) === 0
                            || get(evaluationTool, [EvaluationToolFields.SECTIONS, 'length'], 0) === 0
                            || get(evaluationTool, [EvaluationToolFields.TYPE, 'length'], 0) === 0
        ;
        if (evaluationTool[EvaluationToolFields.ID]){
            this.setState({ showErrors: false });
            this.props.actions.changeEvaluationTool(evaluationTool);
        } else if (!disableSave){
            this.setState({ showErrors: false });
            this.props.actions.addEvaluationTool(evaluationTool);
        } else if (disableSave) {
            this.setState({ showErrors: true })
        }
    }

    saveField = (field: string) => (e: React.ChangeEvent) => {
        const {evaluationTool} = this.state;

        this.setState({
            evaluationTool: {
                ...evaluationTool,
                [field]: get(e, 'target.value')
            }
        })
    }

    saveMinMaxField = (field: string) => (e: React.ChangeEvent) => {
        const {evaluationTool} = this.state;
        const value = get(e, 'target.value')

        this.setState({
            evaluationTool: {
                ...evaluationTool,
                [field]: value.length > 0 ? value : undefined
            }
        })
    }

    changeDeadline = (e: any, value: number | number[]) => {
        const {evaluationTool} = this.state;

        this.setState({
            evaluationTool: {
                ...evaluationTool,
                [EvaluationToolFields.DEADLINE]: value
            }
        })
    }

    changeCheckPoint = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        const {evaluationTool} = this.state;

        this.setState({
            evaluationTool: {
                ...evaluationTool,
                [EvaluationToolFields.CHECK_POINT]: checked
            }
        })
    }

    changeDescription = (event: any) => {
        const {evaluationTool} = this.state;
        const data = event.editor.getData();

        this.setState({
            evaluationTool: {
                ...evaluationTool,
                [EvaluationToolFields.DESCRIPTION]: data
            }
        })
    }
    hasError = (field: string) => {
        const { showErrors, evaluationTool } = this.state;
        return showErrors && get(evaluationTool, [field, 'length'], 0) === 0
    }

    changeSemesterCount = (e: React.ChangeEvent<{}>, value: number | number[]) => {
        const {evaluationTool} = this.state;

        this.setState({
            evaluationTool: {
                ...evaluationTool,
                [EvaluationToolFields.SEMESTER]: value
            }
        })
    }

    render() {
        const {classes, sections, semesterCount} = this.props;
        const {evaluationTool, isOpen} = this.state;

        const isEditMode = Boolean(evaluationTool[EvaluationToolFields.ID]);
        if (!isOpen) return <></>

        return (
            <div className={classNames(classes.dialog, {[classes.openDialog]: isOpen})}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={this.handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            {isEditMode ? 'Редактировать' : 'Создать'} оценочное средство
                        </Typography>
                        <Button autoFocus
                                color="inherit"
                                onClick={this.handleSave}
                                // disabled={disableButton}
                                classes={{
                                    disabled: classes.disabledButton
                                }}
                        >
                            Сохранить
                        </Button>
                    </Toolbar>
                </AppBar>

                <DialogContent className={classes.dialogContent}>
                    {isOpen &&
                        <>
                            <div className={classes.leftSide}>
                                <AutoSizer style={{width: '100%'}}>
                                    {({width}) => (
                                        <>
                                            <TextField label="Название оценочного средства *"
                                                       onChange={this.saveField(EvaluationToolFields.NAME)}
                                                       variant="outlined"
                                                       className={classNames(classes.input, classes.marginBottom30, classes.nameInput)}
                                                       fullWidth
                                                       InputLabelProps={{
                                                           shrink: true,
                                                       }}
                                                       error={this.hasError(EvaluationToolFields.NAME)}
                                                       value={evaluationTool[EvaluationToolFields.NAME]}
                                            />

                                            <FormControl error={this.hasError(EvaluationToolFields.SECTIONS)} className={classes.sectionSelector}>
                                                <InputLabel shrink id="section-label">
                                                    Раздел *
                                                </InputLabel>
                                                <Select
                                                    variant="outlined"
                                                    multiple
                                                    className={classes.selector}
                                                    // @ts-ignore
                                                    onChange={this.saveField(EvaluationToolFields.SECTIONS)}
                                                    value={evaluationTool[EvaluationToolFields.SECTIONS]}
                                                    fullWidth
                                                    displayEmpty
                                                    input={
                                                        <OutlinedInput
                                                            notched
                                                            labelWidth={100}
                                                            name="course"
                                                            id="section-label"
                                                        />
                                                    }
                                                    style={{width: width}}
                                                >
                                                    {sections.map((item: any) =>
                                                        <MenuItem value={item.value} key={`section-${item.value}`}>
                                                            {item.label}
                                                        </MenuItem>
                                                    )}
                                                </Select>
                                            </FormControl>

                                            <FormControl error={this.hasError(EvaluationToolFields.TYPE)} className={classes.typeSelector}>
                                                <InputLabel shrink id="section-label">
                                                    Тип *
                                                </InputLabel>
                                                <Select
                                                    variant="outlined"
                                                    className={classes.selector}
                                                    // @ts-ignore
                                                    onChange={this.saveField(EvaluationToolFields.TYPE)}
                                                    value={evaluationTool[EvaluationToolFields.TYPE]}
                                                    fullWidth
                                                    displayEmpty
                                                    input={
                                                        <OutlinedInput
                                                            notched
                                                            labelWidth={100}
                                                            name="course"
                                                            id="section-label"
                                                        />
                                                    }
                                                    style={{width: width}}
                                                    renderValue={(value = '') => {
                                                        //@ts-ignore
                                                        if (types.includes(value) || value.length === 0){
                                                            return <>{value}</>
                                                        }
                                                        return <>{value} (устаревшее)</>
                                                    }}
                                                >
                                                    {types.map((type: any, index: number) =>
                                                        <MenuItem value={type} key={`type-${index}`}>
                                                            {type}
                                                        </MenuItem>
                                                    )}
                                                </Select>
                                            </FormControl>
                                            <div className={classNames(classes.row, classes.marginBottom30)}>
                                                <TextField label="Минимальное значение"
                                                           onChange={this.saveMinMaxField(EvaluationToolFields.MIN)}
                                                           variant="outlined"
                                                           className={classes.numberInput}
                                                           fullWidth
                                                           InputLabelProps={{
                                                               shrink: true,
                                                           }}
                                                           type="number"
                                                           value={evaluationTool[EvaluationToolFields.MIN]}
                                                />
                                                <TextField label="Максимальное значение"
                                                           onChange={this.saveMinMaxField(EvaluationToolFields.MAX)}
                                                           variant="outlined"
                                                           fullWidth
                                                           InputLabelProps={{
                                                               shrink: true,
                                                           }}
                                                           type="number"
                                                           value={evaluationTool[EvaluationToolFields.MAX]}
                                                />
                                            </div>

                                            <FormControl component="fieldset" style={{ width: '100%'}}>
                                                <FormLabel component="legend" style={{ marginBottom: '50px' }}>
                                                    Длительность изучения (в семестрах) *
                                                    <Tooltip title="Первый семестр - семестр с которого начинается дисциплина.">
                                                        <QuestionIcon color="primary" className={classes.tooltipIcon}/>
                                                    </Tooltip>
                                                </FormLabel>
                                                <Slider
                                                  defaultValue={1}
                                                  step={1}
                                                  marks
                                                  min={1}
                                                  max={8}
                                                  valueLabelDisplay="on"
                                                  value={parseInt(evaluationTool[EvaluationToolFields.SEMESTER])}
                                                  onChange={this.changeSemesterCount}
                                                />
                                            </FormControl>

                                            <FormControlLabel
                                                control={<Checkbox checked={evaluationTool[EvaluationToolFields.CHECK_POINT]} onChange={this.changeCheckPoint}/>}
                                                label="Ключевая точка"
                                                className={classes.marginBottom30}
                                            />

                                            <div>
                                                <Typography className={classes.weekTitle}>
                                                    Срок контроля в неделях
                                                </Typography>
                                                <Slider
                                                    defaultValue={1}
                                                    step={1}
                                                    marks
                                                    min={0}
                                                    max={20}
                                                    valueLabelDisplay="on"
                                                    value={evaluationTool[EvaluationToolFields.DEADLINE]}
                                                    onChange={this.changeDeadline}
                                                />
                                            </div>
                                        </>
                                    )}
                                </AutoSizer>
                            </div>

                            <div className={classes.rightSide}>
                                <InputLabel className={classes.label}> Описание * </InputLabel>
                                <CKEditor
                                    value={evaluationTool[EvaluationToolFields.DESCRIPTION]
                                            ? evaluationTool[EvaluationToolFields.DESCRIPTION] : ''}
                                    onChange={this.changeDescription}
                                    useFormulas
                                    height="calc(100vh - 280px)"
                                    style={this.hasError(EvaluationToolFields.DESCRIPTION)? {border: '1px solid #d00000'} : {border: '1px solid #d1d1d1'}}
                                />
                            </div>
                        </>
                    }
                </DialogContent>
                <DialogActions className={classes.actions}>
                    <Button onClick={this.handleClose}
                            variant="text">
                        Отмена
                    </Button>

                        <Button onClick={this.handleSave}
                                variant="contained"
                                color="primary">
                            Сохранить
                        </Button>
                </DialogActions>
            </div>
        );
    }
}

export default connect(withStyles(styles)(CreateModal));
