const nodemailer = require("nodemailer");

exports.sendMail = function(recipient_email,subject,username,message) {

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'noreply.adgg@gmail.com',
      pass: '!2sYstemmaster'
    }
});

var mailOptions = {
    from: 'noreply.adgg@gmail.com',// sender address
    to: recipient_email, // list of receivers
    subject: subject, // Subject line
    text: '',
    html: `                
    <p>
      Hello ${username} ,<br/>
      ${message}
      <br/>
      Thank you <br/>
      The ADGG Support Team
    </p>
    `
};

transporter.sendMail(mailOptions, function(error, info){
  if (error)
  {
    res.json({status: true, respMesg: 'Email Failed To Send'});
  } 
  else
  {
    res.json({status: true, respMesg: 'Email Sent Successfully'});
  }             
});       
  
 
}