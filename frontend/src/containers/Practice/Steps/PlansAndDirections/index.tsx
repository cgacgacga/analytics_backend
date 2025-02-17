import React from "react";
import {PracticeSteps} from "../../enum";
import connect from "./connect";
import withStyles from "@material-ui/core/styles/withStyles";
import styles from './PlansAndDirections.styles';
import {Typography, WithStyles} from "@material-ui/core";
import {PracticeActions, PracticeState} from "../../types";
import Scrollbars from "react-custom-scrollbars";
import {Link} from "react-router-dom";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody";

import {appRouter} from '../../../../service/router-service';

interface GeneralInfoProps extends WithStyles<typeof styles> {
  actions: PracticeActions;
  fields: PracticeState;
}

class PlansAndDirections extends React.Component<GeneralInfoProps> {
  render() {
    const {classes, fields} = this.props;

    return (
      <div>
        <Typography className={classes.h1} variant='h5'>
          {PracticeSteps.PLANS}
        </Typography>
        <div className={classes.root}>
          <Scrollbars style={{height: 'calc(100vh - 400px)'}}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.header}>Наименования модуля</TableCell>
                  <TableCell className={classes.header}>id модуля</TableCell>
                  <TableCell className={classes.header}>Образовательные программы</TableCell>
                  <TableCell className={classes.header}>Направления</TableCell>
                  <TableCell className={classes.header}>Год набора</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fields.practice_in_change_block.map((plan:any) => {
                  const opList = plan?.discipline_block_module?.descipline_block;

                  if (opList.length === 0) {
                    return (
                      <TableRow>
                        <TableCell>
                          <Link
                            to={appRouter.getTrainingModuleDetailLink(plan?.discipline_block_module?.id)}
                            target="_blank"
                            className={classes.cellLink}
                          >
                            {plan?.discipline_block_module?.name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          {plan?.discipline_block_module?.id}
                        </TableCell>
                        <TableCell />
                        <TableCell />
                        <TableCell />
                      </TableRow>
                    )
                  }

                  return (
                    <>
                      {opList.map((opItem: any, index: number) => (
                        <TableRow>
                          {index === 0 ?
                            <>
                              <TableCell rowSpan={opList.length}>
                                <Link
                                  to={appRouter.getTrainingModuleDetailLink(plan?.discipline_block_module?.id)}
                                  target="_blank"
                                  className={classes.cellLink}
                                >
                                  {plan?.discipline_block_module?.name}
                                </Link>
                              </TableCell>
                              <TableCell rowSpan={opList.length}>
                                {plan?.discipline_block_module?.id}
                              </TableCell>
                            </>
                            : null
                          }
                          <TableCell>
                            <Link
                              to={appRouter.getPlanDetailLink(opItem?.academic_plan?.id)}
                              target="_blank"
                              className={classes.cellLink}
                            >
                              {opItem?.academic_plan?.academic_plan_in_field_of_study[0]?.title}
                            </Link>
                          </TableCell>
                          <TableCell>
                            {opItem?.academic_plan?.academic_plan_in_field_of_study[0]?.field_of_study[0]?.title}
                          </TableCell>
                          <TableCell >
                            {opItem?.academic_plan?.academic_plan_in_field_of_study[0]?.year}
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  )
                })}
              </TableBody>
            </Table>
          </Scrollbars>
        </div>
      </div>
    );
  }
}

export default connect(withStyles(styles)(PlansAndDirections));
