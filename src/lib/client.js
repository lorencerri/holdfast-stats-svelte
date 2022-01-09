import { Appwrite } from 'appwrite';

// Initialize the Appwrite client
const sdk = new Appwrite();
sdk.setEndpoint('https://app.plexidev.org/v1').setProject('paste');

export { sdk };
