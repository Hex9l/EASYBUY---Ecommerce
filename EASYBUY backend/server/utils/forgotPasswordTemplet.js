const forgotPasswordTemplet = ({ name, otp }) => {
    return `
    
    <div>
      <P>Dear ${name}</P>
        <p>We received a request to reset your password. Please use the following OTP to proceed:</p>
        <div style="font-size: 24px; font-weight: bold; color: #4CAF50; margin: 20px 0;">
           ${otp}
        </div>
        <p> For security reasons, this OTP is valid for 1 hour only. Enter this otp in the EASTBUY website to proceed with reset your password. </p>
         <br/>
         </br>
         <P>Thanks for using EASYBUY</P>

    </div>
    
    `
}

export default forgotPasswordTemplet;