import {createStyles, Theme} from "@material-ui/core";

export default (theme: Theme) => createStyles({
    container: {
        display: 'flex'
    },
    side: {
        width: '50%',
        boxSizing: 'border-box',
        '&:first-child': {
            paddingRight: '50px',
        }
    },
    input: {
        width: '100%',
        marginBottom: '20px'
    },
    marginRight: {
        marginRight: '20px'
    },
    datePicker: {
        marginBottom: '20px'
    },
    textItem: {
        marginBottom: '10px'
    },
    fullWidth: {
        width: '100%'
    },
    selectorWrap: {
        width: '100%',
        '& .MuiInputLabel-shrink': {
            transform: 'translate(14px, -6.5px) scale(0.75) !important',
        },
        '& .MuiOutlinedInput-notchedOutline legend': {
            width: '100px !important'
        }
    }
});