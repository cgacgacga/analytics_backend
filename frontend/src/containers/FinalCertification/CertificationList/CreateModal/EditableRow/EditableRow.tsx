import TableCell from "@material-ui/core/TableCell/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField/TextField";
import {EVALUATION_TOOLS} from "./enum";
import React from "react";

import {useStyles} from './EditableRow.styles';
import {EditableRowProps} from "../types";
import {Select} from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import {CertificationFields} from "../../../enum";

function EditableRow(props: EditableRowProps) {
    const classes = useStyles();
    const {section, updateRow, semesterNum} = props;
    const handleChangeField = (field: string) => (e: React.ChangeEvent) => {
        updateRow({
            ...section,
            //@ts-ignore
            [field]: e?.target?.value,
        }, semesterNum);
    };

    const handleEvaluationToolsChange = (e: React.ChangeEvent<any>) => {
        updateRow({
            ...section,
            //@ts-ignore
            [CertificationFields.EVALUATION_TOOLS]: e?.target?.value,
        }, semesterNum);
    };

    return (
        <TableRow>
            <TableCell className={classes.centerCell}>
                <TextField
                    variant="outlined"
                    size="small"
                    defaultValue={section[CertificationFields.ZE_V_SEM]}
                    className={classes.smallInput}
                    type="number"
                    onChange={handleChangeField(CertificationFields.ZE_V_SEM)}
                />
            </TableCell>
            <TableCell className={classes.centerCell}>
                <Select disabled value={section[CertificationFields.EVALUATION_TOOLS]} placeholder="Оценочное средство" onChange={handleEvaluationToolsChange} fullWidth multiple>
                    {EVALUATION_TOOLS.map(item =>
                        <MenuItem value={item.value} key={`group-${item.value}`}>
                            {item.label}
                        </MenuItem>
                    )}
                </Select>
            </TableCell>
        </TableRow>
    );
}

export default EditableRow;
