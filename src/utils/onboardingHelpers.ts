// Authors: Lawrence Luo & Joshua Li
export const GENDERS = ["Female", "Male", "Other"];
export const PRONOUNS = ["She/Her/Hers", "He/Him/His", "They/Them/Their", "Other"];

// Create objects for dropdown menus: 
// [{'label': "Select Gender", 'value': ""}, {'label': "Male", 'value': "Male"}, {'label': 'Female', 'value': "Female"}, ...]
export const genderOptions = GENDERS.map((gender: string) => ({ 'label': gender, 'value': gender }));
export const pronounOptions = PRONOUNS.map((pronoun: string) => ({ 'label': pronoun, 'value': pronoun }));
// genderOptions.unshift({'label': "Select Gender", 'value': ""});
// pronounOptions.unshift({'label': "Select Pronouns", 'value': ""});

/*  
  validateName()
    input: name: string that represents a user's first or last name
    output: isValid: boolean that represents if a user's name is valid or not
  
  Rules for names:
    -All letters; no numbers; no symbols; no emojis
    -Dashes are allowed; spaces are allowed
    -Must be longer than 1 letter
  
  Examples:
    -"Lawrence" should return true
    -"Josh" should return true
    -"   " should return false
    -"4239" should return false
*/
export const validateName = (name: string): boolean => {
  let result = name.trim();  // removes whitespace

  const nameConditions = /[a-z -]{1,32}/i;  // only letters, spaces, dashes; between 2 and 32 chars long
  const firstLetter = /^[a-z]/i;  // checks if the first char of the name is a letter

  // should either of the expressions be false, the name is invalid. return false
  return firstLetter.test(result) && nameConditions.test(result)
}

/*
  validateAge()
    input: age: integer that represents a user's age
    output: isValid: boolean that represents if a user's age is valid or not
    Rules for age:
      -cannot be bigger than 100
      -cannot be smaller than 18
      -the age input cannot be empty
    Examples:
      -5.7 should return false
      -0 should return false
      -150 should return false
      -5 should return true
      -90 should return true
*/
export const validateAge = (age: string): boolean => {
  let ageLength = age.length;  // check that user inputted something
  let ageInt = parseInt(age);

  return ageInt <= 100 && ageInt >= 18 && ageLength > 0;
}

/* 
  validateEmail()
  input: email - string that represents user's email
  output: isValid - boolean value that shows whether user email is valid or not
  Adapted from https://stackoverflow.com/a/9204568
  Rules for email:
    -Must have recipient name (part before the "@")
    -must have @ symbol
    -must have domain name (ex. gmail)
    -must have top level domain (ex. .com)
    -may include uppercase and lowercase English letters
    -digits from 0 to 9
    -special characters such as ! # $ % & ' * + - / = ? ^ _ ` { |
    -must be less than 64 characters and more than 0 characters
    -is case insensitive (most email validations on other websites are case insensitive)
  
  Examples:
    -hello@gmail.com should be true
    -@gmail.com should be false
    -hello@gmail should be false
    -notvalid@com should be false
    -thisdoesnotwork.com should be false
    -@#!hi@gmail.com should be true
    -123456789@gmail.com should be true
*/
export const validateEmail = (email: string): boolean => {
  const emailConditions = /\S+@\S+\.\S+/i;  // RE that checks for chars that are necessary
  return emailConditions.test(email) && email.length <= 64;
}

/*
  validateGender()
    input: gender, a string representing the user's gender
    output: a boolean representing the validity of the selected gender
  Gender rules:
    -Can only be Male, Female, or Other (case insensitive)
*/
export const validateGender = (gender: string): boolean => {
  return GENDERS.includes(gender);
}

/*
  validatePronouns()
    input: pronouns, a string representing the user's selected pronouns
    output: a boolean representing the validity of the selected pronoun
  
  Pronoun rules:
    -Can only be "He/Him/His", "She/Her/Hers", "They/Them/Their", "Other"
*/
export const validatePronouns = (pronouns: string): boolean => {
  return PRONOUNS.includes(pronouns);
}


/* 
  validateProfileData()
    input: object with multiple key-value pairs containing the personal information of the user
          this includes their email, first name, last name, gender, and pronouns
    output: boolean value that indicates if the inputted information is valid
  
  -This function is called when we click the "Sign Up" button
  -All personal information in object is run through the validation function for that piece of information
    Example: j.li20061212@gmail.com will be run through validateEmail
*/

type UserData = {
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  pronouns: string;
}

export const validateProfileData = (userData: UserData): boolean => {
  return validateEmail(userData.email) &&
    validateName(userData.firstName) &&
    validateName(userData.lastName) &&
    validateGender(userData.gender) &&
    validatePronouns(userData.pronouns)
}

// THE FOLLOWING FUNCTIONS BELOW ARE USED FOR TESTING THEIR RESPECTIVE VALIDATION FUNCTIONS
const _validateProfileData = () => {
  console.log("Data test 1: ", true === validateProfileData({ email: 'j.li20061212@gmail.com', firstName: 'Josh', lastName: 'Li', gender: 'Male', pronouns: 'He/Him/His' }));
  console.log("Data test 2: ", false === validateProfileData({ email: 'isThisAnEmail??@gm', firstName: 'Josh', lastName: 'Li', gender: 'Male', pronouns: 'He/Him/His' }));
  console.log("Data test 3: ", false === validateProfileData({ email: 'j.li20061212@gmail.com', firstName: '   22233notAName', lastName: 'Li', gender: 'Male', pronouns: 'He/Him/His' }));
  console.log("Data test 4: ", false === validateProfileData({ email: 'j.li20061212@gmail.com', firstName: 'Josh', lastName: '00ps223455', gender: 'Male', pronouns: 'He/Him/His' }));
  console.log("Data test 5: ", false === validateProfileData({ email: 'j.li20061212@gmail.com', firstName: 'Josh', lastName: 'Li', gender: 'minion', pronouns: 'He/Him/His' }));
  console.log("Data test 6: ", false === validateProfileData({ email: 'j.li20061212@gmail.com', firstName: 'Josh', lastName: 'Li', gender: 'Male', pronouns: 'No/Yes/Maybe' }));
  console.log("Data test 7: ", true === validateProfileData({ email: 'trueCase123@gmail.com', firstName: 'Bob', lastName: 'Biggerbob', gender: 'Other', pronouns: 'They/Them/Their' }));
}

const _validateName = () => {
  console.log("Name test 1: ", true === validateName('Robert'));
  console.log("Name test 2: ", false === validateName('125492'));
  console.log("Name test 3: ", false === validateName('   -Robert  '));
  console.log("Name test 4: ", false === validateName('  '));
  console.log("Name test 5: ", false === validateName('J'));
  console.log("Name test 6: ", false === validateName("😂"));
  console.log("Name test 7: ", true === validateName("William Shakespeare"));
  console.log("Name test 8: ", true === validateName("Anne-Marie     "));
  console.log("Name test 9: ", false === validateName("$$%@*hsii   "));
}

const _validateAge = () => {
  console.log("Age test 1: ", true === validateAge('25'));
  console.log("Age test 2: ", false === validateAge('0'));
  console.log("Age test 3: ", false === validateAge(''));
  console.log("Age test 4: ", true === validateAge('25.9'));
  console.log("Age test 5: ", false === validateAge('155'));
  console.log("Age test 6: ", false === validateAge('016'));
  console.log("Age test 7: ", false === validateAge('00205'));
  console.log("Age test 8: ", false === validateAge('000001'));
  console.log("Age test 9: ", true === validateAge('0099'));
}

const _validateEmail = () => {
  console.log("Email test 1: ", true === validateEmail("hello@gmail.com"));
  console.log("Email test 2: ", false === validateEmail("@gmail.com"));
  console.log("Email test 3: ", false === validateEmail("hellosdawdasgmail.com"));
  console.log("Email test 4: ", false === validateEmail("hello@com"));
  console.log("Email test 5: ", false === validateEmail("hello@gmail"));
  console.log("Email test 6: ", true === validateEmail("^$%oops@#@gmail.com"));
  console.log("Email test 7: ", true === validateEmail("28#@(ohsh@gmail.com"));
  // The console.log below checks for cases where an email is over 64 characters
  console.log("Email test 8: ", false === validateEmail("sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss@gmail.com"));
  console.log("Email test 9: ", true === validateEmail("82847@gmail.com"));
}

const _validateGender = () => {
  console.log("Gender test 1: ", true === validateGender("Male"));
  console.log("Gender test 2: ", true === validateGender("Female"));
  console.log("Gender test 3: ", true === validateGender("Other"));
  console.log("Gender test 4: ", false === validateGender("hello"));
  console.log("Gender test 5: ", false === validateGender("32"));
  console.log("Gender test 6: ", false === validateGender("whoops"));
}

const _validatePronouns = () => {
  console.log("Pronoun test 1: ", true === validatePronouns("He/Him/His"));
  console.log("Pronoun test 2: ", true === validatePronouns("She/Her/Hers"));
  console.log("Pronoun test 3: ", true === validatePronouns("They/Them/Their"));
  console.log("Pronoun test 4: ", false === validatePronouns("Oh/Hello/What"));
  console.log("Pronoun test 5: ", false === validatePronouns(""));
  console.log("Pronoun test 6: ", false === validatePronouns("ssssssss"));
  console.log("Pronoun test 7: ", false === validatePronouns("2/3/g"));
}

// a function that calls all the validation test functions
const main = () => {
  // calls function that tests all user's data
  console.log("\nPROFILE DATA TESTS");
  _validateProfileData();

  // calls function that tests validateName
  console.log("\nNAME TESTS:");
  _validateName();

  // calls function that tests validateAge
  console.log("\nAGE TESTS:");
  _validateAge();

  // calls function that tests validateEmail
  console.log("\nEMAIL TESTS:");
  _validateEmail();

  // calls function that tests validateGender
  console.log("\nGENDER TESTS");
  _validateGender();

  // calls function that tests validatePronouns
  console.log("\nPRONOUN TESTS")
  _validatePronouns();
}

// main();