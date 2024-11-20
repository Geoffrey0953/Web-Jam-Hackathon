import Logo from "../assets/logo.svg";
import Cancel from "../assets/cancel.svg";
const Settings = ({toggleSettings}) => {
    return (
        <div className="bg-white h-screen w-80 p-4">
            <div className="flex flex-row justify-between">
                <img src={Logo} alt="logo" className="z-40 w-36" />
                <button onClick={toggleSettings}>
                    <img src={Cancel} alt="cancel" className="w-6 h-6 m-4 cursor-pointer" />
                </button>
            </div>
            <h1>Settings</h1>
        </div>
    );
    }

export default Settings;