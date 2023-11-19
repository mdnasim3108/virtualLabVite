import { CookiesProvider } from "react-cookie"
import App from "./App"
const MycookieApp=()=>{
        return(
            <CookiesProvider>
                <App/>
            </CookiesProvider>
        )
}
export default MycookieApp