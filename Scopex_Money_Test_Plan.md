
# Manual Test Plan for Scopex Money

## Test Environment
- URL: [https://scopex.money/](https://scopex.money/)
- Test Account Email: falaw42441@codverts.com

## Scope of Testing
The following functionalities of Scopex Money will be tested:
1. User Registration
2. Adding a Recipient
3. Logout

### Test Environment Setup
- **Browsers**: Chrome, Firefox, Edge (latest versions)
- **Devices**: Desktop (Windows 10, macOS), Mobile (iOS, Android)
- **Test Data**: Different valid and invalid user inputs
- **Assumptions**: Internet connectivity is stable, and the test environment is pre-configured.
- **Risks**: Data persistence issues, session management inconsistencies, duplicate registration entries.

---

## Test Scenarios

### Test Scenario 1: Register New User
1. **Objective**: Ensure a new user can register successfully.
2. **Steps**:
   - Visit [https://scopex.money/](https://scopex.money/)
   - Verify the presence of a 'Register' button.
   - Click the 'Register' button.
   - Enter a valid name and email in the form.
   - Click the 'Sign Up' button.
3. **Expected Outcome**:
   - User sees "You have successfully registered!"
   - The user is redirected to the dashboard.
4. **Edge Cases**:
   - Enter an already registered email.
     - Expected: "User $email already exists!" popup.
   - Leave name or email fields blank.
     - Expected: Error message "All fields are required."
   - Use an invalid email format.
     - Expected: "Please enter a valid email address."
   - Check case sensitivity for the email address.

### Test Scenario 2: Add Recipient
1. **Objective**: Ensure a user can add a recipient successfully.
2. **Prerequisite**: User should be logged in. For Bank Number Used LIC displayed account numbers. 
https://www.licmf.com/assets/pdfs/LIST-OF-ALL-BANK-DETAILS-UPDATED26112019.pdf
3. **Steps**:
   - Verify that the user is on the dashboard.
   - Click and expand 'Recipients' from the side tab.
   - Click 'Add Recipient'.
   - Enter valid recipient details (name, nickname, bank account number, IFSC code).
   - Click the 'Submit' button.
   - Confirm recipient details on the confirmation screen.
4. **Expected Outcome**:
   - On successful submission, "Recipient added successfully!" message appears.
   - The recipient list page shows correct recipient details.
5. **Edge Cases**:
   - Add a recipient with a duplicate bank account number.
     - Expected: "Recipient with the same bank account number already exists."
   - Test invalid combinations (invalid name, account number, or IFSC code).
     - Expected: Error messages specific to the invalid field (e.g., invalid IFSC).
   - IFSC code with less or more than 11 characters.
     - Expected: "IFSC should be 11 characters long and the 5th character should be 0."
   - Test duplicate nickname or duplicate recipient name for separate accounts.

### Test Scenario 3: Logout
1. **Objective**: Ensure that logout functions correctly.
2. **Steps**:
   - Click the profile icon on the top-right corner.
   - Verify the presence of the 'Logout' button.
   - Click 'Logout'.
3. **Expected Outcome**:
   - User is logged out and redirected to the login screen.
   - 'Login' button is visible.

---

## Edge Tests for Login

### Edge Case 1: Invalid Credentials
1. **Objective**: Verify the system's response to invalid credentials.
2. **Steps**:
   - Enter an incorrect email and password.
   - Attempt to log in.
3. **Expected Outcome**:
   - Error message "Invalid credentials" is displayed.
   - Validate the case sensitivity of the email and password.

### Edge Case 2: Duplicate User Registration
1. **Objective**: Verify that a duplicate user cannot be registered.
2. **Steps**:
   - Attempt to register using an email already in use.
3. **Expected Outcome**:
   - "User $email already exists!" error message is displayed.

---

## Test Data
- **Valid User Registration Data**:
  - Name: "John Doe"
  - Email: "johndoe@example.com"
- **Invalid Data**:
  - Email: "invalid-email", "johndoe@example" (missing domain)

- **Valid Recipient Data**:
  - Name: "Recipient One"
  - Nickname: "Rec1"
  - Bank Account Number: "123456789012"
  - IFSC Code: "SBIN0001234"
- **Invalid Data**:
  - IFSC Code: "SBI123" (less than 11 characters)

---

## Test Execution

### Test Environment:
- **Devices**: Desktop and Mobile (iOS, Android)
- **Browsers**: Chrome, Firefox, Safari (latest versions)

### Acceptance Criteria:
1. User registration completes successfully, and the user lands on the dashboard.
2. Recipients can be added and displayed in the recipient list without duplicates.
3. Logout works correctly, redirecting the user to the login page.

---

## Additional Considerations:
- **Session Timeout**: Test that users are logged out after a period of inactivity.
- **Cross-browser Compatibility**: Ensure the app functions across different browsers.
- **Responsiveness**: Validate the application's usability on mobile devices.
- **Error Handling**: Verify that appropriate error messages are shown for invalid inputs.

