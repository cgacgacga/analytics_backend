import {createStyles, Theme} from "@material-ui/core";

export default (theme: Theme) => createStyles({
    dialogContent: {
        display: 'flex',
        flexDirection: 'column',
        padding: 48
    },
    searchInput: {
        height: '40px'
    },
    actions: {
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 48
    },
    //@ts-ignore
    root: {
        //@ts-ignore
        zIndex: '10000 !important'
    },
    dialog: {
        boxSizing: 'border-box',
    },
    item: {
        display: 'flex',
        marginBottom: '20px',
        justifyContent: 'space-between'
    },
    list: {
        height: '100%',
        paddingRight: '20px'
    },
    header: {
        display: 'flex',
        marginBottom: 40,
        justifyContent: 'space-between'
    },
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    linkButton: {
        display: 'flex',
        alignItems: 'center'
    },
    saveButton: {
        marginLeft: 8
    },
    link: {
        display: 'flex',
        alignItems: 'center',
        marginRight: 'auto',
        textDecoration: 'none',
        color: '#fff',
    },
});