const verifyEmailTemplate = ({ name, url }) => `
    <p>Dear ${name} </p>
    <p>Thank you for registering EASYBUY.</P>
    <a href=${url} style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; display: inline-block; border-radius: 4px; margin-top: 10px;">
       Verify Your Email
    </a>
    `

export default verifyEmailTemplate; 