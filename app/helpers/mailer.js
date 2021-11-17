const nodemailer = require("nodemailer");

exports.sendMail = function(recipient_email,subject,salutation,message) {

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
      ${salutation}<br/>
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
    console.log("Email Failed To Send");
    console.log(error);
    //res.json({status: true, respMesg: 'Email Failed To Send'});
  } 
  else
  {
    console.log("Email Sent Successfully");
    //res.json({status: true, respMesg: 'Email Sent Successfully'});
  }             
});       
  
 
}