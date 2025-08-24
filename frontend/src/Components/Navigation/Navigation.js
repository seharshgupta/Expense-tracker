import React from "react";
import styled from "styled-components";
import avatar from "../../img/avatar.png";
import { signout } from "../../utils/Icons";
import { menuItems } from "../../utils/menuItems";
import { useGlobalContext } from "../../context/globalContext";

function Navigation({ active, setActive }) {
    const { logout, user } = useGlobalContext();
    
    const handleSignOut = () => {
        logout();
        window.location.href = '/login';
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <NavStyled>
            <div className="user-con">
                {user?.profilePicture ? (
                    <img src={user.profilePicture} alt="User Avatar" aria-label="User Avatar" />
                ) : (
                    <div className="user-initials">
                        {getInitials(user?.name)}
                    </div>
                )}
                <div className="text">
                    <h2>{user?.name || 'User'}</h2>
                    <p>@{user?.username || 'user'}</p>
                </div>
            </div>

            {/* Menu Items */}
            <ul className="menu-items" role="menu">
                {menuItems.map((item) => (
                    <li
                        key={item.id}
                        onClick={() => setActive(item.id)}
                        className={active === item.id ? "active" : ""}
                        role="menuitem"
                    >
                        {item.icon}
                        <span>{item.title}</span>
                    </li>
                ))}
            </ul>

            {/* Bottom Navigation */}
            <div className="bottom-nav">
                <li onClick={handleSignOut} role="button" tabIndex="0">
                    {signout} Sign Out
                </li>
            </div>
        </NavStyled>
    );
}

const NavStyled = styled.nav`
    padding: 2rem 1.5rem;
    width: 374px;
    height: 100%;
    background: rgba(252, 246, 249, 0.78);
    border: 3px solid #FFFFFF;
    backdrop-filter: blur(4.5px);
    border-radius: 32px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 2rem;

    /* User Information Section */
    .user-con {
        height: 100px;
        display: flex;
        align-items: center;
        gap: 1rem;

        img {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            object-fit: cover;
            background: #fcf6f9;
            border: 2px solid #FFFFFF;
            padding: 0.2rem;
            box-shadow: 0px 1px 17px rgba(0, 0, 0, 0.06);
        }

        .user-initials {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: var(--color-accent);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8rem;
            font-weight: bold;
            color: white;
            border: 2px solid #FFFFFF;
            box-shadow: 0px 1px 17px rgba(0, 0, 0, 0.06);
        }

        h2 {
            color: rgba(34, 34, 96, 1);
        }

        p {
            color: rgba(34, 34, 96, 0.6);
        }
    }

    /* Menu Items */
    .menu-items {
        flex: 1;
        display: flex;
        flex-direction: column;

        li {
            display: grid;
            grid-template-columns: 40px auto;
            align-items: center;
            margin: 0.6rem 0;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.4s ease-in-out;
            color: rgba(34, 34, 96, 0.6);
            padding-left: 1rem;
            position: relative;

            i {
                color: rgba(34, 34, 96, 0.6);
                font-size: 1.4rem;
                transition: all 0.4s ease-in-out;
            }

            span {
                font-size: 1.2rem;
            }

            &:hover {
                color: rgba(34, 34, 96, 1);
                i {
                    color: rgba(34, 34, 96, 1);
                }
            }
        }
    }

    /* Active Menu Item */
    .active {
        color: rgba(34, 34, 96, 1) !important;

        i {
            color: rgba(34, 34, 96, 1) !important;
        }

        &::before {
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            width: 4px;
            height: 100%;
            background: #222260;
            border-radius: 0 10px 10px 0;
        }
    }

    /* Bottom Navigation */
    .bottom-nav {
        li {
            display: flex;
            align-items: center;
            font-weight: 500;
            cursor: pointer;
            color: rgba(34, 34, 96, 0.6);
            transition: all 0.4s ease-in-out;

            &:hover {
                color: rgba(34, 34, 96, 1);
            }
        }
    }
`;

export default Navigation;
