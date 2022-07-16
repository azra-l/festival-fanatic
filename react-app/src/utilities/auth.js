import { Navigate } from "react-router-dom";


const RequireAuth = (Component) => {

    return class App extends Component {
        state = {
            isAuthenticated: false,
            isLoading: true
        }

        componentDidMount() {
            getAuth().then(() => {
                console.log("YAY I GOT THROUGH GETAUTH")
                this.setState({ isAuthenticated: true, isLoading: false });
            }).catch(() => {
                this.setState({ isLoading: false });
            })
        }
        render() {
            const { isAuthenticated, isLoading } = this.state;
            if (isLoading) {
                return <div>Loading...</div>
            }
            if (!isAuthenticated) {
                return <Navigate to="/login" />
            }
            return <Component {...this.props} />
        }
    }

}

const getAuth = async () => {
    const response = await fetch(`http://localhost:3001/users/check-auth`, {
        method: "GET",
        // Need credentials to pass cookie data into request
        credentials: "include",
        headers: {
            "Access-Control-Allow-Origin": "http://localhost:3000",
        },
    });

    const data = await response.json();

    console.log("The response.status", response.status)

    if (!response.ok) {
        const errorMsg = data?.message;
        throw new Error(errorMsg);
    }

    if (response.status !== 200) {

        console.log("You are not authd")
        return false

    }
    else {
        console.log("YES YOU ARE AUTHD")
        return true
    }




};

export default RequireAuth 