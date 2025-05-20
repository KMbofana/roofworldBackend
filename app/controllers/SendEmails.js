const nodemailer = require('nodemailer');
const multer = require("multer");


// Multer setup
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

// Set up upload middleware with options
const upload = multer({storage});

// Create a single function to handle file uploads
function fileUploadHandler(field = 'file', options = {}) {
  console.log("method started")
    // Parse options
  const {
    multiple  = false,
    maxCount = 1,
    fileTypes = null,
    required = false,
    responseFormatter = null
  } = options;
  
  // Return a middleware function
  return function(req, res) {
    // Create and execute multer middleware on the fly
    const uploadMiddleware = multiple ? 
      upload.array(field, maxCount) : 
      upload.single(field);
    
    uploadMiddleware(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }
      
      // Check if file is required but missing
      if (required) {
        const fileExists = multiple ? 
          (req.files && req.files.length > 0) : 
          req.file;
          
        if (!fileExists) {
          return res.status(400).json({
            success: false,
            message: `${field} is required`
          });
        }
      }
      
      // Check file types if specified
      if (fileTypes && (req.file || (req.files && req.files.length))) {
        const checkFileType = (file) => {
          const extension = file.originalname.split('.').pop().toLowerCase();
          return fileTypes.includes(extension);
        };
        
        if (multiple && req.files) {
          const invalidFile = req.files.find(file => !checkFileType(file));
          if (invalidFile) {
            return res.status(400).json({
              success: false,
              message: `Invalid file type for ${invalidFile.originalname}. Allowed: ${fileTypes.join(', ')}`
            });
          }
        } else if (req.file && !checkFileType(req.file)) {
          return res.status(400).json({
            success: false,
            message: `Invalid file type. Allowed: ${fileTypes.join(', ')}`
          });
        }
      }


      try{

          // Send email after a successful file upload
          await sendQuotationEmail(req, res);

          // Format response based on a user function or default
          if (responseFormatter && typeof responseFormatter === 'function') {
              return responseFormatter(req, res);
          }

          // Default response
          return res.json({
              success: true,
              message: `Upload successful`,
              file: multiple ? req.files : req.file,
              data: req.body
          });
      }catch (emailError) {
          return res.status(500).json({
              success: false,
              message: 'File upload successful but failed to send email',
              error: emailError.message
          });
      }

    });
  };
}

const sendQuotationEmail =async (req, res)=>{

    console.log(req.body)
    const transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: "93404f068380b0",
          pass: "141755245f84cd",
        },
      });
    
      // Wrap in an async IIFE so we can use await.

        const info = await transporter.sendMail({
          from: '"Anesu Mbofana" <anesumbofana@gmail.com>',
          to: "keithmbofana1@gmail.com, anesumbofana@gmail.com",
          subject: "Request For Quotation",
          text: "HTML Message", // plain‑text body
          html: `
          <!DOCTYPE html>
          <h><strong>CLIENT CONTACT INFORMATION</strong></h>
            <p>Full Name: <strong>${req.body.fullName}</strong></p>
            <p>Phone Number: <strong>${req.body.phone}</strong></p>
            <p>Company Name: <strong>${req.body.company}</strong></p>
            <p>Email Address: <strong>${req.body.email}</strong></p>
            <p>Physical Address: <strong>${req.body.address}</strong></p>
            <hr/>
          <h><strong>PROJECT DETAILS</strong></h>
          <br />
          <table>
            <tr>
                <th style="border:1px solid black; border-collapse: collapse;">Project Type</th>
                <th style="border:1px solid black; border-collapse: collapse;">Property Type</th>
                <th style="border:1px solid black; border-collapse: collapse;">Dimension</th>
                <th style="border:1px solid black; border-collapse: collapse;">Roof Slope</th>
                <th style="border:1px solid black; border-collapse: collapse;">Additional Details</th>
            </tr>
            <tr>
                <td style="border:1px solid black; border-collapse: collapse;">${req.body.projectType}</td>
                <td style="border:1px solid black; border-collapse: collapse;">${req.body.propertyType}</td>
                <td style="border:1px solid black; border-collapse: collapse;">${req.body.dimension}</td>
                <td style="border:1px solid black; border-collapse: collapse;">${req.body.roofSlope}</td>
                <td style="border:1px solid black; border-collapse: collapse;">${req.body.additionalDetails}</td>
            </tr>
            </table>
            <hr/>
          <h><strong>MATERIALS</strong></h>
          <br />
          <table>
                <tr>
                    <th style="border:1px solid black; border-collapse: collapse;">Prefferred Roofing Material</th>
                    <th style="border:1px solid black; border-collapse: collapse;">Preferred Color</th>
                    <th style="border:1px solid black; border-collapse: collapse;">Additional Features</th>
                    <th style="border:1px solid black; border-collapse: collapse;">Budget Range</th>
                    <th style="border:1px solid black; border-collapse: collapse;">Project Start Date</th>
                    <th style="border:1px solid black; border-collapse: collapse;">Photos (e.g plans)</th>
                    <th style="border:1px solid black; border-collapse: collapse;">Request For Samples</th>
                    <th style="border:1px solid black; border-collapse: collapse;">Aggree To Terms</th>
                </tr>
                <tr>
                    <td style="border:1px solid black; border-collapse: collapse;">${req.body.roofingMaterial}</td>
                    <td style="border:1px solid black; border-collapse: collapse;">${req.body.preferredColor}</td>
                    <td style="border:1px solid black; border-collapse: collapse;">${req.body.additionalFeater}</td>
                    <td style="border:1px solid black; border-collapse: collapse;">${req.body.budgetRange}</td>
                    <td style="border:1px solid black; border-collapse: collapse;">${req.body.startDate}</td>
                    <td style="border:1px solid black; border-collapse: collapse;">${req.body.file}</td>
                    <td style="border:1px solid black; border-collapse: collapse;">${req.body.samples}</td>
                    <td style="border:1px solid black; border-collapse: collapse;">${req.body.terms}</td>
                </tr>
            </table>
            <h><strong>Client's Structure Plan</strong></h>
            <p><img src="cid:image1" alt="client plan"></p>
          </html>`
        });
      
        console.log("Message sent:", info.messageId);


}

const subscribeForNews = async (req, res)=>{

   try{
       const transporter = nodemailer.createTransport({
           host: "sandbox.smtp.mailtrap.io",
           port: 587,
           secure: false, // true for 465, false for other ports
           auth: {
               user: "93404f068380b0",
               pass: "141755245f84cd",
           },
       });

       // Wrap in an async IIFE so we can use await.

           const info = await transporter.sendMail({
               from: '"Anesu Mbofana" <anesumbofana@gmail.com>',
               to: "keithmbofana1@gmail.com, anesumbofana@gmail.com",
               subject: "Request For Quotation",
               text: "HTML Message", // plain‑text body
               html: `
          <!DOCTYPE html>
          <h><strong>CLIENT INFORMATION</strong></h>
            <p>First Name: <strong>${req.body.firstName}</strong></p>
            <p>First Name: <strong>${req.body.lastName}</strong></p>
            <p>Email Address: <strong>${req.body.email}</strong></p>
            <hr/>
            <h><strong>Message:</strong></h>
            <p>i would like to receive news from you.</p>
          </html>`
           });

           console.log("Message sent:", info.messageId);

           res.status(200).json({
               success: true,
               message: "You have been subscribed for news"
           })


   }catch(err){
       res.status(500).json({
           success: false,
           message: "Failed to subscribe for news"
       })
   }
}

const contactUs = async (req, res)=>{

    try{
        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: "93404f068380b0",
                pass: "141755245f84cd",
            },
        });



        // Wrap in an async IIFE so we can use await.

            const info = await transporter.sendMail({
                from: '"Anesu Mbofana" <anesumbofana@gmail.com>',
                to: "keithmbofana1@gmail.com, anesumbofana@gmail.com",
                subject: req.body.subject,
                text: "HTML Message",
                html: `
                  <!DOCTYPE html>
                  <h><strong>CLIENT INFORMATION</strong></h>
                    <p>First Name: <strong>${req.body.firstName}</strong></p>
                    <p>Last Name: <strong>${req.body.lastName}</strong></p>
                    <p>Email Address: <strong>${req.body.email}</strong></p>
                    <p>Phone: <strong>${req.body.phone}</strong></p>
                    <hr/>
                    <h1><strong>Message:</strong></h1>
                    <p>${req.body.message}</p>
                  </html>`
            });

            console.log("Message sent:", info.messageId);

            res.status(200).json({
                success: true,
                message: "thank you for contacting us, our team will get back to you shortly"
            })


    }catch(err){
        res.status(500).json({
            success: false,
            message: "Failed to subscribe for news"
        })
    }
}

module.exports = {
    sendQuotationEmail,
    fileUploadHandler,
    subscribeForNews,
    contactUs
}