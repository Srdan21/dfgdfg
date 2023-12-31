import { Component } from "react";
import React from "react";
import { user } from "../../api/data";
export class Auth extends Component<any, any> {
    constructor(props: any) {
        super(props);
        document.title = "Авторизация"
    }
    render() {
        return <div className="content">
            <div className="sidenav">
                <div className="login-main-text">
                    <h2>admin panel<br /> Authorisation</h2>
                    <p>Account details must be entered</p>
                </div>
            </div>
            <div className="main">
                <div className="col-md-6 col-sm-12">
                    <div className="login-form">
                        <form>
                            <div className="form-group">
                                <label>RP Account Name</label>
                                <input type="text" className="form-control" placeholder="Login" id="login" />
                            </div>
                            <div className="form-group">
                                <label>Password for login</label>
                                <input type="password" className="form-control" placeholder="Password" id="pass" />
                            </div>
                            <button type="submit" className="btn btn-black" onClick={(e) => {
                                e.preventDefault();
                                user.auth(document.getElementById("login").value, document.getElementById("pass").value)
                            }}>Authorise</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    }
}
