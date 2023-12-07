import React from 'react';
import { useTheme, useMediaQuery, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';



const Disclaimer: React.FC= ({ }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <div>
      <div className="modal" style={{ width:'100%',  margin: '0' }}>
        <div className="modal-content" style={{ padding: '1px' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>

          </div>
          <Typography sx = {{ fontSize: isMobile ? '0.5rem' : '1rem'}}>
          <h2>Terms and Conditions Agreements</h2>

          <h3>1. Scope of Service</h3>
          <p>
            Our site provides a platform for matching requesters with volunteer
            interpreters. We do not conduct interpretation services ourselves.
            The matching process facilitated through our site is intended solely
            for initiating initial contact between requesters and interpreters.
            Furthermore, any financial transactions made through our site are
            prohibited, and we bear no responsibility for such transactions.
          </p>

          <h3>2. Terms of Use</h3>
          <h4>Account Usage</h4>
          <p>
            Users must use their own accounts responsibly and are prohibited
            from allowing others to use their account.
          </p>
          <h4>Behavioral Standards</h4>
          <p>
            Users must act courteously towards other users and third parties,
            avoiding any behavior that may cause discomfort.
          </p>
          <h4>Purpose of Service</h4>
          <p>
            Users agree to use our site legally and solely for its intended
            purpose.
          </p>
          <h4>Prohibited Activities</h4>
          <p>
            Any form of harassment, fraud, threats, copyright infringement, or
            other illegal or inappropriate activities are strictly prohibited.
          </p>
          <h4>Accuracy of Information</h4>
          <p>
            Users are obligated to provide true and up-to-date information, and
            the provision of false information is prohibited.
          </p>
          <h4>Site Usage Restrictions</h4>
          <p>
            The site administrators reserve the right to temporarily or
            permanently suspend accounts in case of violations of the terms or
            improper use.
          </p>

          <h3>3. Limitation of Liability</h3>
          <h4>Interpretation Services</h4>
          <p>
            Our site only provides a platform for matching interpreters and
            requesters, and does not offer interpretation services itself.
            Therefore, we are not liable for any direct or indirect damages
            arising from errors, misunderstandings, or other issues related to
            the interpretation services.
          </p>
          <h4>Appointment (Request) Liability</h4>
          <p>
            We are not responsible for the establishment or execution of
            appointments or reservations for interpretation services. We bear no
            responsibility for any troubles related to appointments or failures
            to establish a reservation.
          </p>

          <h3>4. Prohibited Conduct</h3>
          <p>Our site strictly prohibits the following behaviors:</p>

          <p>
            ・Harassment: Any form of harassment or threats against other users
            or third parties.
          </p>
          <p>・Fraud: Providing false information or deceiving others.</p>
          <p>・Threats: Threatening other users or third parties.</p>
          <p>
            ・Copyright Infringement: Unauthorized use of someone else's
            copyrighted work.
          </p>
          <p>
            ・Other Illegal or Inappropriate Activities: Any actions that
            violate the law or hinder the operation of our site.
          </p>

          <p>
            These prohibitions apply to both online behavior and actual conduct
            through interpretation services. Violations may result in temporary
            suspension or permanent expulsion from the site.
          </p>

          <h3>5. Accuracy of Information</h3>
          <p>
            Users must provide accurate and up-to-date information and are
            prohibited from providing false information.
          </p>

          <h3>6. Site Usage Restrictions</h3>
          <p>
            The site administrators have the right to temporarily or permanently
            suspend accounts if violations of terms or improper use are
            discovered.
          </p>

          <h3>7. Changes and Updates</h3>
          <p>
            These terms of use are subject to change without notice, and users
            are required to regularly review and comply with the updated terms.
          </p>
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;