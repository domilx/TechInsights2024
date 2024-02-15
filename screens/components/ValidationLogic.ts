import { Alert } from "react-native";


// validate given fields
// validate if the given value is empty or not, will return a bool and an error message
export async function validateEmptyField(fieldName: any, fieldValue: any) {
  try {
    // will check any type of input --> if the value is null, or of value 0
    if (fieldValue === undefined || fieldValue === null || fieldValue === '') {
      return { isValid: false, errorMessage: `${fieldName} cannot be empty` };
    // for number types
    } else if (typeof fieldValue === 'number' && fieldValue === 0) {
      return { isValid: false, errorMessage: `${fieldName} cannot be 0` };
    }
    return { isValid: true }; // validation passed
  } catch (validationError) {
    console.error(validationError);
    return { isValid: false, errorMessage: 'Validation error occurred' };
  }
}


export async function validateNewTeam(teamNumber: any, teamList: any) {
  try {
    if (!teamNumber || teamNumber.trim() === '') {
      throw new Error('Team Number cannot be empty');
    }
   
    for (const team of teamList) {
      if (team.teamNumber == teamNumber) {
        throw new Error('Team Number already exists');
       
      }
    }

    return false; // Validation passed
  } catch (validationError) {
    const error = validationError as Error;
    Alert.alert('Error Saving Team', error.message);
    return true; // Validation failed
  }
}