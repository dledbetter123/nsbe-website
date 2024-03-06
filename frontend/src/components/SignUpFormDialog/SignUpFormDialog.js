// src/components/SignUpFormDialog/SignUpFormDialog.js
import React, { useState } from 'react';
import './SignUpFormDialog.css'; // Make sure to style your form and dialog

function SignUpFormDialog({ isOpen, onClose }) {
  const [member, setMember] = useState({
    studentId: '',
    fullName: '',
    email: '',
    graduationMonth: '',
    graduationYear: '',
    majors: '',
    minorsOrFocuses: '',
    degreeProgram: '',
    shortBio: '',
  });
  const [pictureFile, setPictureFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setMember(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  async function uploadFileAndGetUrl(file, endpoint) {

    const response = await fetch(endpoint + `?filename=${file.name}&filetype=${file.type}`, { method: 'GET' });
    console.log("genpresignfinished")
    const data = await response.json();
    console.log(data)
    const presignedUrl = data.url;
  
    try {
        const response = await fetch(presignedUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type,
          },
          body: file,
        });
    

        if (response.status === 200) {
          console.log('File uploaded successfully.');
        } else {
          console.error('File upload failed.');
        }
    
        const text = await response.text();
        console.log('Response status:', response.status);
        console.log('Response status text:', response.statusText);
        console.log('Response body:', text);
    
      } catch (error) {
        console.error('Error during the upload:', error);
        throw error;
      }
  
    // The URL of the uploaded file in S3 is the pre-signed URL minus the query parameters
    return presignedUrl.split('?')[0];
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    var api = "http://nsbebackend22.us-east-1.elasticbeanstalk.com"
    
    let pictureUrl = '', resumeUrl = '';
    if (pictureFile) {
      pictureUrl = await uploadFileAndGetUrl(pictureFile, api+'/generateurl');
      console.log(pictureUrl)
    }
    if (resumeFile) {
      resumeUrl = await uploadFileAndGetUrl(resumeFile, api+'/generateurl');
    }
  
    // Create a new member object with all form data including picture and resume URLs
    const newMember = {
      ...member,
      pictureLink: pictureUrl,
      resumeLink: resumeUrl,
    };
  
    try {
      const response = await fetch(api+'/members/newmember', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMember),
      });
  
      if (!response.ok) throw new Error('Failed to create new member');
  
      const data = await response.json();
      console.log('Success:', data);
      setSubmissionStatus(true); // Close the dialog on successful submission
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  if (!isOpen) return null;

  const handleBackdropClick = (event) => {
    // Only close if the click is on the backdrop itself, not its children
    if (event.target === event.currentTarget) {
      onClose();
      setSubmissionStatus(false);
    }
  };

  if (!isOpen || submissionStatus) return null;

  if (submissionStatus) {
    return (
      <div className="backdrop" onClick={onClose}>
        <div className="signup-success-message">
          Thank you for adding your information. You will find your NSBE info below. Our team is verifying your data, ensure that no unprofessional or rude content was uploaded or your account will be deleted.
        </div>
      </div>
    );
  }

  return (
    <div className="backdrop" onClick={handleBackdropClick}>
      <div className="signup-form-dialog" onClick={(e) => e.stopPropagation()}>
      <form onSubmit={handleSubmit}>
        {/* Full Name */}

        <div className="form-field">
        <label htmlFor="fullName">Full Name:</label>
        <input type="text" id="fullName" name="fullName" value={member.fullName} onChange={handleChange} required />
        </div>

        {/* Student ID */}
        <div className="form-field">
        <label htmlFor="studentId">Student ID:</label>
        <input type="text" id="studentId" name="studentId" value={member.studentId} onChange={handleChange} required />
        </div>
    
        {/* Email */}
        <div className="form-field">
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" value={member.email} onChange={handleChange} required />
        </div>
    
        {/* Graduation Month */}
        <div className="form-field">
        <label htmlFor="graduationMonth">Graduation Month:</label>
        <select id="graduationMonth" name="graduationMonth" value={member.graduationMonth} onChange={handleChange} required>
          <option value="">Select Month</option>
          <option value="January">January</option>
          <option value="February">February</option>
          <option value="March">March</option>
          <option value="April">April</option>
          <option value="May">May</option>
          <option value="June">June</option>
          <option value="July">July</option>
          <option value="August">August</option>
          <option value="September">September</option>
          <option value="October">October</option>
          <option value="November">November</option>
          <option value="December">December</option>
        </select>
        </div>
  
        {/* Graduation Year */}
        <div className="form-field">
        <label htmlFor="graduationYear">Graduation Year:</label>
        <input type="text" id="graduationYear" name="graduationYear" value={member.graduationYear} onChange={handleChange} required />
        </div>
        {/* Majors */}
        <div className="form-field">
        <label htmlFor="majors">Majors:</label>
        <input type="text" id="majors" name="majors" value={member.majors} onChange={handleChange} required />
        </div>
        {/* Minors or Focuses */}
        <div className="form-field">
        <label htmlFor="minorsOrFocuses">Minors/Focuses:</label>
        <input type="text" id="minorsOrFocuses" name="minorsOrFocuses" value={member.minorsOrFocuses} onChange={handleChange} />
        </div>
        {/* Degree Program */}
        <div className="form-field">
        <label htmlFor="degreeProgram">Degree Program:</label>
        <input type="text" id="degreeProgram" name="degreeProgram" value={member.degreeProgram} onChange={handleChange} required />
        </div>
        {/* Short Bio */}
        <div className="form-field">
        <label htmlFor="shortBio">Short Bio:</label>
        <textarea id="shortBio" name="shortBio" value={member.shortBio} onChange={handleChange} required />
        </div>
        {/* Picture Link */}
        <div className="form-field">
        <label htmlFor="pictureFile">Add a Picture:</label>
        <input type="file" id="pictureFile" name="pictureFile" onChange={(e) => setPictureFile(e.target.files[0])} />
        </div>
        {/* Resume Link */}
        <div className="form-field">
        <label htmlFor="resumeFile">Add a Resume:</label>
        <input type="file" id="resumeFile" name="resumeFile" onChange={(e) => setResumeFile(e.target.files[0])} />
        </div>
        {/* Submit and Cancel Buttons */}
        <div className="form-field">
        <button type="submit">Sign Up</button>
        <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
    </div>
  );
  
}

export default SignUpFormDialog;
