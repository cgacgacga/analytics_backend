export enum fields {
    EDUCATIONAL_PLAN_LIST = 'EDUCATIONAL_PLAN_LIST',
    EDUCATIONAL_PLAN_DIALOG = 'EDUCATIONAL_PLAN_DIALOG',
    EDUCATIONAL_PLAN_DETAIL_DIALOG = 'EDUCATIONAL_PLAN_DETAIL_DIALOG',
    EDUCATIONAL_PLAN_CREATE_MODULE_DIALOG = 'EDUCATIONAL_PLAN_CREATE_MODULE_DIALOG',
    EDUCATIONAL_PLAN_ADD_MODULE_DIALOG = 'EDUCATIONAL_PLAN_ADD_MODULE_DIALOG',
    DOWNLOAD_DIALOG = 'DOWNLOAD_DIALOG',
    IS_OPEN_DIALOG = 'IS_OPEN_DIALOG',
    DIALOG_DATA = 'DIALOG_DATA',
    SEARCH_QUERY = 'SEARCH_QUERY',
    CURRENT_PAGE = 'CURRENT_PAGE',
    ALL_COUNT = 'ALL_COUNT',
    SORTING = 'SORTING',
    SORTING_FIELD = 'SORTING_FIELD',
    SORTING_MODE = 'SORTING_MODE',
    DETAIL_PLAN = 'DETAIL_PLAN',
    DIRECTIONS_DEPENDED_ON_WORK_PROGRAM = 'DIRECTIONS_DEPENDED_ON_WORK_PROGRAM',
    IS_TRAJECTORY_ROUTE = 'IS_TRAJECTORY_ROUTE',
    TRAJECTORY_USER_DATA = 'TRAJECTORY_USER_DATA',
    TRAJECTORY_DIRECTION = 'TRAJECTORY_DIRECTION',
    NEW_PLAN_ID_FOR_REDIRECT = 'NEW_PLAN_ID_FOR_REDIRECT',
}

export enum fetchingTypes {
    GET_EDUCATIONAL_PLANS = 'GET_EDUCATIONAL_PLANS',
    GET_EDUCATIONAL_PLAN_DETAIL = 'GET_EDUCATIONAL_PLAN_DETAIL',
    DELETE_EDUCATIONAL_PLAN = 'DELETE_EDUCATIONAL_PLAN',
    UPDATE_EDUCATIONAL_PLAN = 'UPDATE_EDUCATIONAL_PLAN',
    CREATE_EDUCATIONAL_PLAN = 'CREATE_EDUCATIONAL_PLAN',
    CREATE_BLOCK_OF_WORK_PROGRAMS = 'CREATE_BLOCK_OF_WORK_PROGRAMS',
    CHANGE_BLOCK_OF_WORK_PROGRAMS = 'CHANGE_BLOCK_OF_WORK_PROGRAMS',
    DELETE_BLOCK_OF_WORK_PROGRAMS = 'DELETE_BLOCK_OF_WORK_PROGRAMS',
    CHANGE_MODULE = 'CHANGE_MODULE',
    CREATE_MODULE = 'CREATE_MODULE',
    DELETE_MODULE = 'DELETE_MODULE',
    ADD_MODULE = 'ADD_MODULE',
    GET_DIRECTIONS_DEPENDED_ON_WORK_PROGRAM = 'GET_DIRECTIONS_DEPENDED_ON_WORK_PROGRAM',
    GET_COMPETENCE_DIRECTIONS_DEPENDED_ON_WORK_PROGRAM = 'GET_COMPETENCE_DIRECTIONS_DEPENDED_ON_WORK_PROGRAM',
    SAVE_COMPETENCE_BLOCK = 'SAVE_COMPETENCE_BLOCK',
    DELETE_COMPETENCE_BLOCK = 'DELETE_COMPETENCE_BLOCK',
    DELETE_WP_FROM_ZUN = 'DELETE_WP_FROM_ZUN',
    PLAN_TRAJECTORY_SELECT_ELECTIVES = 'PLAN_TRAJECTORY_SELECT_ELECTIVES',
    PLAN_TRAJECTORY_SELECT_SPECIALIZATION = 'PLAN_TRAJECTORY_SELECT_SPECIALIZATION',
    PLAN_TRAJECTORY_SELECT_OPTIONAL_WP = 'PLAN_TRAJECTORY_SELECT_OPTIONAL_WP',
    CONNECT_MODULES = 'CONNECT_MODULES',
    DISCONNECT_MODULE = 'DISCONNECT_MODULE',
}

export enum EducationalPlanFields {
    ID = 'id',
    EDITORS = 'editors',
    TRAINING_PERIOD = 'training_period',
    UNIVERSITY_PARTNER = 'university_partner',
    PLAN_TYPE = 'plan_type',
    STRUCTURAL_UNIT = 'structural_unit',
    TOTAL_INTENSITY = 'total_intensity',
    MILITARY_DEPARTMENT = 'military_department',
    PROFILE = 'educational_profile',
    APPROVAL_DATE = 'approval_date',
    NUMBER = 'number',
    DISCIPLINE_BLOCKS = 'discipline_blocks_in_academic_plan',
    EDUCATION_FORM = 'education_form',
    YEAR = 'year',
    QUALIFICATION = 'qualification',
    CAN_EDIT = 'can_edit',
    ID_RATING = 'id_rating',
    RATING = 'rating',

    TITLE = 'title',
    ACADEMIC_PLAN_IN_FIELD_OF_STUDY = 'academic_plan_in_field_of_study',
    FIELD_OF_STUDY = 'field_of_study',
}

export enum EducationalPlanBlockFields {
    ID = 'id',
    NAME = 'name',
    MODULES = 'modules_in_discipline_block',
}

export enum ModuleFields {
    ID = 'id',
    NAME = 'name',
    BLOCKS_OF_WORK_PROGRAMS = 'change_blocks_of_work_programs_in_modules',
    TYPE = 'type',
}

export enum BlocksOfWorkProgramsFields {
    ID = 'id',
    WORK_PROGRAMS = 'work_program',
    GIA = 'gia',
    PRACTICE = 'practice',
    COMPETENCES = 'competences',
    INDICATORS = 'indicators',
    RESULTS = 'results',
    SEMESTER_UNIT = 'credit_units',
    TYPE = 'change_type',
    CHANGED = 'changed',
    SEMESTER_DURATION = 'semester_duration',
    SEMESTER_START = 'semester_start',
}

export enum DownloadFileModalFields {
    ID = 'pk',
    DIRECTION_ID = 'field_of_study_id',
    ACADEMIC_PLAN_ID = 'academic_plan_id',
    YEAR = 'year',
}