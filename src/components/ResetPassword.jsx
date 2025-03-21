import React, { useState } from 'react'
import InputCom from '../CommonComponent/InputCom'
import ButtonCom from '../CommonComponent/ButtonCom';
import { validateEmpty, validatePassword } from '../utils/validation';
import { postRequest } from '../utils/api';
import { toast } from 'react-toastify';
import Loader from '../CommonComponent/Loader';
import { useSelector } from 'react-redux';
import { resetPasswordErrorObj, resetPasswordObj } from '../StaticData/staticObj';

const ResetPassword = () => {
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [passwordObj, setPasswordObj] = useState(resetPasswordObj);
  const [error, setError] = useState(resetPasswordErrorObj);
  const handleInput = (e) => { setPasswordObj({ ...passwordObj, [e.target.name]: e.target.value }) };
  const validate = () => {
    const errors = {};
    errors.oldPasswordError = validateEmpty(passwordObj.oldPassword, 'Old Password')
    errors.newPasswordError = validatePassword(passwordObj.Password, passwordObj.ConfirmPassword);
    setError(errors);
    return Object.values(errors).every((val) => !val);
  }
  const handleSubmit = async(e) => {
    e.preventDefault()
    if (validate()) {
      setLoading(true)
      let response = await postRequest('users/ResetPassword', passwordObj, { 'access-token': token });
      if(response.statusCode === 200) {
        toast.success('password reset successfully.');
        setLoading(false);
        setPasswordObj(resetPasswordObj);
      } 
      else {
        toast.error(response?.message)
        setLoading(false);
      }
    }
  }
  return (
    <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center', width: "100%",marginTop:"10px" }}>
      {loading && <Loader />}
      <div style={{ maxWidth: '600px', width: '100%', margin: "30px 0px", padding: "20px", border: '1px solid gray', borderRadius: "10px", margin: "20px" }}>
        <form onSubmit={handleSubmit} style={{ maxWidth: '600px', width: '100%' }}>
          <h1 style={{ textAlign: 'center', color: "rgb(18, 219, 206)" }}>Reset  password</h1>
          <br />
          <label htmlFor='oldPassword'>Old Password:</label>
          <span style={{ color: "red" }}>{error.oldPasswordError}</span>
          <InputCom type='password' placeholder='Old password...' id='oldPassword' name='oldPassword' value={passwordObj.oldPassword} onChange={handleInput} />
          <label htmlFor='newPassword'>New Password:</label>
          <span style={{ color: "red" }}>{error.newPasswordError}</span>
          <InputCom type='password' placeholder='New password...' id='newPassword' name='Password' value={passwordObj.Password} onChange={handleInput} />
          <label htmlFor='confirmPassword'>Confirm Password:</label>
          <InputCom type='password'  placeholder='Confirm password...' id='confirmPassword' name='ConfirmPassword' value={passwordObj.ConfirmPassword} onChange={handleInput} />
          <ButtonCom text='Submit' type='submit' />
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
