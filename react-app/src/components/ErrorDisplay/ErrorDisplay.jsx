import Alert from "@mui/material/Alert";
import { useSelector } from 'react-redux';

// adapted from: https://github.com/svmah/cs455-express-demo/tree/use-api

const ErrorDisplay = () => {
    const error = useSelector(state => state.festivals.error);
    const message = (error && error.message) ? error.message : 'Something went wrong, please try again later';
    return  error ? <Alert severity="error">{message}</Alert> : null;
}

export default ErrorDisplay;