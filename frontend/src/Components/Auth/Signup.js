import React, { useState } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import Button from '../Button/Button';
import { user, lock, mail } from '../../utils/Icons';

function Signup() {
    const { signup, error, setError } = useGlobalContext();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleInput = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('Please fill in all fields');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }
        signup(formData);
    };

    return (
        <SignupStyled>
            <div className="auth-container">
                <div className="auth-header">
                    <h1>Create Account</h1>
                    <p>Join us to start tracking your expenses</p>
                </div>
                
                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <p className='error'>{error}</p>}
                    
                    <div className="input-control">
                        <div className="input-icon">
                            {user}
                        </div>
                        <input 
                            type="text" 
                            name="name"
                            value={formData.name}
                            placeholder="Full Name"
                            onChange={handleInput}
                            required
                        />
                    </div>
                    
                    <div className="input-control">
                        <div className="input-icon">
                            {mail}
                        </div>
                        <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            placeholder="Email Address"
                            onChange={handleInput}
                            required
                        />
                    </div>
                    
                    <div className="input-control">
                        <div className="input-icon">
                            {lock}
                        </div>
                        <input 
                            type="password" 
                            name="password"
                            value={formData.password}
                            placeholder="Password"
                            onChange={handleInput}
                            required
                        />
                    </div>
                    
                    <div className="input-control">
                        <div className="input-icon">
                            {lock}
                        </div>
                        <input 
                            type="password" 
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            placeholder="Confirm Password"
                            onChange={handleInput}
                            required
                        />
                    </div>
                    
                    <div className="submit-btn">
                        <Button 
                            name={'Create Account'}
                            bPad={'.8rem 1.6rem'}
                            bRad={'30px'}
                            bg={'var(--color-accent)'}
                            color={'#fff'}
                        />
                    </div>
                </form>
                
                <div className="auth-footer">
                    <p>Already have an account? <span onClick={() => window.location.href = '/login'}>Sign in</span></p>
                </div>
            </div>
        </SignupStyled>
    );
}

const SignupStyled = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 2rem;

    .auth-container {
        background: rgba(252, 246, 249, 0.95);
        border: 2px solid #FFFFFF;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.1);
        border-radius: 20px;
        padding: 3rem;
        width: 100%;
        max-width: 400px;
    }

    .auth-header {
        text-align: center;
        margin-bottom: 2rem;

        h1 {
            color: rgba(34, 34, 96, 1);
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }

        p {
            color: rgba(34, 34, 96, 0.6);
            font-size: 1rem;
        }
    }

    .auth-form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        .error {
            color: #ff6b6b;
            text-align: center;
            font-size: 0.9rem;
            background: rgba(255, 107, 107, 0.1);
            padding: 0.5rem;
            border-radius: 5px;
        }

        .input-control {
            position: relative;
            
            .input-icon {
                position: absolute;
                left: 1rem;
                top: 50%;
                transform: translateY(-50%);
                color: rgba(34, 34, 96, 0.4);
                z-index: 1;
            }

            input {
                width: 100%;
                padding: 1rem 1rem 1rem 3rem;
                border: 2px solid #fff;
                border-radius: 10px;
                background: transparent;
                font-size: 1rem;
                color: rgba(34, 34, 96, 0.9);
                box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
                transition: all 0.3s ease;

                &:focus {
                    outline: none;
                    border-color: var(--color-accent);
                    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.1);
                }

                &::placeholder {
                    color: rgba(34, 34, 96, 0.4);
                }
            }
        }

        .submit-btn {
            margin-top: 1rem;
            
            button {
                width: 100%;
                box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
                
                &:hover {
                    background: var(--color-green) !important;
                }
            }
        }
    }

    .auth-footer {
        text-align: center;
        margin-top: 2rem;
        
        p {
            color: rgba(34, 34, 96, 0.6);
            font-size: 0.9rem;
            
            span {
                color: var(--color-accent);
                cursor: pointer;
                font-weight: 600;
                
                &:hover {
                    text-decoration: underline;
                }
            }
        }
    }
`;

export default Signup; 