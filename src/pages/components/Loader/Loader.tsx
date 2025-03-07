import { FC } from "react";

const Loader: FC = () => {
    const img_cutaway = "/cutaway.jpg";

    return (
        <>
        <div className="loader">
            <div
                style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    width: "100vw",
                    height: "100vh",
                    transform: "translate(-50%, -50%)",
                    backgroundImage: `url(${img_cutaway})`,
                    backgroundRepeat: "repeat",
                    backgroundSize: "100%",
                    opacity: "0.2"
                }}
            ></div>
            
            <div className="loader-inner">            
                <div className="loader-line-wrap">
                    <div className="loader-line"></div>
                </div>
                <div className="loader-line-wrap">
                    <div className="loader-line"></div>
                </div>
                <div className="loader-line-wrap">
                    <div className="loader-line"></div>
                </div>
                <div className="loader-line-wrap">
                    <div className="loader-line"></div>
                </div>
                <div className="loader-line-wrap">
                    <div className="loader-line"></div>
                </div>
            </div>
        </div>
        
        </>
        
    );
}

export default Loader;