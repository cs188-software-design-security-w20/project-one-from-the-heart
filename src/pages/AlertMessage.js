import React from "react";

function deleteMyself(e) {
    var div = e.target.parentElement;

    // Set the opacity of div to 0 (transparent)
    div.style.opacity = "0";

    // Hide the div after 600ms (the same amount of milliseconds it takes to fade out)
    setTimeout(function(){ div.style.display = "none"; }, 600);
}

function generateAlert () {
    let tmp = window.sessionStorage.error;
    window.sessionStorage.removeItem("error");

    if (tmp) {
        if (tmp.includes("alert:")) {
            return (
                <div className="alert">
                <span className="closebtn" onClick={(e) => deleteMyself(e)}>&times;</span>  
                <strong>{tmp.replace("alert: ", "")}</strong>
                </div>
            )
        } else if (tmp.includes("alert success:")) {
            return (
                <div className="alert success">
                <span className="closebtn" onClick={(e) => deleteMyself(e)}>&times;</span>  
                <strong>{tmp.replace("alert success: ", "")}</strong>
                </div>
            )
        } else if (tmp.includes("alert info:")) {
            return (
                <div className="alert info">
                <span className="closebtn" onClick={(e) => deleteMyself(e)}>&times;</span>  
                <strong>{tmp.replace("alert info: ", "")}</strong>
                </div>
            )
        } else if (tmp.includes("alert warning:")) {
            return (
                <div className="alert warning">
                <span className="closebtn" onClick={(e) => deleteMyself(e)}>&times;</span>  
                <strong>{tmp.replace("alert warning: ", "")}</strong>
                </div>
            )
        }
    }

    return null;
}

export default generateAlert;