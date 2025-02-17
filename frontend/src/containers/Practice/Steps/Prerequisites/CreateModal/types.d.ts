import {WithStyles} from "@material-ui/core";
import {PrerequisiteType} from '../../types';
import {SelectorListType} from "../../../../components/SearchSelector/types";

import styles from "./CreateModal.styles";
import {TrainingEntitiesActions} from "../../../TrainingEntities/types";
import {SubjectAreaActions} from "../../../SubjectArea/types";
import {PracticeActions} from "../../../types";

export interface CreateModalProps extends WithStyles<typeof styles> {
    actions: PracticeActions;
    trainingEntitiesActions: TrainingEntitiesActions;
    subjectAreaActions: SubjectAreaActions;
    isOpen: boolean;
    handleClose: Function;
    trainingEntities: Array<{value: string, label: string}>;
    subjectArea: Array<{value: string, label: string}>;
    coursesList: SelectorListType;
    prerequisite: PrerequisiteType;
}
